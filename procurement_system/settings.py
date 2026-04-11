import os
from pathlib import Path

# تأكد إن BASE_DIR متعرف كدة
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-jk@fh6(20%70!+x78lyuo((z(3goq!w)#*y@8jfi!bw0-0lmhv'

DEBUG = True # خليها True عشان لو فيه غلطة تانية تظهر بوضوح

ALLOWED_HOSTS = ['*', '.onrender.com', 'localhost', '127.0.0.1']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles', # تأكد إن دي موجودة
    'rest_framework',
    'corsheaders',
    'core',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # مكانه صح هنا
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'procurement_system.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'procurement_system.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# --- إعدادات الملفات (Static & Media) ---
# التعديل هنا لضمان التوافق مع Render
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(str(BASE_DIR), 'staticfiles') # حولنا BASE_DIR لنص لضمان القبول

# الخدعة دي ساعات بتعمل مشاكل في أول Deploy، جرب النسخة المبسطة دي:
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

# لو عندك فولدر static حقيقي في المشروع ضيفه هنا (اختياري)
STATICFILES_DIRS = [
    # os.path.join(str(BASE_DIR), "static"), 
]

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(str(BASE_DIR), 'media')

# --- باقي الإعدادات ---
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'core.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

CORS_ALLOW_ALL_ORIGINS = True