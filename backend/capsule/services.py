import smtplib
from os.path import basename
from email.utils import make_msgid
from email.mime.image import MIMEImage
from django.core.mail import EmailMultiAlternatives
from django.db import transaction
from .models import Capsule, CapsuleItem, DeliveryLog
from django.utils import timezone
from django.conf import settings

class MailDelivery():
    """
    Handles the processing and email delivery of due time capsules.
    """

    @classmethod
    def send_due_capsules(cls):
        """
        Fetches all capsules that are due to be delivered and sends them.
        """
        # Use prefetch_related with the correct related_name to avoid N+1 queries.
        due_capsules = Capsule.objects.filter(
            deliver_on__lte=timezone.now(),
            status=Capsule.Status.PENDING,
        ).prefetch_related('capsule_items')

        for capsule in due_capsules:
            cls._send_single_capsule(capsule)

    @classmethod
    def _send_single_capsule(cls, capsule: Capsule):
        """
        Builds and sends a single capsule email, ensuring files are read
        correctly and attachments are formatted properly.
        """
        try:
            with transaction.atomic():
                # Use the prefetched items to avoid hitting the database again.
                items = capsule.capsule_items.all() # pyright: ignore
                
                html_content, attachments_info = cls.build_email_content(items)
                text_content = cls.get_txt(capsule, items)

                msg = EmailMultiAlternatives(
                    subject=f"Your time capsule has arrived: {capsule.title}",
                    body=text_content,
                    to=[f"{capsule.delivery_email}"],
                    from_email=settings.DEFAULT_FROM_EMAIL
                )
                msg.attach_alternative(html_content, "text/html")

                for info in attachments_info:
                    file_field = info['file_field']
                    
                    with file_field.open('rb') as f:
                        content = f.read()

                    # Handle embedded images (with a CID) using MIMEImage
                    if info.get('cid'):
                        mime_type = info.get("mime_type", "image/jpeg")
                        subtype = mime_type.split('/')[-1]

                        image = MIMEImage(content, _subtype=subtype)
                        image.add_header('Content-ID', info['cid'])
                        image.add_header('Content-Disposition', 'inline', filename=basename(file_field.name))
                        msg.attach(image)
                    # Handle regular attachments
                    else:
                        msg.attach(
                            filename=basename(file_field.name),
                            content=content,
                            mimetype=info["mime_type"]
                        )
                
                msg.send()

                capsule.status = Capsule.Status.SENT
                capsule.delivered_at = timezone.now()
                capsule.save(update_fields=["status", "delivered_at"])
                DeliveryLog.objects.create(capsule=capsule, result=DeliveryLog.ResultStatus.SENT)

        except smtplib.SMTPException as e:
            print(f"SMTP error for capsule '{capsule.title}': {e}")
            DeliveryLog.objects.create(capsule=capsule, result=DeliveryLog.ResultStatus.FAILED)
        except Exception as e:
            print(f"Failed to send capsule {capsule.title}: {e}")
            DeliveryLog.objects.create(capsule=capsule, result=DeliveryLog.ResultStatus.FAILED)

    @classmethod
    def build_email_content(cls, items):
        """
        Builds HTML content and gathers attachment metadata. It passes the
        file field object itself to be read later.
        """
        html_parts = []
        attachments = []

        for item in items:
            if item.kind == CapsuleItem.Kind.TEXT:
                html_parts.append(f"<p>{item.text}</p>")

            elif item.kind in [CapsuleItem.Kind.IMAGE, CapsuleItem.Kind.GIF]:
                cid = make_msgid()
                html_parts.append(f'<img src="cid:{cid[1:-1]}">')
                
                attachments.append({
                    "file_field": item.file,
                    "mime_type": item.mime_type,
                    "cid": cid,
                })
            
            elif item.kind == CapsuleItem.Kind.VIDEO:
                cid = make_msgid()
                html_parts.append(f'<a href="{item.file.url}"><img src="cid:{cid[1:-1]}">Video attached: {item.file.name}</a>')

                # Pass the thumbnail's file field for embedding.
                attachments.append({
                    "file_field": item.video_thumbnail,
                    "mime_type": 'image/jpeg',
                    "cid": cid,
                })

            elif item.kind == CapsuleItem.Kind.MUSIC_LINK:
                html_parts.append(f'<a href="{item.url}">Listen to Track</a>')

        html_string = "<br>\n".join(html_parts)
        return (html_string, attachments)

    @classmethod
    def get_txt(cls, capsule, items):
        """
        Generates the plain text version of the email body.
        """
        parts = [f"Your time capsule: {capsule.title}\n"]

        for item in items:
            if item.kind == CapsuleItem.Kind.TEXT:
                parts.append(item.text)
            elif item.kind in [CapsuleItem.Kind.IMAGE, CapsuleItem.Kind.GIF]:
                parts.append(f"[Image attached: {basename(item.file.name)}]")
            elif item.kind == CapsuleItem.Kind.VIDEO:
                parts.append(f"[Video attached: {item.file.url}]")
            elif item.kind == CapsuleItem.Kind.MUSIC_LINK:
                parts.append(f"Listen here: {item.url}")

        parts.append("\n---\n")
        parts.append("Sent via Time Capsule")

        return "\n".join(parts)

