from django.urls import path
from .views import SignupView, CheckEmailView

urlpatterns = [
    # 회원가입 엔드포인트
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('emailcheck/', CheckEmailView.as_view(), name='check_email'),
]
