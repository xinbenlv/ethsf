from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Puzzle
from .puzzle import get_puzzle_proof
from .serializers import PuzzleSerializer, PuzzleProofSerializer


class PuzzleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Puzzle.objects.all()
    serializer_class = PuzzleSerializer


@api_view(['POST'])
def prove_puzzle(request):
    """Temp"""
    if request.method == 'POST':
        player_id = request.data.get('playerId')
        solution = request.data.get('solution')
        if type(player_id) == int and type(solution) == int:
            data = get_puzzle_proof(solution, player_id)
            return Response(data, status=status.HTTP_200_OK)
        return Response("error", status=status.HTTP_400_BAD_REQUEST)
