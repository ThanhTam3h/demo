from django.db.models import Sum
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Course, Review, LessonProgress, Enrollment
from .serializers import (
    CourseListSerializer,
    CourseDetailSerializer,
    ReviewSerializer,
    LessonProgressSerializer,
)


class CourseListAPIView(APIView):
    authentication_classes = [TokenAuthentication] 
    permission_classes = [AllowAny]
    def get(self, request):
        user = request.user
        if user.is_authenticated and getattr(user, "role", None) == "teacher":
            queryset = Course.objects.filter(teacher=user)
        else:
            queryset = Course.objects.all() 
        serializer = CourseListSerializer(queryset, many=True)
        return Response(serializer.data)


class CourseDetailAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        try:
            course = Course.objects.prefetch_related('lessons','reviews').get(pk=pk)
        except Course.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)
        serializer = CourseDetailSerializer(course)
        return Response(serializer.data)


class DashboardAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user
        courses = Course.objects.filter(enrollments__user=user)
        total_courses = courses.count()
        if total_courses == 0:
            return Response({
                'totalCourses': 0,
                'inProgress': 0,
                'completed': 0,
                'weeklyHours': 0,
                'enrolledCourses': [],
            })
        in_progress_count = 0
        completed_count = 0
        enrolled_courses_data = []
        for course in courses:
            total_duration = course.lessons.aggregate(total=Sum('duration'))['total'] or 0
            progress = LessonProgress.objects.filter(user=user, lesson__course=course).aggregate(total=Sum('last_position'))['total'] or 0
            progress_percent = (progress / total_duration * 100) if total_duration > 0 else 0
            if progress_percent >= 100:
                completed_count += 1
            else:
                in_progress_count += 1
            enrolled_courses_data.append({
                'id': course.id,
                'title': course.title,
                'shortDescription': course.short_description if hasattr(course, 'short_description') else '',
                'progressPercent': round(progress, 2),
            })
        total_watched_seconds = LessonProgress.objects.filter(user=user).aggregate(total=Sum('last_position'))['total'] or 0
        total_watched_hours = round(total_watched_seconds / 3600, 1)
        data = {
            'totalCourses': total_courses,
            'inProgress': in_progress_count,
            'completed': completed_count,
            
            # Tạm thời gán tổng giờ học vào biến weeklyHours của Frontend
            'weeklyHours': total_watched_hours, 
            
            'enrolledCourses': enrolled_courses_data[:6], # Chỉ lấy 6 khóa gần nhất để Dashboard không bị dài quá
        }
        return Response(data)

class ReviewListAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, course_id = None):
        if course_id is None:
            return Response({'detail': 'course_id là bắt buộc.'}, status=400)
        reviews = Review.objects.filter(course_id=course_id).select_related('user')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
    def post(self, request, course_id=None):
        """Cho phép user đã đăng nhập gửi review."""
        if not request.user or not request.user.is_authenticated:
            return Response({'detail': 'Cần đăng nhập.'}, status=401)
        data = request.data.copy()
        data['course'] = course_id
        serializer = ReviewSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user, course_id=course_id)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class SaveLessonProgressAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = LessonProgressSerializer(data=request.data)
        if serializer.is_valid():
            obj, _ = LessonProgress.objects.update_or_create(
                user=request.user,
                lesson=serializer.validated_data['lesson'],
                defaults={'last_position': serializer.validated_data['last_position']},
            )
            return Response(LessonProgressSerializer(obj).data)
        return Response(serializer.errors, status=400)
    
class EnrollAPIView(APIView):
    """Đăng ký học một khoá học."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
 
    def post(self, request, course_id):
        try:
            course = Course.objects.get(pk=course_id)
        except Course.DoesNotExist:
            return Response({'detail': 'Không tìm thấy khoá học.'}, status=404)
 
        enrollment, created = Enrollment.objects.get_or_create(
            user=request.user, course=course
        )
        return Response(
            {'enrolled': True, 'created': created, 'course_id': course.id},
            status=201 if created else 200,
        )