from django.db import models
from accounts.models import User

class Palette(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    color1 = models.CharField(max_length=7)
    color2 = models.CharField(max_length=7)
    color3 = models.CharField(max_length=7)
    color4 = models.CharField(max_length=7)
    like = models.ManyToManyField(User,related_name='likes',through='PaletteLike')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

class PaletteLike(models.Model):
    palette = models.ForeignKey(Palette, on_delete=models.CASCADE,related_name='palettelike')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    likes = models.IntegerField(default=0)

    class Meta:
        unique_together = ('palette', 'user')


