from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ExhibitModel, ExhibitRemarksModel, ExhibitCollectionModel
import re

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
    
    # VALIDATE PASSWORD STRENGTH
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters.")

        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Must include an uppercase letter.")

        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError("Must include a lowercase letter.")

        if not re.search(r"[0-9]", value):
            raise serializers.ValidationError("Must include a number.")

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise serializers.ValidationError("Must include a special character.")

        return value

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
        
        fields = ['exhibit_number', 'date_collected', 'collected_by']

    def get_exhibit_number(self, obj):
        return obj.exhibit.serial_number

# EXHIBIT SERIALIZER
class ExhibitSerializer(serializers.ModelSerializer): 
    
    examiner = serializers.CharField(source='examiner.get_full_name', read_only=True)
    
    detail_url = serializers.SerializerMethodField()
    
    # NESTED SERIALIZERS
    remarks = ExhibitRemarkSerializer(many=True, read_only=True)
    
    collections = ExhibitCollectionSerializer(many=True, read_only=True)
    
    class Meta:
        model = ExhibitModel
        
        fields = [
            'detail_url',
            'exhibit_copy',
            'serial_number', 
            'date_received', 
            'examiner', 
            'investigator', 
            'description', 
            'station', 
            'suspect', 
            'status',
            'remarks',
            'collections'
        ]
    def get_detail_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(f'/api/exhibits/{obj.serial_number}') if request else f'/api/exhibits/{obj.serial_number}'
    
    # Validate serial_number format
    def validate_serial_number(self, value):
        pattern = r'^\d+_\d{4}$'
        if not re.match(pattern, value):
            raise serializers.ValidationError(
                "Serial number must be in a such 100_2026 format"
            )
        return value