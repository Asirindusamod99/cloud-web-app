from rest_framework import viewsets
from .models import Note
from .serializers import NoteSerializer


import boto3
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def test_s3(request):
    try:
        s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )
        response = s3.list_objects_v2(Bucket=settings.AWS_STORAGE_BUCKET_NAME, MaxKeys=5)
        return Response({"status": "success", "data": "Can successfully connect to S3!"})
    except Exception as e:
        import traceback
        return Response({"status": "error", "traceback": traceback.format_exc()})

class NoteViewSet(viewsets.ModelViewSet):
    """
    CRUD endpoints for Notes.
    list:   GET    /api/notes/
    create: POST   /api/notes/
    retrieve: GET  /api/notes/{id}/
    update: PUT    /api/notes/{id}/
    partial_update: PATCH /api/notes/{id}/
    destroy: DELETE /api/notes/{id}/
    """
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
