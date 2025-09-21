import uuid
from django.utils import timezone
from django.db import models, transaction
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

# Create your models here.
#Custom User to include timezone
class CustomUser(AbstractUser):
    timezone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]


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
    delivery_email = models.EmailField(blank=True, null=True)
    title = models.CharField(max_length=100)
    deliver_on = models.DateTimeField()
    delivered_at = models.DateTimeField(null=True, blank=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
            max_length=10,
        choices=Status.choices,
        default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    view_token = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True
    )

    # index the fields that would be queried for better performance
    class Meta:
        indexes = [
            models.Index(fields=["deliver_on", "status"])
        ]

    def clean(self):
        if self.deliver_on < timezone.now():
            raise ValidationError("Date to be delivered must be in the future")

    def save(self, *args, **kwargs):
        if self._state.adding:
            self.full_clean()
        if not self.delivery_email:
            self.delivery_email = self.owner.email

        return super().save(*args, **kwargs)



# Helper method to get path of a capsule file if it's an attatchment.
def path_to_capsule_item_file(instance, filename):
    return "capsules/{}/{}".format(instance.capsule_id, filename)

# Helper method to get path of a video thumbnail to be used in the inline mail delivery
def path_to_capsule_thumbnail(instance, filename):
    return "capsules/{}/thumbnails/{}".format(instance.capsule_id, filename)

class CapsuleItem(models.Model):
    """
    - File attached to a capsule: must be a picture, video, or audio clip
    - Stored file metadata for validation
    - Notes position of item in capsule
    - Generates a video thumbnail to be  used inline for mail delivery on save.
    """

    class Kind(models.TextChoices):
        TEXT = "text", "Text"
        IMAGE = "image", "Image"
        VIDEO = "video", "Video"
        AUDIO = "audio", "Audio / Voice Note"
        GIF = "gif", "GIF"
        MUSIC_LINK = "music_link", "Music Streaming App track link"

    capsule = models.ForeignKey(Capsule, on_delete=models.CASCADE, related_name="capsule_items")
    kind = models.CharField(max_length=50, choices=Kind.choices)
    text = models.TextField(null=True, blank=True)

    url = models.URLField(null=True, blank=True)
    file = models.FileField(upload_to=path_to_capsule_item_file, null=True,
                            blank=True)
    mime_type = models.CharField(blank=True, max_length=50)
    size_in_bytes = models.BigIntegerField(null=True, blank=True)
    position = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    # ensures that two items cannot have the same position
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["capsule", "position"], name="unique_position")
        ]

    # Require a url if capsule item is a link and require a file
    # if capsule item is anything else
    def clean(self) -> None:
        if self.kind == self.Kind.MUSIC_LINK:
            if not self.url:
                raise ValidationError("Music link requires a valid url")
            if self.file:
                raise ValidationError("Music Link cannot contain a file")
        elif self.kind == self.Kind.TEXT:
            if not self.text:
                raise ValidationError("Text item requires content in the text field")
            if self.file:
                raise ValidationError("Text item cannot contain a file")
        else:
            if not self.file:
                raise ValidationError("A {} requires a file".format(self.kind))
            if self.url or self.text:
                raise ValidationError("A {} cannot contain a text or url".format(self.kind))

    #set's position if capsule item is new and position is not set
    def _set_position(self):
        if self._state.adding and self.position == 0:
            max_position = CapsuleItem.objects.filter(capsule=self.capsule).aggregate(
                max_position=models.Max("position")
            ).get('max_position')

            if max_position is None:
                self.position = 0
            else:
                self.position = max_position + 1

    # generates a thumbnail to set in the video_thumbnail field


    @transaction.atomic
    def save(self, *args, **kwargs):
        self.full_clean()
        # compute derived fields before first save
        self._set_position()

        # set file size automatically
        if self.file and not self.size_in_bytes:
            self.size_in_bytes = self.file.size

        #save to db to ensure pk and file on disk
        super().save(*args, **kwargs)



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
