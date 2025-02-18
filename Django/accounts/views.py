# views.py (로그아웃 추가)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from .serializers import SignupSerializer


class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        """
        클라이언트에서 보낸 refresh_token을 블랙리스트에 등록합니다.
        """
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # refresh token을 블랙리스트에 추가
            return Response({"detail": "성공적으로 로그아웃 되었습니다."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "로그아웃 처리 중 문제가 발생했습니다."}, status=status.HTTP_400_BAD_REQUEST)
