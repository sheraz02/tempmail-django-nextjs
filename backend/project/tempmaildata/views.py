from django.shortcuts import render
from rest_framework.decorators import api_view
import random, string
from .models import TempMail, EmailMessage
from rest_framework.response import Response
from rest_framework import status
from django.utils.dateformat import format
from .serializers import EmailMessageSerializer
from django.utils.dateparse import parse_datetime

@api_view(['GET'])
def generate_new_email(request):
    try:
        username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
        address = f"{username}@sheraz.com"
        temp_mail = TempMail.objects.create(address=address)

        response_data = {
            "email": temp_mail.address,
            "expires_at": format(temp_mail.expires_at, "d-m-Y h:i:A")
        }
        return Response(response_data, status=status.HTTP_201_CREATED)
    except:
        error_response = {
            "error": "Failed to generate temporary email"
        }
        return Response(error_response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def receive_email(request):
    to_addr = request.data.get('to')
    subject = request.data.get('subject')
    body = request.data.get('body')
    sender = request.data.get('from')

    try:
        temp_mail = TempMail.objects.get(address=to_addr)
        if temp_mail.is_expired():
            data  = {
                "error": "Temporary email has expired",
            }
            return Response(data=data, status=status.HTTP_404_NOT_FOUND)
        EmailMessage.objects.create(
            temp_mail=temp_mail,
            subject=subject,
            sender=sender,
            body=body
        )
        return Response({"status": "stored", "message": "Email received successfully"}, status=status.HTTP_201_CREATED)
    except TempMail.DoesNotExist:
        return Response({"error": "Temporary email not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def inbox(request, address):
    try:
        temp_mail = TempMail.objects.get(address=address)
        if temp_mail.is_expired():
            return Response({"error": "Temporary email has expired"}, status=status.HTTP_410_GONE)

        messages = temp_mail.messages.all().order_by("-received_at")
        serializer = EmailMessageSerializer(messages, many=True)
        return Response({
            "email": temp_mail.address,
            "messages": serializer.data
        })
    except TempMail.DoesNotExist:
        return Response({"error": "Email address not found"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['GET'])
def refresh_inbox(request, address):
    try:
        temp_mail = TempMail.objects.get(address=address)
        if temp_mail.is_expired():
            return Response({"error": "Temporary email has expired"}, status=status.HTTP_410_GONE)

        # Optionally, you can filter only unread messages
        messages = temp_mail.messages.filter(read=False).order_by("-received_at")
        serializer = EmailMessageSerializer(messages, many=True)

        # Mark them as read after sending (if needed)
        temp_mail.messages.filter(id__in=[m["id"] for m in serializer.data]).update(read=True)

        return Response({"messages": serializer.data})
    except TempMail.DoesNotExist:
        return Response({"error": "Email address not found"}, status=status.HTTP_404_NOT_FOUND)
