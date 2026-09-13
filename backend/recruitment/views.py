from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .models import JobPosting, Candidate, Application, Interview, OnboardingTask
from .serializers import JobPostingSerializer, CandidateSerializer, ApplicationSerializer, InterviewSerializer, OnboardingTaskSerializer
from core.views_mixins import TenantAwareModelViewSet

class JobPostingViewSet(TenantAwareModelViewSet):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['department', 'status']

class CandidateViewSet(TenantAwareModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    filter_backends = [DjangoFilterBackend]

class ApplicationViewSet(TenantAwareModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['job', 'status']

class InterviewViewSet(TenantAwareModelViewSet):
    queryset = Interview.objects.all()
    serializer_class = InterviewSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['application', 'interviewer']
    ordering_fields = ['scheduled_at']

class OnboardingTaskViewSet(TenantAwareModelViewSet):
    queryset = OnboardingTask.objects.all()
    serializer_class = OnboardingTaskSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['employee', 'assigned_to', 'status']
    ordering_fields = ['due_date']

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404

class PublicJobPostingRetrieveView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        job = get_object_or_404(JobPosting, pk=pk, status='PUBLISHED')
        serializer = JobPostingSerializer(job)
        return Response(serializer.data)

class PublicApplicationCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk):
        job = get_object_or_404(JobPosting, pk=pk, status='PUBLISHED')
        
        # Extract candidate data
        candidate_data = {
            'first_name': request.data.get('first_name'),
            'last_name': request.data.get('last_name'),
            'email': request.data.get('email'),
            'phone': request.data.get('phone'),
            'linkedin_url': request.data.get('linkedin_url'),
            'resume': request.FILES.get('resume'),
            'organization': job.organization_id # IMPORTANT: Assign candidate to the job's organization
        }

        # Use CandidateSerializer to validate and create
        # We need to inject the organization into the candidate creation
        candidate_serializer = CandidateSerializer(data=candidate_data)
        if candidate_serializer.is_valid():
            candidate = candidate_serializer.save(organization=job.organization)
            
            # Create Application
            application = Application.objects.create(
                job=job,
                candidate=candidate,
                organization=job.organization,
                status='APPLIED'
            )
            
            return Response({'detail': 'Application submitted successfully.', 'application_id': application.id}, status=status.HTTP_201_CREATED)
        
        return Response(candidate_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
