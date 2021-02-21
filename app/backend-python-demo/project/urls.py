from django.urls import path
from project import views

urlpatterns = [
    path('', views.home),
    path('login/', views.login),
    path('auth/', views.auth, name='auth'),
    path('logout/', views.logout_view),
    path('getsettings/', views.get_settings),
    path('core/', views.update_settings),
]
