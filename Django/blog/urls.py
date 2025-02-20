from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.PostList.as_view(), name='index'),
    path('<int:pk>/', views.PostDetail.as_view(), name='post_detail'),
    path('new/', views.PostCreate.as_view(), name='post_create'),
    path('<int:pk>/edit/', views.PostUpdate.as_view(), name='post_update'),
    path('<int:pk>/delete/', views.PostDelete.as_view(), name='post_delete'),
]
