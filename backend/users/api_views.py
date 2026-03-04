from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


User = get_user_model()


class RegisterAPIView(APIView):
    """Đăng ký tài khoản mới bằng email + mật khẩu.

    Frontend gửi JSON: {"fullName": "...", "email": "...", "password": "..."}
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        full_name = (request.data.get('fullName') or '').strip()
        email = (request.data.get('email') or '').strip().lower()
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'detail': 'Email và mật khẩu là bắt buộc.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {'detail': 'Email đã tồn tại.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(username=email, email=email, password=password)
        if full_name:
            user.first_name = full_name
            user.save(update_fields=['first_name'])

        return Response(
            {
                'id': user.id,
                'email': user.email,
                'fullName': user.first_name,
                'role': getattr(user, 'role', None),
                'token': None,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginAPIView(APIView):
    """Đăng nhập bằng email + mật khẩu.

    Frontend gửi JSON: {"email": "...", "password": "..."}
    Trả về user info (chưa triển khai JWT, token tạm thời là null).
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email = (request.data.get('email') or '').strip().lower()
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'detail': 'Email và mật khẩu là bắt buộc.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response(
                {'detail': 'Email hoặc mật khẩu không đúng.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                'token': None,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'fullName': user.first_name,
                    'role': getattr(user, 'role', None),
                },
            }
        )
