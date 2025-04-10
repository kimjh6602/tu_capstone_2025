from django.db.models.functions import Coalesce
from rest_framework import generics, status
from django.db.models import Exists, OuterRef
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from palette.models import Palette,PaletteLike
from .serializers import PaletteSerializer
from django.db.models import Sum , Value

class CreatePaletteView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        colors = request.data['colors']
        serializer = PaletteSerializer(data={'colors': colors}, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response('summit palette', status=status.HTTP_201_CREATED)


class ReadPaletteView(generics.ListAPIView):
    permission_classes = [AllowAny]
    # 여기서 테이블을 눌렀는지 안눌렀는지에 대해 판단
    def get(self,request,*args,**kwargs):
        order = request.query_params.get('ordering') # cratedat,likes,mypalette,colection
        like_qs = PaletteLike.objects.filter(
            palette = OuterRef('pk'),
            user = request.user.id
        )
        if order == '-created':
            queryset = (Palette.objects.all()
                        .annotate(liked=Exists(like_qs))
                        .order_by('-created')
                        .values('id','color1','color2','color3','color4','created','like_count','liked'))
            return Response(queryset, status=status.HTTP_200_OK)
        elif order == '-like':
            queryset = (Palette.objects.all()
                        .annotate(liked=Exists(like_qs))
                        .order_by('-like_count')
                        .values('id','color1','color2','color3','color4','created','like_count','liked'))
            return Response(queryset, status=status.HTTP_200_OK)
        elif order == '-collection':
            user = request.user.id
            queryset = (Palette.objects.filter(palettelike__user_id=user)
                        .annotate(liked=Exists(like_qs))
                        .order_by('created')
                        .values('id','color1','color2','color3','color4','created','like_count','liked'))
            return Response(queryset, status=status.HTTP_200_OK)
        elif order == '-mypalette':
            user = request.user.id
            queryset = (Palette.objects.filter(user_id=user)
                        .annotate(liked=Exists(like_qs))
                        .order_by('-created')
                        .values('id','color1','color2','color3','color4','created','like_count','liked'))
            return Response(queryset, status=status.HTTP_200_OK)


class LikePaletteView(generics.ListAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        palette_id = request.data.get('id')
        user = request.user.id
        if not palette_id:
            return Response({"error": "Palette id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            if PaletteLike.objects.filter(palette_id=palette_id,user_id=user).exists():
                return Response({"error:": "palette is exists"}, status=status.HTTP_400_BAD_REQUEST)
            else : # 존재하지않는경우.
                palette = PaletteLike.objects.create(palette_id=palette_id, user_id=user, likes=1)
                count = Palette.objects.get(id=palette_id)
                count.like_count += 1
                count.save()
                palette.save()
                like = Palette.objects.filter(id=palette_id).values('like_count')
                return Response(like, status=status.HTTP_201_CREATED)
        except Palette.DoesNotExist:
            return Response({"error": "Palette not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self,request):
        palette_id = request.data.get('id')
        user = request.user.id
        if not palette_id : #지워야 하는데 없는경우
            return Response({"error": "palette is not exists"},status = status.HTTP_400_BAD_REQUEST)
        else :
            palette = PaletteLike.objects.filter(palette_id=palette_id,user_id=user)
            palette.delete()
            count = Palette.objects.get(id=palette_id)
            count.like_count -= 1
            count.save()
            return Response({"palette deleted"},status = status.HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        palette_id = request.query_params.get('id')
        user = request.user.id
        if not palette_id:
            return Response({"error": "Palette id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            like = PaletteLike.objects.filter(palette_id=palette_id).aggregate(like=Coalesce(Sum('likes'),Value(0)))
        except Palette.DoesNotExist:
            return Response({"error": "Palette not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(like, status=status.HTTP_200_OK)


class PaletteDetailView(generics.ListAPIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        palette_id = request.query_params.get('id')
        if not palette_id:
            return Response(
                {"error": "Palette id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            palette = Palette.objects.get(id=palette_id)
        except Palette.DoesNotExist:
            return Response(
                {"error": "Palette not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = PaletteSerializer(palette)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def delete(self, request):
        palette_id = request.data.get('id')
        if not palette_id:
            return Response(
                    {"error": "Palette id is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        try:
            palette = Palette.objects.get(id=palette_id)
        except Palette.DoesNotExist:
            return Response(
                {"error": "Palette not found"},
                status=status.HTTP_404_NOT_FOUND
                )
        palette.delete()
        return Response({"message": "Palette deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, *args, **kwargs):
        palette_id = request.data.get('palette_id')
        colors = request.data.get('colors')

        if not palette_id:
            return Response(
                {"error": "Palette id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not colors or not isinstance(colors, list) or len(colors) < 4:
            return Response(
                {"error": "A valid colors array with at least 4 colors is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            palette = Palette.objects.get(id=palette_id)
        except Palette.DoesNotExist:
            return Response(
                {"error": "Palette not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            # 색상 배열의 첫 4개 값을 사용하여 업데이트 (필요한 경우 로직 수정)
            palette.color1 = colors[0]
            palette.color2 = colors[1]
            palette.color3 = colors[2]
            palette.color4 = colors[3]
            palette.save()
        except Exception as e:
            return Response(
                {"error": f"Error updating palette: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = PaletteSerializer(palette)
        return Response(serializer.data, status=status.HTTP_200_OK)