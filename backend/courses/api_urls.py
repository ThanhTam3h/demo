from django.urls import path

from .api_views import (
    CourseListAPIView, 
    CourseDetailAPIView, 
    DashboardAPIView, 
    ReviewListAPIView,
    SaveLessonProgressAPIView,
)
urlpatterns = [
    path('courses/', CourseListAPIView.as_view(), name='api_courses_list'),
    path('courses/<int:pk>/', CourseDetailAPIView.as_view(), name='api_courses_detail'),
    path('dashboard/', DashboardAPIView.as_view(), name='api_dashboard'),
    path("reviews/", ReviewListAPIView.as_view(), name="api_reviews"),
    path("courses/<int:course_id>/reviews/", ReviewListAPIView.as_view()),
    path("lesson-progress/", SaveLessonProgressAPIView.as_view()),
]
