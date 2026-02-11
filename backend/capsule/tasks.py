from celery import shared_task
from capsule.services import MailDelivery


@shared_task
def send_due_capsules_task():
    print("Starting capsule delivery task...")
    MailDelivery.send_due_capsules()
    print("Capsule delivery task finished.")
