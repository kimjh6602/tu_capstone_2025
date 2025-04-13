from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views
from .views import PostViewSet, post_list, api_root, PostDetailView
from rest_framework.routers import DefaultRouter
from django.http import JsonResponse

from .views import CommentListCreateView, CommentRetrieveUpdateDestroyView

router = DefaultRouter()
router.register(r"posts", PostViewSet)

def index(request):
    return JsonResponse(
        {"message": "Django API is running. Access data at /blog/api/posts/"}
    )

urlpatterns = [
    # path("", index, name="home"),
    path("", api_root, name="api_root"),
    path("<int:pk>/", views.PostDetail.as_view(), name="post_detail"),
    path("new/", views.PostCreate.as_view(), name="post_create"),
    path("<int:pk>/edit/", views.PostUpdate.as_view(), name="post_update"),
    path("<int:pk>/delete/", views.PostDelete.as_view(), name="post_delete"),
    path("api/", include(router.urls)),
    path("api/posts/", post_list, name="post_list"),
    path(
        "api/posts/<int:pk>/", PostDetailView.as_view(), name="post-detail"
    ),  # 게시글 상세, 수정, 삭제
    path(
        "api/posts/<int:post_id>/comments/",
        CommentListCreateView.as_view(),
        name="comment-list-create",
    ),
    path(
        "api/comments/<int:pk>/",
        CommentRetrieveUpdateDestroyView.as_view(),
        name="comment-detail",
    ),
    ##
    path(
        "api/posts/<int:post_id>/comments/",
        CommentListCreateView.as_view(),
        name="comment-list-create",
    ),
    path(
        "api/comments/<int:pk>/",
        CommentRetrieveUpdateDestroyView.as_view(),
        name="comment-detail",
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
