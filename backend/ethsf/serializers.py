"""Model Serializers"""

from .models import Puzzle
from rest_framework import serializers


class PuzzleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Puzzle
        fields = ['id', 'name', 'description', 'contract_address', 'created_at', 'updated_at']
