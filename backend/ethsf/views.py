from rest_framework import viewsets
from .models import Puzzle
from .serializers import PuzzleSerializer


class PuzzleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Puzzle.objects.all()
    serializer_class = PuzzleSerializer
