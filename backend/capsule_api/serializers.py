from django.utils import timezone
from capsule.models import Capsule, CapsuleItem, DeliveryLog, CustomUser
from rest_framework import serializers

class CapsuleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model =  CapsuleItem
        fields = "__all__"
        read_only_fields = ["uploaded_at"]

    # Ensures that a url and no file is present if item is a music link
    # and ensures that a file and no url is present if item is not a music link
    def validate(self, attrs):
        kind = attrs["kind"]
        file = attrs.get("file")
        url = attrs.get("url")

        errors = {}

        if kind == CapsuleItem.Kind.MUSIC_LINK:
            if not url:
                errors["url"] = "required for a music_link"
            if file:
                errors["file"] = "Must be empty for music_link"
        else:
            if not file:
                errors["file"] = "Required for {}".format(kind)
            if url:
                errors["url"] = "Must be empty for non-link kinds."

        if errors:
            raise serializers.ValidationError(errors)
        return attrs

class CapsuleSerializer(serializers.ModelSerializer):
    capsule_item = CapsuleItemSerializer(many=True, read_only=True)

    class Meta:
        model = Capsule
        fields = ["title", "body", "deliver_on", "capsule_item",
                  "owner", "status", "delivered_at"]
        read_only_fields = ["status", "delivered_at", "owner"]

    #Ensure that the date capsule is delivered is in the future
    def validate(self,  attrs):
        if attrs["deliver_on"] < timezone.now():
            raise serializers.ValidationError("Date to be delivered must be in the future.")
        return attrs

# System generated, never writable
class DeliveryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryLog
        fields = ["id", "capsule", "attempted_at", "result"]
        read_only_fields = fields

# Serializer for a created user
class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=0)

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "timezone", "password"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)
