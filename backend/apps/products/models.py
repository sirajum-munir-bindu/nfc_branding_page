from django.db import models
from django.utils.text import slugify

class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    edition = models.CharField(max_length=100, default='Standard Edition')
    description = models.TextField(blank=True, default='')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=599.00)
    regular_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="1. Regular Price in ৳")
    vip_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="2. VIP Price in ৳")
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    image_url = models.CharField(max_length=500, blank=True, default='', help_text="Direct, CDN or local asset path (Front)")
    back_image = models.ImageField(upload_to='products/', null=True, blank=True)
    back_image_url = models.CharField(max_length=500, blank=True, default='', help_text="Back side card image URL")
    stock = models.PositiveIntegerField(default=100)
    is_active = models.BooleanField(default=True)
    color_hex = models.CharField(max_length=50, default='#0f172a', blank=True)
    finish = models.CharField(max_length=100, default='Matte Brushed', blank=True)
    badge_text = models.CharField(max_length=100, blank=True, default='')
    features = models.JSONField(default=list, blank=True, help_text="List of feature bullet points")
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def save(self, *args, **kwargs):
        from decimal import Decimal
        if self.regular_price is None and self.price:
            self.regular_price = Decimal(str(self.price))
        elif self.regular_price is not None:
            self.regular_price = Decimal(str(self.regular_price))
            self.price = self.regular_price

        if self.vip_price is None and self.regular_price is not None:
            self.vip_price = self.regular_price + Decimal('300.00')
        elif self.vip_price is not None:
            self.vip_price = Decimal(str(self.vip_price))

        if not self.slug:
            base_slug = slugify(self.name) or "card"
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.edition}) - Regular: ৳{self.regular_price or self.price} | VIP: ৳{self.vip_price}"

class CardDesign(models.Model):
    name = models.CharField(max_length=100) # e.g. "Essential Black", "Midnight Purple", "Sovereign Gold"
    edition_code = models.CharField(max_length=50, unique=True, blank=True) # e.g. "black", "purple", "gold"
    description = models.TextField(blank=True, default='')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=599.00)
    primary_color = models.CharField(max_length=50, default='#0b0f19')
    accent_color = models.CharField(max_length=50, default='#38bdf8')
    texture_type = models.CharField(max_length=50, default='matte-metallic')
    preview_image = models.ImageField(upload_to='card_designs/', null=True, blank=True)
    features = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'id']

    def save(self, *args, **kwargs):
        if not self.edition_code:
            base_code = slugify(self.name) or "edition"
            code = base_code
            counter = 1
            while CardDesign.objects.filter(edition_code=code).exclude(pk=self.pk).exists():
                code = f"{base_code}-{counter}"
                counter += 1
            self.edition_code = code
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} [{self.edition_code}]"

