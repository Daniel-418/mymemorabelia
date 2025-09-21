from datetime import timedelta
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core import mail
from ..models import Capsule, DeliveryLog
from ..services import MailDelivery


User = get_user_model()
@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class MailDeliveryTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create(
            username="TestUser", email="test@example.com", password="pass", timezone="UTC"
        )

        self.user2 = User.objects.create(
            username="TestUser2", email="test2@example.com", password="pass", timezone="UTC"
        )

        self.due_capsule = Capsule(
            owner=self.user1,
            title="first capsule for user 1",
            deliver_on=timezone.now() - timedelta(days=1),
            status=Capsule.Status.PENDING,
            delivery_email=self.user1.email # pyright: ignore
        )

        self.future_capsule = Capsule(
            owner=self.user2,
            title="first capsule for user 2",
            deliver_on=timezone.now() + timedelta(days=1),
            status=Capsule.Status.PENDING,
            delivery_email=self.user2.email # pyright: ignore
        )

        self.sent_capsule = Capsule(
            owner=self.user2,
            title="first capsule for user 2",
            deliver_on=timezone.now() - timedelta(days=1),
            status=Capsule.Status.SENT,
            delivery_email=self.user2.email #pyright: ignore
        )

        Capsule.objects.bulk_create([self.due_capsule, self.future_capsule, self.sent_capsule])

    def test_send_due_capsules_sends_correct_email(self):
        # method that sends the mails
        MailDelivery.send_due_capsules()

        # --- ASSERTIONS ---

        # - Check the email inbox
        self.assertEqual(len(mail.outbox), 1)

        # - Inspect the sent mail
        sent_email = mail.outbox[0]
        self.assertEqual(sent_email.to, [self.due_capsule.delivery_email])
        self.assertEqual(sent_email.to, [self.user1.email]) # pyright: ignore
        self.assertIn("Your time capsule from", sent_email.body) # pyright: ignore
        html_body = sent_email.alternatives[0][0] # pyright: ignore
        self.assertIn("<h1>", html_body)

        self.due_capsule.refresh_from_db()
        self.assertEqual(self.due_capsule.status, Capsule.Status.SENT)
        self.assertIsNotNone(self.due_capsule.delivered_at)

        # - Verify a delivery log was created for the successful delivery
        self.assertTrue(
            DeliveryLog.objects.filter(
                capsule=self.due_capsule,
                result=DeliveryLog.ResultStatus.SENT
            ).exists()
        )

        #- Verify that the other capsules were not changed
        self.future_capsule.refresh_from_db()
        self.assertEqual(self.future_capsule.status, Capsule.Status.PENDING)

        self.sent_capsule.refresh_from_db()
        self.assertEqual(self.sent_capsule.status, Capsule.Status.SENT)

