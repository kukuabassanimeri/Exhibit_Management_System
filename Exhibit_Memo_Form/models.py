from django.db import models
from django.contrib.auth.models import User

# DEFINE GLOBAL EXHIBIT MEMO STATUS
class ExhibitStatus(models.TextChoices):
    PENDING = 'Pending'
    EXTRACTED = 'Extracted'
    ANALYZED = 'Analyzed'
    REPORTED = 'Reported'
    FAILED = 'Failed'
    COLLECTED = 'Collected'                                        
                                        
# EXHIBIT RECORDING MODEL
class ExhibitModel(models.Model):
    exhibit_copy =  models.ImageField(upload_to='exhibits', null=True, blank=True)
    serial_number = models.CharField(max_length=8, primary_key=True)
    date_received = models.DateField()
    examiner = models.ForeignKey(User, on_delete=models.CASCADE)
    investigator = models.CharField(max_length=20)
    description = models.TextField()
    station = models.CharField(max_length=20)
    suspect = models.TextField()
    status = models.CharField(
        choices=ExhibitStatus.choices, 
        default=ExhibitStatus.PENDING,
        max_length=20
    )
    
    def __str__(self):
        return f'Exhibit {self.serial_number}'
    
    class Meta:
        ordering = ['-date_received']

# EXHIBIT REMARKS MODEL
class ExhibitRemarksModel(models.Model):
    exhibit = models.ForeignKey(ExhibitModel, on_delete=models.CASCADE, related_name='remarks')
    examiner = models.ForeignKey(User, on_delete=models.CASCADE)
    
    remarks = models.TextField()
    created_at = models.DateField()
    
    def __str__(self):
        return f'Remarks for Exhibit {self.exhibit.serial_number}'

# EXHIBIT COLLECTION MODEL
class ExhibitCollectionModel(models.Model):
    exhibit = models.ForeignKey(ExhibitModel, on_delete=models.CASCADE, related_name='collections')
    date_collected = models.DateField()
    collected_by = models.CharField(max_length=20)
    
    def save(self, *args, **kwargs):
        
        # BLOCK EXHIBIT COLLECTION IF ALREADY COLLECTED
        if self.exhibit.status == ExhibitStatus.COLLECTED:
            raise ValueError('This exhibit has been already collected')
        
        # RESTRICT EXHIBIT COLLECTION TILL REPORT IS GENERATED OR EXTRACTION FAILED
        if self.exhibit.status not in [ExhibitStatus.REPORTED, ExhibitStatus.FAILED]:
            raise ValueError('Exhibit cannot be collected until report is generated or extraction failed')

        self.exhibit.status = ExhibitStatus.COLLECTED
        self.exhibit.save()

        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.exhibit.serial_number} collected by {self.collected_by}'