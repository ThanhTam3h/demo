from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100)
    # Ví dụ: Toán 12, Vật lý 12...

    def __str__(self) -> str:
        return self.name


class Course(models.Model):
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='authored_courses',
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name='courses',
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='course_thumbnails/', blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_premium_only = models.BooleanField(default=True)  # Để phân biệt khóa học cho hội viên

    # Thông tin phục vụ giao diện ôn thi lớp 12
    subject = models.CharField(
        max_length=100,
        blank=True,
        help_text='Ví dụ: Toán 12, Vật lý 12',
    )
    exam_blocks = models.CharField(
        max_length=50,
        blank=True,
        help_text='Các khối thi, ví dụ: A00;A01',
    )

    def __str__(self) -> str:
        return self.title


class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    video_url = models.URLField(blank=True)  # Link video từ Cloudinary/S3
    content = models.TextField(blank=True)
    order = models.PositiveIntegerField()  # Thứ tự bài học 1, 2, 3...
    is_preview = models.BooleanField(default=False)  # Bài này có cho xem miễn phí không?
    duration = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Video duration in seconds"
    )

    class Meta:
        ordering = ['order']

    def __str__(self) -> str:
        return f"{self.course.title} - {self.title}"
    

class Enrollment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)

    # Mỗi người chỉ được đăng ký một lần cho mỗi khóa học
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'course'], 
                name='unique_user_course_enrollment'
            )
        ]

    def __str__(self):
        return f"{self.user.username} enrolled in {self.course.title}"

# Lưu tiến độ video của học viên
class LessonProgress(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="lesson_progress"
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="progress_records"
    )
    last_position = models.FloatField(
        help_text="Video position in seconds"
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'lesson'],
                name='unique_user_lesson_progress'
            )
        ]
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['lesson']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title} ({self.last_position}s)"


# Review và rating cho khóa học
class Review(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    rating = models.IntegerField(
        help_text="Rating from 1 to 5"
    )
    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'course'],
                name='unique_user_course_review'
            )
        ]
        indexes = [
            models.Index(fields=['course']),
        ]

    def __str__(self):
        return f"{self.user.username} rated {self.course.title} ({self.rating}/5)"