
from django.contrib import admin
from django.urls import path
from tempmaildata.views import generate_new_email, receive_email, inbox, refresh_inbox

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/generate-email/', generate_new_email),
    path('api/receive-email/', receive_email),
    path('api/inbox/<str:address>/', inbox),
    path("api/inbox/<str:address>/refresh/", refresh_inbox),

]
