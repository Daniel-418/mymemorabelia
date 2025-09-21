from django.core.exceptions import ValidationError
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile

from mymemorabelia.settings import MEDIA_ROOT
from ..models import (Capsule, CapsuleItem,
                    DeliveryLog, path_to_capsule_item_file)
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

@override_settings(MEDIA_ROOT="/tmp/django_tests")
class CapsuleTests(TestCase):
    #Create a user before each test
    def setUp(self):
        self.user = User.objects.create(
        username="TestUser", email="test@example.com", password="pass", timezone="UTC")

    def test_capsule_creation(self):
        capsule = Capsule.objects.create(
            owner = self.user,
            title = "First Capsule",
            deliver_on = timezone.now() + timedelta(days=1),
        )

        self.assertEqual(capsule.status, Capsule.Status.PENDING)
        self.assertIsNone(capsule.delivered_at)
        self.assertEqual(capsule.owner, self.user)

@override_settings(MEDIA_ROOT="/tmp/django_tests")
class CapsuleItemTests(TestCase):
    #Create a user and a capsule before each test
    def setUp(self):
        self.user = User.objects.create(
        username="TestUser", email="test@example.com", password="pass", timezone="UTC")

        self.capsule = Capsule.objects.create(
            owner = self.user,
            title = "First Capsule",
            deliver_on = timezone.now() + timedelta(days=1),  # Future date to pass validation
        )

    # Test that a music link has a valid url and no file
    def test_music_link(self):
        content = b"1234"
        f = SimpleUploadedFile("image.png", content, content_type="image/png")

        # Music link with url:
        item = CapsuleItem(
            capsule=self.capsule,
            kind=CapsuleItem.Kind.MUSIC_LINK,
            url="https://open.spotify.com/track/sample"
        )
        item.full_clean()
        item.save()
        self.assertFalse(item.file)
        self.assertIsNone(item.file.name)
        self.assertEqual(item.kind, CapsuleItem.Kind.MUSIC_LINK)

        # Music link no url:
        item2 = CapsuleItem( capsule=self.capsule, kind=CapsuleItem.Kind.MUSIC_LINK)

        self.assertRaises(ValidationError, item2.full_clean)

        # Music link with a file
        f = SimpleUploadedFile("dummy.txt", b"data")
        item3 = CapsuleItem(
            capsule=self.capsule,
            kind=CapsuleItem.Kind.MUSIC_LINK,
            url="https://spotifylink.com",
            file=f,
        )

        self.assertRaises(ValidationError, item3.full_clean)
    
    # Test that other attatchment has a file and sets the size
    def test_other_types(self):
        content = b"1234"
        f = SimpleUploadedFile("image.png", content, content_type="image/png")

        item = CapsuleItem(
            capsule=self.capsule,
            kind=CapsuleItem.Kind.IMAGE,
            file=f,
            mime_type="image/png"
        )
        item.full_clean()
        item.save()

        self.assertEqual(item.size_in_bytes, len(content))
        self.assertEqual(item.kind, CapsuleItem.Kind.IMAGE)
        self.assertIsNone(item.url)
        
        # Check that capsule item that is not a link includes a file
        item = CapsuleItem(
            capsule=self.capsule,
            kind=CapsuleItem.Kind.IMAGE,
            mime_type="image/png"
        )

        self.assertRaises(ValidationError, item.clean)

    #Test postition and uploaded_at default values are correctly set
    def test_position_and_uploaded_at(self):
        content = b"1234"
        f = SimpleUploadedFile("image.png", content, content_type="image/png")

        item = CapsuleItem(
            capsule=self.capsule,
            kind=CapsuleItem.Kind.IMAGE,
            file=f,
            mime_type="image/png"
        )
        item.full_clean()
        item.save()
        self.assertEqual(item.position, 0)
        self.assertIsNotNone(item.uploaded_at)

    # Test the helper method to ensure the files are saved in the right folders
    def test_upload_path_helper(self):
        class Dummy:
            capsule_id = 42
        dummy = Dummy()

        path = path_to_capsule_item_file(dummy, "dummy.png")
        self.assertEqual(path, "capsules/{}/dummy.png".format(dummy.capsule_id))


## TODO DELIVERY LOG TESTS
