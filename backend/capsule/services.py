import smtplib
from django.urls import reverse
from django.core.mail import EmailMultiAlternatives, get_connection
from django.db import transaction
from .models import Capsule, DeliveryLog
from django.utils import timezone
from django.conf import settings
from django.template.loader import render_to_string

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
        conn = get_connection(fail_silently=False)
        conn.open()
        try:
            with transaction.atomic():
                relative_url = reverse('capsule_api:register')
                url = f"{settings.SITE_URL}{relative_url}"
                context = {
                    'capsule': capsule,
                    'url': url
                }

                html_content = render_to_string('emails/capsule_notification.html', context=context)
                text_content = render_to_string('emails/capsule_notification.txt', context=context)

                # Create and send the email
                capsule_date = capsule.created_at.strftime('%B %d %Y')
                subject = f"Your time capsule from {capsule_date} has arrived: {capsule.title}"
                msg = EmailMultiAlternatives(
                    subject=subject,
                    body=text_content,
                    to=[capsule.delivery_email],
                    from_email=settings.DEFAULT_FROM_EMAIL
                )
                msg.attach_alternative(html_content, "text/html")
                msg.send()

                # Update the capsule status
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
        finally:
            conn.close()
