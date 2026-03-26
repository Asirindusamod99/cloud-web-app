from rest_framework import serializers
from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    # Returns the full S3 URL (or local /media/ URL) for the attachment
    attachment_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Note
        fields = ["id", "title", "description", "attachment", "attachment_url", "created_at"]
        read_only_fields = ["id", "created_at", "attachment_url"]
        extra_kwargs = {
            "attachment": {"write_only": True, "required": False},
        }

    def get_attachment_url(self, obj):
        if obj.attachment:
            return obj.attachment.url
        return None
