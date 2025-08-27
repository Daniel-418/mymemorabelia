from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

# Create your models here.
#Custom User to include timezone
class CustomUser(AbstractUser):
    timezone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Capsule(models.Model):
    """
    A time capsule to store a memory that will be delivered back
    to the user's email.
    Fields:
    - title/body: capsule text content
    - deliver_on: target date for delivery
    - delivered_at: when delivery happened
    - status: state of the capsule
    - spotify_url: an optional track to add to the capsule
    """
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SENT = "sent", "Sent"
        FAILED = "failed", "Failed"

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    title = models.CharField(max_length=100)
    body = models.TextField()
    deliver_on = models.DateTimeField(editable=False)
    delivered_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
            max_length=10,
        choices=Status.choices,
        default=Status.PENDING)
    spotify_url = models.URLField(null=True, blank=True)


class CapsuleItem(models.Model):
    """
    File attached to a capsule - must be a picture, video, or audio clip
    Stored file metadata for validation
    Notes position of item in capsule
    """

    class Kind(models.TextChoices):
        IMAGE = "image", "Image"
        VIDEO = "video", "Video"
        AUDIO = "audio", "Audio / Voice Note"
        GIF = "gif", "GIF"
        MUSIC_LINK = "music_link", "Music Streaming App track link"

    capsule = models.ForeignKey(Capsule, on_delete=models.CASCADE)
    kind = models.CharField(max_length=50, choices=Kind.choices)

    url = models.URLField(null=True, blank=True)
    file = models.FileField(null=True, blank=True)
    file_type = models.FileField(blank=True, max_length=50)
    size_in_bytes = models.BigIntegerField(null=True, blank=True)
    position = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

class DeliveryLog(models.Model):
    """
    History of delivery attempts for a capsule
    Each row represents one delivery attempt with the timestamp and result
    """
    class ResultStatus(models.TextChoices):
        SENT = "sent", "Sent"
        FAILED = "failed", "Failed"

    capsule = models.ForeignKey(Capsule, on_delete=models.CASCADE)
    attempted_at = models.DateTimeField(auto_now_add=True)
    result = models.CharField(
        max_length=10,
        choices=ResultStatus.choices,)
