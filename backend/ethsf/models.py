from django.db import models


class Puzzle(models.Model):
    DESC_TRUNCATE_LEN = 30

    name = models.CharField(max_length=30)
    description = models.CharField(max_length=2000)
    # circuit characteristics
    contract_address = models.CharField(max_length=42)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        desc = self.description
        if len(desc) > self.DESC_TRUNCATE_LEN:
            desc = self.description[:27]+"..."
        return f"Puzzle<name='{self.name}', description='{desc}'>"
