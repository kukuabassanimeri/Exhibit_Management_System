from .serializers import ExaminerRegistrationSerializer, ExhibitSerializer, ExhibitRemarkSerializer, ExhibitCollectionSerializer

from django.contrib.auth.models import User
from .models import ExhibitModel, ExhibitRemarksModel, ExhibitCollectionModel
from rest_framework import generics, filters
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth import authenticate, logout
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwnerOrSuperuser
from django.http import Http404
from rest_framework.exceptions import NotFound
from .pagination import ExhibitPagination
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from django.contrib import messages
from django.shortcuts import redirect
# SEARCH FILTER
from django_filters.rest_framework import DjangoFilterBackend

# REGISTER EXAMINER
class RegisterExaminerView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = ExaminerRegistrationSerializer

# LOGIN THE REGISTERED USER 
class LoginExaminerView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username':user.username,
                'first_name': user.first_name,
                'last_name':user.last_name
            }, status=status.HTTP_200_OK)
            
        return Response({'error': 'Invalid credentails'}, status=status.HTTP_400_BAD_REQUEST)

# LOGOUT EXAMINER
class ExaminerLogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)

# CREATE AND LIST EXHIBIT MEMO FORM
class ExhibitCreateListAPIView(generics.ListCreateAPIView):
    serializer_class = ExhibitSerializer
    parser_classes = [MultiPartParser, FormParser] # ALLOW UPLOADING EXHIBIT IMAGE
    
    # ONLY THE AUTHENTICATED EXAMINERS CAN ADD EXHIBIT MEMO
    permission_classes = [IsAuthenticated]
    
    # IMPLEMENT PAGINATION
    pagination_class = ExhibitPagination
   
   # SEARCH AND FILTER FOR EXHIBIT MEMO
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['serial_number', 'date_received']
    search_fields = ['serial_number']
    
    # OVERRIDE WHO CAN SEE WHICH EXHIBIT
    def get_queryset(self):
        user = self.request.user
        
        # AVOIDING N+1 PROBLEM
        remarks_queryset = ExhibitRemarksModel.objects.select_related('examiner')
        collection_queryset = ExhibitCollectionModel.objects.select_related('exhibit')
        
        queryset = ExhibitModel.objects.select_related(
        'examiner'
    ).prefetch_related(
        Prefetch('remarks', queryset=remarks_queryset),
        Prefetch('collections', queryset=collection_queryset)
    )
        
        if user.is_superuser or user.is_staff: 
            return queryset # RETURN ALL EXHIBITS IF SUPERUSER OR STAFF
        
        return queryset.filter(examiner=user).order_by('-date_received') # RETURN EXHIBIT OF SPECIFIC EXAMINER
    
    # OVERRIDE PERFORM CREATE
    def perform_create(self, serializer):
        serializer.save(examiner=self.request.user)
    
    # RESTRICT EXAMINERS FROM FILTERING OR SEARCHING FOR OTHERS EXHIBIT MEMO
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        
        if page is not None:
            if len(page) == 0:
                return Response(
                    {
                        'count': 0,
                        'message': 'No Exhibit Found',
                        'results': []
                    },
                    status=status.HTTP_200_OK
                )
                
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

# RETRIEVE, UPDATE AND DESTROY EXHIBIT MEMO
class ExhibitRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExhibitSerializer
    lookup_field = 'serial_number'
    permission_classes = [IsAuthenticated, IsOwnerOrSuperuser]
    
    # OVERRIDE WHO CAN SEE CAN RETRIEVE, UPDATE AND DESTROY WHICH EXHIBIT
    def get_queryset(self):
        user = self.request.user
        
        # PREVENT N+1 PROBLEM
        remarks_queryset = ExhibitRemarksModel.objects.select_related('examiner')
        collection_queryset = ExhibitCollectionModel.objects.select_related('exhibit')

        queryset = ExhibitModel.objects.select_related(
            'examiner'
        ).prefetch_related(
            Prefetch('remarks', queryset=remarks_queryset),
            Prefetch('collections', queryset=collection_queryset)
        )
        
        if user.is_superuser:
            return queryset # RETURN ALL EXHIBIT IF SUPERUSER
        
        return queryset.filter(examiner=user) # RETURN EXHIBIT OF SPECIFIC EXAMINER
    
    def get_object(self):
        try: 
            return super().get_object()
        except Http404:
            raise NotFound('No exhibit record found with the provided serial number')

# CREATE EXHIBIT MEMO REMARKS
class ExhibitRemarkCreateAPIView(generics.CreateAPIView):
    serializer_class = ExhibitRemarkSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serial_number = self.kwargs['serial_number']

        exhibit = get_object_or_404(ExhibitModel, serial_number=serial_number)

        serializer.save(
            examiner=self.request.user,
            exhibit=exhibit
        )

# LIST EXHIBIT MEMO REMARKS
class ExhibitRemarkListAPIView(generics.ListAPIView):
    serializer_class = ExhibitRemarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        serial_number = self.kwargs['serial_number']
        return ExhibitRemarksModel.objects.filter(
            exhibit__serial_number=serial_number
        ).select_related('examiner', 'exhibit') # AVOID N+1 PROBLEM

# CREATE EXHIBIT COLLECTION VIEW
class ExhibitCollectionCreateAPIView(generics.CreateAPIView):
    serializer_class = ExhibitCollectionSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serial_number = self.kwargs['serial_number']

        exhibit = get_object_or_404(ExhibitModel, serial_number=serial_number)

        serializer.save(exhibit=exhibit)
        
# LIST EXHIBIT COLLECTION RECORDS
class ExhibitCollectionListAPIView(generics.ListAPIView):
    serializer_class = ExhibitCollectionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        serial_number = self.kwargs['serial_number']
        return ExhibitCollectionModel.objects.filter(
            exhibit__serial_number=serial_number
        ).select_related('exhibit')