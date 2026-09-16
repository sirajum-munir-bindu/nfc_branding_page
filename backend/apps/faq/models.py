from django.db import models

class FAQ(models.Model):
    question = models.CharField(max_length=500)
    answer = models.TextField()
    category = models.CharField(max_length=100, default='General')
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', 'id']

    def __str__(self):
        return self.question

