from django.shortcuts import render
from .models import Course, Lesson
from django.http import JsonResponse
import cloudinary.uploader

from django.http import JsonResponse
from .models import Course

def api_course_list(request):
    courses = Course.objects.all()

    data = [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
        }
        for c in courses
    ]

    return JsonResponse(data, safe=False)


def course_list(request):
    courses = Course.objects.all() # Lấy tất cả khóa học
    return render(request, 'courses/course_list.html', {'courses': courses})

def upload_lesson_video(request, lesson_id):

    lesson = Lesson.objects.get(id=lesson_id)

    video_file = request.FILES.get("video")

    result = cloudinary.uploader.upload(
        video_file,
        resource_type="video"
    )

    lesson.video_url = result["secure_url"]
    lesson.save()

    return JsonResponse({
        "video_url": lesson.video_url
    })