from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()  # 작성자 정보 추가

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "content",
            "image",
            "image_url",
            "created_at",
            "updated_at",
            "author",
        ]

    def get_image_url(self, obj):
        if obj.image:
            return self.context["request"].build_absolute_uri(obj.image.url)
        return None

    def get_author(self, obj):
        """작성자가 존재하면 username 반환, 없으면 None"""
        if obj.author:
            return {"id": obj.author.id, "username": obj.author.username}
        return None