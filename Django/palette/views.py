from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from palette.models import Palette,PaletteLike
from .serializers import PaletteSerializer
from django.db.models import Sum

class CreatePaletteView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        colors = request.data['colors']
        serializer = PaletteSerializer(data={'colors': colors}, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response('summit palette', status=status.HTTP_201_CREATED)


class ReadPaletteView(generics.ListAPIView):
    permission_classes = [AllowAny]
    def get(self,request,*args,**kwargs):
        order = request.query_params.get('ordering') # cratedat,likes,mypalette,colection
        if order == '-created':
            queryset = (Palette.objects.all().order_by('-created')
                        .annotate(likes=Sum('palettelike__likes'))
                        .values('id','color1','color2','color3','color4','created','likes'))
            return Response(queryset, status=status.HTTP_200_OK)
        elif order == '-like':
            queryset = (Palette.objects.all()
                        .annotate(likes=Sum('palettelike__likes'))
                        .order_by('-likes')
                        .values('id','color1','color2','color3','color4','created','likes'))
            return Response(queryset, status=status.HTTP_200_OK)
        elif order == '-collection':
            user = request.user.id
            queryset = (Palette.objects.filter(palettelike__user_id=user)
                        .annotate(likes=Sum('palettelike__likes'))
                        .order_by('created')
                        .values('id','color1','color2','color3','color4','created','likes'))
            return Response(queryset, status=status.HTTP_200_OK)
        elif order == '-mypalette':
            user = request.user.id
            queryset = (Palette.objects.filter(user_id=user)
                        .annotate(likes=Sum('palettelike__likes'))
                        .order_by('-created')
                        .values('id','color1','color2','color3','color4','created','likes'))
            return Response(queryset, status=status.HTTP_200_OK)


class LikePaletteView(generics.RetrieveUpdateDestroyAPIView):
    #permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        palette_id = request.data.get('id')
        user = request.user.id
        if not palette_id:
            return Response({"error": "Palette id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            if PaletteLike.objects.filter(palette_id=palette_id,user_id=user).exists():
                palette = PaletteLike.objects.get(palette_id=palette_id,user_id=user,likes=1)
                palette.delete()
                like = PaletteLike.objects.filter(palette_id=palette_id).aggregate(like=Sum('likes'))
                return Response(like, status=status.HTTP_200_OK)
            else :
                palette = PaletteLike.objects.create(palette_id=palette_id, user_id=user, likes=1)
                like = PaletteLike.objects.filter(palette_id=palette_id).aggregate(like=Sum('likes'))
                palette.save()
                return Response(like, status=status.HTTP_201_CREATED)

        except Palette.DoesNotExist:
            return Response({"error": "Palette not found"}, status=status.HTTP_404_NOT_FOUND)



    def get(self, request, *args, **kwargs):
        palette_id = request.query_params.get('id')
        if not palette_id:
            return Response({"error": "Palette id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            like = PaletteLike.objects.filter(palette_id=palette_id).aggregate(like=Sum('likes'))
        except Palette.DoesNotExist:
            return Response({"error": "Palette not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(like, status=status.HTTP_200_OK)
