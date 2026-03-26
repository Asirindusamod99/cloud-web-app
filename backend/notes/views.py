from rest_framework import viewsets
from .models import Note
from .serializers import NoteSerializer


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
