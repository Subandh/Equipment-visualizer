from django.db import models

class Dataset(models.Model):
    name = models.CharField(max_length=255)  # dataset name (file name)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    row_count = models.IntegerField(default=0)

    summary_json = models.JSONField(default=dict)
    distribution_json = models.JSONField(default=dict)

    csv_file = models.FileField(upload_to="uploads/")

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.name} ({self.uploaded_at})"
