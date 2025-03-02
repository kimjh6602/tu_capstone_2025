from django.urls import path
from .views import SignupView, CheckEmailView

urlpatterns = [

    path('api/signup/', SignupView.as_view(), name='signup'),
    path('emailcheck/', CheckEmailView.as_view(), name='check_email'),
]
