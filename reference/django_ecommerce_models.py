"""
Referans Django modelleri — ana Django repoya taşıyın (app: shop veya commerce).

Ödeme: Kapıda ödeme / Havale PaymentSettings + Order ile; kart için ayrı PaymentIntent eklenebilir.
"""

from django.db import models


class Category(models.Model):
    """Ürün kategorisi (isteğe bağlı hiyerarşi)."""

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        related_name="children",
        on_delete=models.CASCADE,
    )
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["sort_order", "name"]

    def __str__(self) -> str:
        return self.name


class Product(models.Model):
    """Satışa sunulan ürün (vitrin bloğu bu kayıtları API'den okur)."""

    category = models.ForeignKey(
        Category,
        related_name="products",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default="TRY")
    sku = models.CharField(max_length=80, blank=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class PaymentSettings(models.Model):
    """
    Mağaza / site başına ödeme tercihleri.
    Tekil (Singleton) kullanmak için save() içinde id=1 zorlaması veya
    ForeignKey to Site modeli eklenebilir.
    """

    class Method(models.TextChoices):
        COD = "cod", "Kapıda ödeme"
        BANK_TRANSFER = "bank_transfer", "Havale / EFT"
        # İleride: CARD = "card", "Kredi kartı"

    enabled_methods = models.JSONField(
        default=list,
        help_text='Örn: ["cod", "bank_transfer"]',
    )
    bank_name = models.CharField(max_length=120, blank=True)
    bank_iban = models.CharField(max_length=42, blank=True)
    bank_account_holder = models.CharField(max_length=160, blank=True)
    cod_extra_fee = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        help_text="Kapıda ödeme ek ücreti (0 olabilir)",
    )
    instructions_customer = models.TextField(
        blank=True,
        help_text="Havale sonrası müşteriye gösterilecek talimat",
    )
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return "Payment settings"


class Order(models.Model):
    """Sipariş — sepet checkout sonrası kalıcı kayıt."""

    class Status(models.TextChoices):
        PENDING_PAYMENT = "pending_payment", "Ödeme bekliyor"
        PAID = "paid", "Ödendi"
        PROCESSING = "processing", "Hazırlanıyor"
        SHIPPED = "shipped", "Kargoda"
        DELIVERED = "delivered", "Teslim edildi"
        CANCELLED = "cancelled", "İptal"

    class PaymentMethod(models.TextChoices):
        COD = "cod", "Kapıda ödeme"
        BANK_TRANSFER = "bank_transfer", "Havale / EFT"

    # user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    status = models.CharField(
        max_length=32,
        choices=Status.choices,
        default=Status.PENDING_PAYMENT,
    )
    payment_method = models.CharField(
        max_length=32,
        choices=PaymentMethod.choices,
    )
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shipping = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default="TRY")
    shipping_address = models.JSONField(default=dict, blank=True)
    notes = models.TextField(blank=True)
    payment_reference = models.CharField(
        max_length=120,
        blank=True,
        help_text="Havale dekont / referans kodu",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Order {self.pk} ({self.status})"


class OrderLine(models.Model):
    order = models.ForeignKey(Order, related_name="lines", on_delete=models.CASCADE)
    product = models.ForeignKey(
        Product,
        related_name="order_lines",
        on_delete=models.SET_NULL,
        null=True,
    )
    product_name = models.CharField(max_length=255)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    line_total = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:
        return f"{self.product_name} x{self.quantity}"
