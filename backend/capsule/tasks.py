from celery import shared_task
from capsule.services import MailDelivery
import logging

logger = logging.getLogger(__name__)


@shared_task
def send_due_capsules_task():
    logger.info("Starting capsule delivery task...")
    try:
        MailDelivery.send_due_capsules()
        logger.info("Capsule delivery task finished.")
        return "Capsules Sent"
    except Exception as e:
        logger.error(f"Error sending capsules: {e}")
        raise e

