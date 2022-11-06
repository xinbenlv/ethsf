"""Model Serializers"""

from dataclasses import dataclass

from rest_framework import serializers

from .models import Puzzle


class PuzzleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Puzzle
        fields = ['id', 'name', 'description', 'contract_address', 'created_at', 'updated_at']


@dataclass
class Puzzle:
    solution: int
    playerId: int


class PuzzleProofSerializer(serializers.Serializer):
    solution = serializers.IntegerField(read_only=True)
    playerId = serializers.IntegerField(read_only=True)

    def create(self, validated_data):
        return Puzzle(validated_data['solution'], validated_data['playerId'])

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        return instance
