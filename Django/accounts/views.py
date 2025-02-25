from django.contrib.auth.models import update_last_login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from .serializers import SignupSerializer
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

class CheckUsernameView(APIView):
    def get(self, request):
        username = request.query_params.get("username")
        if not username:
            return Response(
                {"error": "ID를 입력해주세요.", "available": None},
                status=status.HTTP_400_BAD_REQUEST
            )
        exists = User.objects.filter(username=username).exists()
        return Response(
            {"available": not exists},  # exists가 True면 사용중이므로 available은 False
            status=status.HTTP_200_OK
        )

class CheckEmailView(APIView):
    def get(self,request):
        email = request.query_params.get("email")
        if not email:
            return Response({"error":"이메일을 입력해주세요.", "available":None},
                            status=status.HTTP_400_BAD_REQUEST)
        exists = User.objects.filter(email=email).exists()
        return Response({"available": not exists}, status=status.HTTP_200_OK)

class SignupView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        serializer_class = SignupSerializer(data=request.data)
        if serializer_class.is_valid():
            serializer_class.save()
            return Response({"message":"회원가입에 성공하였습니다."}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer_class.errors, status=status.HTTP_400_BAD_REQUEST)