from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from palette.models import Palette
from .serializers import PaletteSerializer

class CreatePaletteView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        colors = request.data['colors']
        serializer = PaletteSerializer(data={'colors': colors}, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response('summit palette', status=status.HTTP_201_CREATED)


class ReadPaletteView(generics.ListAPIView):

    def get(self,request,*args,**kwargs):
        queryset = Palette.objects.all().values('id','color1','color2','color3','color4','like','created')
        return Response(queryset,status=status.HTTP_200_OK)


class LikePaletteView(generics.RetrieveUpdateDestroyAPIView):
    #permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        palette_id = request.data.get('id')
        if not palette_id:
            return Response({"error": "Palette id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            palette = Palette.objects.get(id=palette_id)
        except Palette.DoesNotExist:
            return Response({"error": "Palette not found"}, status=status.HTTP_404_NOT_FOUND)

        palette.like += 1
        palette.save()

        return Response({"like": palette.like}, status=status.HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        palette_id = request.query_params.get('id')
        if not palette_id:
            return Response({"error": "Palette id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            palette = Palette.objects.get(id=palette_id)
        except Palette.DoesNotExist:
            return Response({"error": "Palette not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({'like': palette.like}, status=status.HTTP_200_OK)
