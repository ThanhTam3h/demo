from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Course
from .serializers import CourseListSerializer, CourseDetailSerializer


class CourseListAPIView(APIView):
    def get(self, request):
        queryset = Course.objects.all()
        serializer = CourseListSerializer(queryset, many=True)
        return Response(serializer.data)


class CourseDetailAPIView(APIView):
    def get(self, request, pk):
        try:
            course = Course.objects.prefetch_related('lessons').get(pk=pk)
        except Course.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)
        serializer = CourseDetailSerializer(course)
        return Response(serializer.data)


class DashboardAPIView(APIView):
    def get(self, request):
        courses = Course.objects.all()
        total_courses = courses.count()
        in_progress = min(total_courses, 3)
        completed = max(0, total_courses - in_progress)

        enrolled_courses = CourseListSerializer(courses[:6], many=True).data

        data = {
            'totalCourses': total_courses,
            'inProgress': in_progress,
            'completed': completed,
            'weeklyHours': 5.5,
            'enrolledCourses': enrolled_courses,
        }
        return Response(data)
