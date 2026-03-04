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
    video_url = models.URLField()  # Link video từ Cloudinary/S3
    content = models.TextField(blank=True)
    order = models.PositiveIntegerField()  # Thứ tự bài học 1, 2, 3...
    is_preview = models.BooleanField(default=False)  # Bài này có cho xem miễn phí không?

    class Meta:
        ordering = ['order']

    def __str__(self) -> str:
        return f"{self.course.title} - {self.title}"