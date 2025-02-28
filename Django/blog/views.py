from django.urls import reverse_lazy
from django.views.generic import (
    ListView,
    DetailView,
    CreateView,
    UpdateView,
    DeleteView,
)
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from .models import Post
from .forms import PostForm, PostUpdateForm
from .serializers import PostSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import viewsets
from django.http import JsonResponse
import os
from django.shortcuts import render
from django.conf import settings
from django.shortcuts import redirect

class PostList(ListView):
    model = Post
    ordering = "-pk"
    template_name = "blog/index.html"


class PostDetail(DetailView):
    model = Post
    template_name = "blog/single_post_page.html"


class PostCreate(LoginRequiredMixin, CreateView):
    model = Post
    form_class = PostForm
    template_name = "blog/post_form.html"

    def form_valid(self, form):
        form.instance.author = self.request.user  # 현재 로그인한 사용자를 작성자로 설정
        response = super().form_valid(form)
        return response

    def get_success_url(self):
        return reverse_lazy(
            "post_detail", kwargs={"pk": self.object.pk}
        )  # 생성된 글 상세 페이지로 이동


class PostUpdate(UserPassesTestMixin, UpdateView):
    model = Post
    form_class = PostUpdateForm
    template_name = "blog/post_form.html"

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author  # 작성자만 수정 가능

    def get_success_url(self):
        return reverse_lazy(
            "post_detail", kwargs={"pk": self.object.pk}
        )  # 수정 후 해당 글로 이동


class PostDelete(UserPassesTestMixin, DeleteView):
    model = Post
    template_name = "blog/post_confirm_delete.html"
    success_url = reverse_lazy("index")  # 삭제 후 홈 화면으로 이동

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author  # 작성자만 삭제 가능


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        """Serializer에서 request 정보 전달"""
        return {"request": self.request}

def index(request):
    return render(request, "index.html")

def serve_react_frontend(request):
    """React 빌드된 index.html을 Django에서 서빙"""
    react_build_path = os.path.join(settings.BASE_DIR, "react_build", "dist")
    index_file = os.path.join(react_build_path, "index.html")

    if os.path.exists(index_file):
        return render(request, "index.html")  # ✅ Django가 템플릿에서 찾도록 변경
    return JsonResponse({"error": "React build files not found"}, status=404)

def api_root(request):
    return redirect("http://localhost:5174/")  # React 개발 서버로 이동

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
