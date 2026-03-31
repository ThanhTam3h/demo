from django.urls import path, include
from .views import course_list, upload_lesson_video, api_course_list

urlpatterns = [
    path('', course_list, name='course_list'),
    path("courses/", api_course_list),

    path(
        'lessons/<int:lesson_id>/upload-video/',
        upload_lesson_video,
        name='upload_lesson_video'
    ),
]