from django.urls import reverse_lazy
from django.views.generic import (
    ListView,
    DetailView,
    CreateView,
    UpdateView,
    DeleteView,
)
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from .models import Post, PostImage, Comment
from .forms import PostForm, PostUpdateForm
from .serializers import PostSerializer, CommentSerializer
from rest_framework.permissions import (
    IsAuthenticatedOrReadOnly,
    IsAuthenticated,
    BasePermission,
)
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import viewsets, permissions, generics
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.conf import settings
import os

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.method in permissions.SAFE_METHODS or obj.author == request.user


class PostList(ListView):
    model = Post
    ordering = "-pk"
    template_name = "blog/index.html"


class PostDetail(DetailView):
    model = Post
    template_name = "blog/single_post_page.html"
    context_object_name = "post"


class PostCreate(LoginRequiredMixin, CreateView):
    model = Post
    form_class = PostForm
    template_name = "blog/post_form.html"

    def form_valid(self, form):
        form.instance.author = self.request.user
        response = super().form_valid(form)
        return response

    def get_success_url(self):
        return reverse_lazy("post_detail", kwargs={"pk": self.object.pk})


class PostUpdate(UserPassesTestMixin, UpdateView):
    model = Post
    form_class = PostUpdateForm
    template_name = "blog/post_form.html"

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author

    def get_success_url(self):
        return reverse_lazy("post_detail", kwargs={"pk": self.object.pk})


class PostDelete(UserPassesTestMixin, DeleteView):
    model = Post
    template_name = "blog/post_confirm_delete.html"
    success_url = reverse_lazy("index")

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsOwnerOrReadOnly] 

    def perform_create(self, serializer):
        post = serializer.save(author=self.request.user)
        for image in self.request.FILES.getlist("images"):
            PostImage.objects.create(post=post, image=image)

    def perform_update(self, serializer):
        post = serializer.save()
        if self.request.FILES:
            post.images.all().delete()
            for image in self.request.FILES.getlist("images"):
                PostImage.objects.create(post=post, image=image)

    def get_serializer_context(self):
        return {"request": self.request}

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsOwnerOrReadOnly] 


def index(request):
    return render(request, "index.html")


def serve_react_frontend(request):
    react_build_path = os.path.join(settings.BASE_DIR, "react_build", "dist")
    index_file = os.path.join(react_build_path, "index.html")

    if os.path.exists(index_file):
        return render(request, "index.html")
    return JsonResponse({"error": "React build files not found"}, status=404)


def api_root(request):
    return redirect("http://localhost:5174/")


def post_list(request):
    posts = [
        {
            "id": 1,
            "title": "First Post",
            "content": "This is my first post!",
            "image": None,
        },
        {
            "id": 2,
            "title": "Second Post",
            "content": "This is another post!",
            "image": None,
        },
    ]
    return JsonResponse(posts, safe=False)

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs["post_id"]).order_by(
            "created_at"
        )

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, post_id=self.kwargs["post_id"])

class CommentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsOwnerOrReadOnly]