from .models import *
from django.urls import path

from .views import ReadPaletteView, CreatePaletteView, LikePaletteView, PaletteDetailView, PaletteCollectionView
from .views import PaletteStatusView

urlpatterns = [

    path('api/read/', ReadPaletteView.as_view(), name='read_palette'),
    path('api/create/', CreatePaletteView.as_view(), name='create_palette'),
    path('api/like/', LikePaletteView.as_view(), name='like_palette'),
    path('api/detail/',PaletteDetailView.as_view(), name='palette_detail'),
    path('api/collection/',PaletteCollectionView.as_view(),name='palette_collection'),
    path('api/collection/status/',PaletteStatusView.as_view(),name='palette_collection_status'),

]

