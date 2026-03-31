from rest_framework import serializers

from .models import Course, Lesson, Review, LessonProgress


class LessonSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ['id', 'title', "video_url",'duration', 'is_preview']

    def get_duration(self, obj) -> str:
        if obj.duration:
            minutes = obj.duration // 60
            return f'{minutes} phút'
        return '20 phút'


class CourseListSerializer(serializers.ModelSerializer):
    shortDescription = serializers.SerializerMethodField()
    level = serializers.SerializerMethodField()
    levelColor = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    examBlocks = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'shortDescription',
            'level',
            'levelColor',
            'duration',
            'tags',
            'examBlocks',
            'progress',
        ]

    def get_shortDescription(self, obj) -> str:
        if not obj.description:
            return ''
        text = obj.description.strip()
        return text if len(text) <= 140 else text[:137] + '...'

    def get_level(self, obj) -> str:
        return 'Cơ bản'

    def get_levelColor(self, obj) -> str:
        return 'green'

    def get_duration(self, obj) -> str:
        total = sum(lesson.duration or 0 for lesson in obj.lessons.all())
        hours = total // 3600
        return f"{hours} giờ học"

    def get_tags(self, obj):
        tags = []
        if obj.subject:
            tags.append(obj.subject)
        if obj.exam_blocks:
            for block in obj.exam_blocks.split(';'):
                block = block.strip()
                if block:
                    tags.append(f'Khối {block}')
        return tags

    def get_examBlocks(self, obj):
        if not obj.exam_blocks:
            return []
        return [b.strip() for b in obj.exam_blocks.split(';') if b.strip()]

    def get_progress(self, obj) -> int:
        # Sau này có thể tính theo tiến độ thật của từng học sinh
        return 0


class CourseDetailSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    level = serializers.SerializerMethodField()
    levelColor = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    examBlocks = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'description',
            'level', 'levelColor', 'duration',
            'examBlocks', 'tags',
            'lessons',]
        
    def get_level(self, obj) -> str:
        return 'Cơ bản'
 
    def get_levelColor(self, obj) -> str:
        return 'blue'
 
    def get_duration(self, obj) -> str:
        total = sum(lesson.duration or 0 for lesson in obj.lessons.all())
        hours = total // 3600
        return f'{hours} giờ học' if hours > 0 else 'Đang cập nhật'
 
    def get_examBlocks(self, obj):
        if not obj.exam_blocks:
            return []
        return [b.strip() for b in obj.exam_blocks.split(';') if b.strip()]
 
    def get_tags(self, obj):
        tags = []
        if obj.subject:
            tags.append(obj.subject)
        if obj.exam_blocks:
            for block in obj.exam_blocks.split(';'):
                block = block.strip()
                if block:
                    tags.append(f'Khối {block}')
        return tags

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    createdAt = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id',
            'username',
            'rating',
            'comment',
            'createdAt',
        ]
        extra_kwargs = {
            'rating': {'required': True},
        }

    def get_username(self, obj) -> str:
        return obj.user.username

    def get_createdAt(self, obj) -> str:
        return obj.created_at.strftime("%d/%m/%Y")
    
class LessonProgressSerializer(serializers.ModelSerializer):
    lessonTitle = serializers.SerializerMethodField()
    updatedAt = serializers.SerializerMethodField()

    class Meta:
        model = LessonProgress
        fields = [
            'id',
            'lesson',
            'lessonTitle',
            'last_position', # thời điểm video đã xem (tính bằng giây)
            'updatedAt',
        ]

    def get_lessonTitle(self, obj) -> str:
        return obj.lesson.title

    def get_updatedAt(self, obj) -> str:
        return obj.updated_at.strftime("%d/%m/%Y %H:%M")