from django.core.management.base import BaseCommand
from capsule.services import MailDelivery

# Sends all the capsules that are due to the capsule's delivery email address
class Command(BaseCommand):
    help = 'finds and sends all due time capsules'

    def handle(self, *args, **options):

        self.stdout.write("Starting the capsule delivery process...")

        MailDelivery.send_due_capsules()

        self.stdout.write(self.style.SUCCESS("Capsule delivery process finished"))
