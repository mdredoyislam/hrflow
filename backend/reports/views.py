from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class ReportGenerationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Placeholder for report generation logic
        report_type = request.query_params.get('type', 'general')
        return Response({
            "status": "success",
            "message": f"{report_type.capitalize()} report generated successfully.",
            "download_url": f"/media/reports/{report_type}_report_2023.pdf"
        })
