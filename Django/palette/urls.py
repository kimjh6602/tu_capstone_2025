from .models import *
from django.urls import path

from .views import ReadPaletteView, CreatePaletteView, LikePaletteView

urlpatterns = [

    path('api/read/', ReadPaletteView.as_view(), name='read_palette'),
    path('api/create/', CreatePaletteView.as_view(), name='create_palette'),
    path('api/like/', LikePaletteView.as_view(), name='like_palette'),
]

