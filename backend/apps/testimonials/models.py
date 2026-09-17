import re
from django.db import models

def normalize_image_url(url):
    if not url or not isinstance(url, str):
        return url
    url = url.strip()
    if not url:
        return url
    
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

    if 'dropbox.com' in url:
        return url.replace('dl=0', 'raw=1').replace('?dl=1', '?raw=1')

    return url

class Testimonial(models.Model):
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    avatar = models.ImageField(upload_to='testimonials/', null=True, blank=True)
    avatar_url = models.URLField(max_length=500, blank=True, null=True, help_text="Fallback photo URL")
    rating = models.PositiveIntegerField(default=5)
    review = models.TextField()
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def save(self, *args, **kwargs):
        if self.avatar_url:
            self.avatar_url = normalize_image_url(self.avatar_url)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.company}) - {self.rating}★"


