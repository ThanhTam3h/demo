from rest_framework import serializers

from .models import Course, Lesson


class LessonSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'duration']

    def get_duration(self, obj) -> str:
        # Tạm thời không có trường duration trong DB, bạn có thể tính theo thời lượng video nếu muốn
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
        # Bạn có thể thay bằng trường riêng trong DB nếu muốn
        return '20 giờ học'

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

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'lessons']
