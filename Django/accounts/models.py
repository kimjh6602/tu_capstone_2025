from django.db import models

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):

    class Meta:
        db_table = 'User'
    nickname = models.CharField(max_length=100, blank=True)
    tell = models.CharField(max_length=100, blank=True,null = True)
    ##profile_image = models.ImageField(upload_to='profile_image/', blank=True)
    ## 이미지관련 settings.py에 추가 설정 필요.
    followers = models.ManyToManyField(
        'self',
        symmetrical = False
        ,related_name='followings',
        blank=True)

    def __str__(self):
        return self.username

class UserHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

