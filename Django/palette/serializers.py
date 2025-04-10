from rest_framework import serializers
from .models import Palette,PaletteLike

class PaletteSerializer(serializers.ModelSerializer):
    colors = serializers.ListField(
        child=serializers.CharField(max_length=7),
        write_only=True,
    )
    class Meta:
        model = Palette
        fields = ['id', 'user', 'colors', 'color1', 'color2', 'color3', 'color4','like_count','created']
        read_only_fields = ['user', 'color1', 'color2', 'color3', 'color4']

    def create(self, validated_data):
        colors = validated_data.pop('colors')
        user = self.context['request'].user
        palette = Palette.objects.create(
            user=user,
            color1=colors[0],
            color2=colors[1],
            color3=colors[2],
            color4=colors[3],
        )
        palette.save()

        return palette

