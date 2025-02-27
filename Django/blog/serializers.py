from rest_framework import serializers
from .models import Post
from django.conf import settings


class PostSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)  # ✅ 절대 경로 반환
        return None

    class Meta:
        model = Post
        fields = "__all__"


# from rest_framework import serializers
# from .models import Post


# class PostSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Post
#         fields = [
#             "id",
#             "title",
#             "content",
#             "image",
#             "author",
#             "created_at",
#             "updated_at",
#         ]
