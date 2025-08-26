from rest_framework import serializers
from .models import EmailMessage

class EmailMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailMessage
        fields = ["id", "sender", "subject", "body", "received_at"]