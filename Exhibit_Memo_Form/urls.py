from django.urls import path
from . import views

app_name = 'Exhibit_Memo_Form'

urlpatterns = [
    
    # RECOMMENDED NAMING API NAMING CONVENTIONS
    path('register', views.RegisterExaminerView.as_view(), name='register'),
    path('login', views.LoginExaminerView.as_view(), name='login'),
    path('logout', views.ExaminerLogoutView.as_view(), name='logout'),
    
    path('exhibits', views.ExhibitCreateListAPIView.as_view(), name='exhibits'),
    path('exhibits/<str:serial_number>', views.ExhibitRetrieveUpdateDestroyAPIView.as_view(), name='exhibit'),
    
    path('exhibits/<str:serial_number>/remarks', views.ExhibitRemarkCreateAPIView.as_view(),
        name='remark'
    ),
    path(
        'exhibits/<str:serial_number>/remark-exhibit', views.ExhibitRemarkListAPIView.as_view(), name='remarks'
    ),
    path(
        'exhibits/<str:serial_number>/collect', views.ExhibitCollectionCreateAPIView.as_view(),name='collect'
    ),
     path(
        'exhibits/<str:serial_number>/collect-exhibit', views.ExhibitCollectionListAPIView.as_view(),name='collections'
    ),
]