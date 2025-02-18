# urls.py
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView
)
from .views import SignupView, LogoutView

urlpatterns = [
    # 회원가입 엔드포인트
    path('api/signup/', SignupView.as_view(), name='signup'),

    # JWT 로그인: access, refresh 토큰 발급
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', TokenBlacklistView.as_view(), name='logout'),
]
