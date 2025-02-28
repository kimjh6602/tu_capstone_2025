from rest_framework import serializers
from .models import Post
from django.conf import settings


class PostSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None

    # def get_image_url(self, obj):
    #     request = self.context.get("request")
    #     if obj.image:
    #         return request.build_absolute_uri(obj.image.url)
    #     return None

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'image', 'image_url', 'created_at', 'updated_at']

    # def get_image(self, obj):
    #     request = self.context.get("request")
    #     if obj.image:
    #         if request:
    #             return request.build_absolute_uri(obj.image.url)  # ✅ 절대 경로 반환
    #         return f"{settings.MEDIA_URL}{obj.image.name}"  # ✅ request 없을 경우 기본 경로 반환
    #     return None

    # class Meta:
    #     model = Post
    #     fields = "__all__"


# def get_image(self, obj):
#     request = self.context.get("request")
#     if obj.image:
#         if request:
#             return request.build_absolute_uri(obj.image.url)  # ✅ 절대 경로
#         return f"{settings.MEDIA_URL}{obj.image}"  # ✅ 상대 경로
#     return None


# from rest_framework import serializers
# from .models import Post
# from django.conf import settings


# class PostSerializer(serializers.ModelSerializer):
#     image = serializers.SerializerMethodField()

#     def get_image(self, obj):
#         request = self.context.get("request")
#         if obj.image:
#             return request.build_absolute_uri(obj.image.url)  # ✅ 절대 경로 반환
#         return None

#     class Meta:
#         model = Post
#         fields = "__all__"
