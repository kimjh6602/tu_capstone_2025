from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from .models import Post
from .forms import PostForm, PostUpdateForm

class PostList(ListView):
    model = Post
    ordering = '-pk'
    template_name = 'blog/index.html'

class PostDetail(DetailView):
    model = Post
    template_name = 'blog/single_post_page.html'

class PostCreate(LoginRequiredMixin, CreateView):
    model = Post
    form_class = PostForm
    template_name = 'blog/post_form.html'

    def form_valid(self, form):
        form.instance.author = self.request.user  # 현재 로그인한 사용자를 작성자로 설정
        response = super().form_valid(form)
        return response

    def get_success_url(self):
        return reverse_lazy('post_detail', kwargs={'pk': self.object.pk})  # 생성된 글 상세 페이지로 이동

class PostUpdate(UserPassesTestMixin, UpdateView):
    model = Post
    form_class = PostUpdateForm
    template_name = 'blog/post_form.html'

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author  # 작성자만 수정 가능

    def get_success_url(self):
        return reverse_lazy('post_detail', kwargs={'pk': self.object.pk})  # 수정 후 해당 글로 이동

class PostDelete(UserPassesTestMixin, DeleteView):
    model = Post
    template_name = 'blog/post_confirm_delete.html'
    success_url = reverse_lazy('index')  # 삭제 후 홈 화면으로 이동

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author  # 작성자만 삭제 가능