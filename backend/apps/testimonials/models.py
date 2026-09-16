from django.db import models

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

    def __str__(self):
        return f"{self.name} ({self.company}) - {self.rating}★"

