from rest_framework import serializers
from .models import Post
from django.conf import settings


class PostSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'image', 'image_url', 'created_at', 'updated_at']