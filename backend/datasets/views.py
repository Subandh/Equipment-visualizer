import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Dataset
from .serializers import DatasetHistorySerializer
from .services import compute_metrics, df_to_table


class IsAuthenticatedOrOptions(IsAuthenticated):
 
    def has_permission(self, request, view):
        if request.method == "OPTIONS":
            return True
        return super().has_permission(request, view)


class UploadCSV(APIView):
    permission_classes = [IsAuthenticatedOrOptions]

    def post(self, request):
        uploaded = request.FILES.get("file")
        if not uploaded:
            return Response({"error": "file is required"}, status=400)

        # Save first (so we can read reliably from disk)
        ds = Dataset.objects.create(
            name=uploaded.name,
            csv_file=uploaded,
        )

        # Now read from the saved file path
        try:
            df = pd.read_csv(ds.csv_file.path)
        except Exception as e:
            # if invalid, delete the created row + file reference
            ds.delete()
            return Response({"error": f"Invalid CSV: {e}"}, status=400)

        # Compute metrics
        summary, distribution = compute_metrics(df)

        # Update dataset with computed fields
        ds.row_count = len(df)
        ds.summary_json = summary
        ds.distribution_json = distribution
        ds.save()

        # keep only last 5 uploads
        keep_ids = list(Dataset.objects.values_list("id", flat=True)[:5])
        Dataset.objects.exclude(id__in=keep_ids).delete()

        payload = {
            "dataset_meta": {
                "name": ds.name,
                "uploadedAt": ds.uploaded_at.strftime("%Y-%m-%d %H:%M:%S"),
            },
            "summary": ds.summary_json,
            "distribution": ds.distribution_json,
            "table": df_to_table(df, limit=500),
        }
        return Response(payload, status=201)


class History(APIView):
    permission_classes = [IsAuthenticatedOrOptions]

    def get(self, request):
        qs = Dataset.objects.all()[:5]
        return Response(DatasetHistorySerializer(qs, many=True).data)


class DatasetByName(APIView):
    permission_classes = [IsAuthenticatedOrOptions]

    def get(self, request):
        """
        GET /api/datasets/by-name/?name=<filename>
        returns { summary, distribution, table }
        """
        name = request.GET.get("name")
        if not name:
            return Response({"error": "name query param is required"}, status=400)

        ds = Dataset.objects.filter(name=name).first()
        if not ds:
            return Response({"error": f"Dataset not found: {name}"}, status=404)

        try:
            df = pd.read_csv(ds.csv_file.path)
        except Exception as e:
            return Response({"error": f"Could not read stored CSV: {e}"}, status=500)

        return Response(
            {
                "summary": ds.summary_json,
                "distribution": ds.distribution_json,
                "table": df_to_table(df, limit=1000),
            },
            status=200,
        )
