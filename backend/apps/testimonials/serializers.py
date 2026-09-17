import re
from rest_framework import serializers
from .models import Testimonial

def normalize_image_url(url):
    if not url or not isinstance(url, str):
        return url
    url = url.strip()
    if not url:
        return url
    
    # Check Google Drive URLs
    if 'drive.google.com' in url or 'docs.google.com' in url or 'googleusercontent.com' in url:
        match = re.search(r'/file/d/([a-zA-Z0-9_-]+)', url)
        if match:
            return f"https://lh3.googleusercontent.com/d/{match.group(1)}"
        match = re.search(r'[?&]id=([a-zA-Z0-9_-]+)', url)
        if match:
            return f"https://lh3.googleusercontent.com/d/{match.group(1)}"
        match = re.search(r'/d/([a-zA-Z0-9_-]+)', url)
        if match:
            return f"https://lh3.googleusercontent.com/d/{match.group(1)}"

    # Check Dropbox URLs
    if 'dropbox.com' in url:
        return url.replace('dl=0', 'raw=1').replace('?dl=1', '?raw=1')

    return url

class TestimonialSerializer(serializers.ModelSerializer):
    avatar_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Testimonial
        fields = '__all__'

    def validate_avatar_url(self, value):
        if value:
            return normalize_image_url(value)
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data.get('avatar_url'):
            data['avatar_url'] = normalize_image_url(data['avatar_url'])
        return data

