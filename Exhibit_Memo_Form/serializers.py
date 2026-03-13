from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ExhibitModel, ExhibitRemarksModel, ExhibitCollectionModel

# USER REGISTRATION
class ExaminerRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        
        fields = ['first_name', 'last_name', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
        
        # OVERRIDE THE CREATE METHOD
    def create(self, validated_data):
        user = User(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user # RETURN THE CREATED USER

# EXHIBIT REMARKS SERIALIZER
class ExhibitRemarkSerializer(serializers.ModelSerializer):
    exhibit_number = serializers.SerializerMethodField()
    examiner_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ExhibitRemarksModel
        
        fields = ['exhibit_number', 'examiner_name', 'remarks', 'created_at']
        
    def get_exhibit_number(self, obj):
        return obj.exhibit.serial_number

    def get_examiner_name(self, obj):
        return f'{obj.examiner.first_name} {obj.examiner.last_name}'

# EXHIBIT COLLECTION SERIALIZER
class ExhibitCollectionSerializer(serializers.ModelSerializer):
    exhibit_number = serializers.SerializerMethodField()
    class Meta:
        model = ExhibitCollectionModel
        
        fields = ['exhibit_number', 'date_collected', 'collected_by', 'signature']

    def get_exhibit_number(self, obj):
        return obj.exhibit.serial_number

# EXHIBIT SERIALIZER
class ExhibitSerializer(serializers.ModelSerializer):
    
    examiner = serializers.CharField(source='examiner.get_full_name', read_only=True)
    
    # NESTED SERIALIZERS
    remarks = ExhibitRemarkSerializer(many=True, read_only=True)
    
    collections = ExhibitCollectionSerializer(many=True, read_only=True)
    
    class Meta:
        model = ExhibitModel
        
        fields = [
            'exhibit_copy',
            'serial_number', 
            'date_received', 
            'examiner', 
            'investigator', 
            'description', 
            'station', 
            'suspect', 
            'status',
            'signature',
            'remarks',
            'collections'
        ]