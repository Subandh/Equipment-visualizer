from rest_framework import serializers
from .models import Dataset

class DatasetHistorySerializer(serializers.ModelSerializer):
    uploadedAt = serializers.SerializerMethodField()

    class Meta:
        model = Dataset
        fields = ["id", "name", "uploadedAt", "row_count"]

    def get_uploadedAt(self, obj):
        # frontend expects uploadedAt
        return obj.uploaded_at.strftime("%Y-%m-%d %H:%M:%S")
