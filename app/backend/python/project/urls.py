from django.urls import path
from project import views
from django.conf.urls.static import static
#from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings

urlpatterns = [
    path('', views.home),
    path('login/', views.login),
    path('auth/', views.auth, name='auth'),
    path('logout/', views.logout_view),
    path('getsettings/', views.get_settings),
    path('updatesettings/', views.update_settings),
]

#urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.STATIC_URL)
