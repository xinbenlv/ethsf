from django.urls import path, include

from rest_framework import routers

from .views import PuzzleViewSet, prove_puzzle

router = routers.DefaultRouter()
router.register(r'puzzles', PuzzleViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('prove/', prove_puzzle),
]
