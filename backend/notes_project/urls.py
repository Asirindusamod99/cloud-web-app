from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from notes.views import test_s3

urlpatterns = [
    path("api/", include("notes.urls")),
    path("api/test-s3/", test_s3),
]

# Serve uploaded media files locally (in production, S3 handles this)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=getattr(settings, "MEDIA_ROOT", ""))
