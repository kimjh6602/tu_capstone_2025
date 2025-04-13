from rest_framework import serializers
from .models import Post, PostImage, Comment


class PostImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PostImage
        fields = ["id", "image_url"]

    def get_image_url(self, obj):
        return self.context["request"].build_absolute_uri(obj.image.url)


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id", "content", "created_at", "updated_at", "author"]

    def get_author(self, obj):
        return {"id": obj.author.id, "username": obj.author.username}


class PostSerializer(serializers.ModelSerializer):
    images = PostImageSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    author = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField() 
    current_user_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "content",
            "images",
            "created_at",
            "updated_at",
            "author",
            "comments",
            "likes_count",
            "current_user_liked",
        ]

    def get_author(self, obj):
        if obj.author:
            return {"id": obj.author.id, "username": obj.author.username}
        return None

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_current_user_liked(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False
