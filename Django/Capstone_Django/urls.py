from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView
)

def redirect_to_blog(request):
    return redirect('/blog/')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('blog/', include('blog.urls')),
    path('', redirect_to_blog),  # Root URL -> /blog/
    path('accounts/', include('accounts.urls')),

    # JWT 기반 인증
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', TokenBlacklistView.as_view(), name='logout'),
]
