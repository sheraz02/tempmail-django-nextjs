from django.db import models
from django.utils import timezone
from datetime import timedelta

def default_expiry():
    return timezone.now() + timedelta(minutes=15)


class TempMail(models.Model):
    address = models.EmailField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=default_expiry)


    def is_expired(self):
        return timezone.now() > self.expires_at


class EmailMessage(models.Model):
    temp_mail = models.ForeignKey(TempMail, on_delete=models.CASCADE, related_name='messages')
    subject = models.CharField(max_length=255)
    sender = models.CharField(max_length=255)
    body = models.TextField()
    received_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.subject} from {self.sender}"

