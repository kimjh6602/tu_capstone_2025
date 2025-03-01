from django.db import models
from accounts.models import User

class Palette(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    color1 = models.CharField(max_length=7)
    color2 = models.CharField(max_length=7)
    color3 = models.CharField(max_length=7)
    color4 = models.CharField(max_length=7)
    like = models.IntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

class Tag(models.Model):
    id = models.AutoField(primary_key=True)
    color = models.CharField(max_length=7)

class PaletteTag(models.Model):
    id = models.AutoField(primary_key=True)
    paletteid = models.ForeignKey(Palette, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)


