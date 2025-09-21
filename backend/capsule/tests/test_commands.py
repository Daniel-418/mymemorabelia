from io import StringIO
from django.core.management import call_command
from django.test import TestCase
from unittest.mock import patch

class SendDueCapsulesCommandTest(TestCase):
    @patch('capsule.management.commands.send_capsules.MailDelivery')
    def test_calls_service_and_writes_output(self, mock_send):
        out = StringIO()
        call_command('send_capsules', stdout=out)

        # check that service is called once
        mock_send.send_due_capsules.assert_called_once()

        # check stdout messages
        text = out.getvalue()
        self.assertIn("Capsule delivery process finished", text)
        self.assertIn("Starting the capsule delivery process", text)
