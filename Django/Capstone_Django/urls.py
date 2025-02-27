from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
import os

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)


def serve_react_frontend(request):
    """React 빌드된 index.html을 Django에서 서빙"""
    react_build_path = os.path.join(settings.BASE_DIR, "react_build", "dist")
    index_file = os.path.join(react_build_path, "index.html")

    if os.path.exists(index_file):
        return render(request, index_file)  # ✅ React 빌드된 HTML 서빙
    return JsonResponse({"error": "React build files not found"}, status=404)
    # return render(request, 'index.html')

urlpatterns = [
    path("admin/", admin.site.urls),
    path("blog/", include("blog.urls")),
    path("accounts/", include("accounts.urls")),
    path("", serve_react_frontend),
    # JWT 기반 인증
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/logout/", TokenBlacklistView.as_view(), name="logout"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(
        "/", document_root=os.path.join(settings.BASE_DIR, "react_build", "dist")
    )
