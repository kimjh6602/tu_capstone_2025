# tu_capstone_2025
## -----------------------------------------------------------------------------
# Django 쉘에서 User 객체 생성하기
프로젝트 루트( manage.py 가 있는 위치)에서 shell을 실행한 뒤에, User 모델을 사용해 계정을 생성할 수 있습니다:

bash
복사
python manage.py shell
그리고 쉘 안에서:

python
복사
from django.contrib.auth import get_user_model

User = get_user_model()
# username과 password를 원하는 값으로 설정
user = User.objects.create_user(username='testuser', password='testpassword')
# 필요한 경우 이메일 등 다른 필드도 추가 가능
user.email = 'test@example.com'
user.save()
이렇게 하면 일반 유저 계정이 생성됩니다.
## -----------------------------------------------------------------------------
