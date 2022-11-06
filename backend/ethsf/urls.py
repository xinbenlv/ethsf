from django.urls import path, include

from rest_framework import routers

from .views import PuzzleViewSet

router = routers.DefaultRouter()
router.register(r'puzzles', PuzzleViewSet)

urlpatterns = [
    path('', include(router.urls))
]
