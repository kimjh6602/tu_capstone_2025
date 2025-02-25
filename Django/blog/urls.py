from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path("", views.PostList.as_view(), name="index"),
    path("<int:pk>/", views.PostDetail.as_view(), name="post_detail"),
    path("new/", views.PostCreate.as_view(), name="post_create"),
    path("<int:pk>/edit/", views.PostUpdate.as_view(), name="post_update"),
    path("<int:pk>/delete/", views.PostDelete.as_view(), name="post_delete"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)