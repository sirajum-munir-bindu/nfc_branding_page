from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.accounts.models import User, CustomerProfile
from apps.products.models import Product, CardDesign
from apps.orders.models import Order, OrderItem
from apps.testimonials.models import Testimonial
from apps.faq.models import FAQ
from apps.contact.models import ContactMessage

class Command(BaseCommand):
    help = 'Seeds initial data for TapCard NFC platform'

    def handle(self, *args, **options):
        self.stdout.write('Starting database seed...')

        # 1. Admin Superuser
        admin_email = 'admin@tapcard.com'
        admin_user, created = User.objects.get_or_create(
            email=admin_email,
            defaults={
                'username': admin_email,
                'first_name': 'TapCard',
                'last_name': 'Admin',
                'role': 'ADMIN',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('admin123')
        admin_user.save()
        self.stdout.write(f'Admin user ready: {admin_email} / admin123')

        # 2. Card Designs
        designs_data = [
            {
                'name': 'Essential Matte Black',
                'edition_code': 'black',
                'description': 'Deep obsidian matte finish with anti-scratch coating and reflective laser-etched accents.',
                'price': 599.00,
                'primary_color': '#090d16',
                'accent_color': '#38bdf8',
                'texture_type': 'matte',
                'features': ['Deep matte texture', 'Laser engraved details', 'Universal NFC chip', 'Stealth aesthetics'],
                'display_order': 1
            },
            {
                'name': 'Midnight Nebula Purple',
                'edition_code': 'purple',
                'description': 'Mystic gradient purple with subtle iridescence that catches the light from every angle.',
                'price': 699.00,
                'primary_color': '#1a0b2e',
                'accent_color': '#c084fc',
                'texture_type': 'iridescent',
                'features': ['Chroma-shift effect', 'Velvet touch finish', 'High-bandwidth NTAG chip', 'Standout presence'],
                'display_order': 2
            },
            {
                'name': 'Sovereign Gold Edition',
                'edition_code': 'gold',
                'description': 'PVD brushed gold trim on high-density ceramic composite for executive sophistication.',
                'price': 899.00,
                'primary_color': '#1f1807',
                'accent_color': '#fbbf24',
                'texture_type': 'metallic-brushed',
                'features': ['Brushed gold luster', 'Reinforced core', 'Executive prestige', 'VIP profile badge'],
                'display_order': 3
            },
        ]
        for d in designs_data:
            CardDesign.objects.update_or_create(edition_code=d['edition_code'], defaults=d)
        self.stdout.write('Card designs seeded.')

        # 3. Products
        products_data = [
            {
                'name': 'Essential Black',
                'slug': 'essential-black',
                'edition': 'Matte Edition',
                'description': 'Crafted with premium high-density PVC composite, the Essential Black card offers minimalist luxury and instant NFC connectivity.',
                'price': 899.00,
                'discount_price': 599.00,
                'image_url': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                'stock': 250,
                'color_hex': '#090d16',
                'finish': 'Obsidian Matte',
                'badge_text': 'Most Popular',
                'features': [
                    'High-speed NTAG216 NFC chip',
                    'Custom laser-printed name & role',
                    'Dynamic digital profile with lifetime access',
                    'High-contrast QR backup code',
                    'Update contact information anytime',
                    'Water & bend resistant composite'
                ],
                'display_order': 1
            },
            {
                'name': 'Midnight Purple',
                'slug': 'midnight-purple',
                'edition': 'Chroma Edition',
                'description': 'Infused with iridescent light-reactive pigments, Midnight Purple changes tone as you move it, creating an unforgettable impression.',
                'price': 999.00,
                'discount_price': 699.00,
                'image_url': 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
                'stock': 180,
                'color_hex': '#1a0b2e',
                'finish': 'Chroma Nebula',
                'badge_text': 'Creative Pick',
                'features': [
                    'Chroma-shift dual-tone coating',
                    'High-speed NTAG216 NFC chip',
                    'Custom UV cured name & logo',
                    'Unlimited real-time profile edits',
                    'Smart contact vCard download',
                    'Anti-scratch oleophobic barrier'
                ],
                'display_order': 2
            },
            {
                'name': 'Golden Edition',
                'slug': 'golden-edition',
                'edition': 'Prestige Edition',
                'description': 'Engineered for executive leaders and founders. Features gold electroplated metallic accents, reinforced weighted core, and bespoke finish.',
                'price': 1299.00,
                'discount_price': 899.00,
                'image_url': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
                'stock': 95,
                'color_hex': '#1f1807',
                'finish': 'Brushed Gold Composite',
                'badge_text': 'Executive Choice',
                'features': [
                    '24K gold foil trim & lettering',
                    'Weighted executive composite feel',
                    'Encrypted dynamic NFC pairing',
                    'Priority analytics & custom domain support',
                    'Laser-etched dynamic QR backup',
                    'Complimentary protective card case'
                ],
                'display_order': 3
            },
            {
                'name': 'Cyber Titanium',
                'slug': 'cyber-titanium',
                'edition': 'Limited Tech Edition',
                'description': 'Aerospace-inspired brushed titanium texture with electric cyan micro-circuitry motifs. Built for tech pioneers and developers.',
                'price': 1599.00,
                'discount_price': 1199.00,
                'image_url': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
                'stock': 60,
                'color_hex': '#0e1726',
                'finish': 'Brushed Titanium & Cyan',
                'badge_text': 'Limited Series',
                'features': [
                    'Brushed aerospace composite surface',
                    'Electric cyan circuit illumination design',
                    'Instant NFC tap for iOS & Android',
                    'Developer & GitHub portfolio links ready',
                    'Comprehensive scan analytics & stats',
                    'Lifetime TapCard cloud warranty'
                ],
                'display_order': 4
            }
        ]
        for p in products_data:
            Product.objects.update_or_create(slug=p['slug'], defaults=p)
        self.stdout.write('Products seeded.')

        # 4. Testimonials
        testimonials_data = [
            {
                'name': 'Tanvir Rahman',
                'designation': 'Managing Director',
                'company': 'Apex Technologies',
                'avatar_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                'rating': 5,
                'review': 'I discarded stacks of paper business cards immediately after receiving my Essential Black TapCard. At client conferences in Dhaka and Dubai, people are genuinely astonished when their phone opens my full profile with just one tap.',
                'display_order': 1
            },
            {
                'name': 'Sarah Al-Mansoor',
                'designation': 'Head of Growth',
                'company': 'FinVenture Capital',
                'avatar_url': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
                'rating': 5,
                'review': 'The Golden Edition feels heavy and luxurious. The best part is being able to update my WhatsApp and pitch deck link on the fly before stepping into an investor meeting without reprinting anything.',
                'display_order': 2
            },
            {
                'name': 'Nafis Chowdhury',
                'designation': 'Chief Architect',
                'company': 'CloudScale Systems',
                'avatar_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                'rating': 5,
                'review': 'Clean, instant, and frictionless. No recipient has ever needed to install an app; iOS and Android detect the card immediately. TapCard is the new standard of modern networking.',
                'display_order': 3
            },
            {
                'name': 'Mehvish Kamal',
                'designation': 'Creative Director',
                'company': 'Studio Lumina',
                'avatar_url': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
                'rating': 5,
                'review': 'The Midnight Purple edition is pure art. The finish and laser-customized typography reflect our studio quality. It converted three new client leads on its first week.',
                'display_order': 4
            }
        ]
        for t in testimonials_data:
            Testimonial.objects.update_or_create(name=t['name'], company=t['company'], defaults=t)
        self.stdout.write('Testimonials seeded.')

        # 5. FAQs
        faqs_data = [
            {
                'question': 'Does NFC work on iPhone?',
                'answer': 'Yes, absolutely. All modern iPhones (iPhone XS, XR, 11, 12, 13, 14, 15, 16 and newer) have native background NFC reading enabled by default. Simply tap the card near the top-rear edge of the iPhone and the profile opens instantly.',
                'category': 'Compatibility',
                'display_order': 1
            },
            {
                'question': 'Does NFC work on Android?',
                'answer': 'Yes. Over 95% of modern Android smartphones come with built-in NFC. As long as NFC is toggled on in settings (which is default on most devices), tapping the card to the middle or back of the phone will immediately launch your digital card.',
                'category': 'Compatibility',
                'display_order': 2
            },
            {
                'question': 'Do I or the recipient need an app?',
                'answer': 'No app is required for either party! The smartphone opens your digital profile directly in its default web browser (Safari, Chrome, etc.). Your recipient can instantly save your vCard contact card to their phone address book with a single click.',
                'category': 'General',
                'display_order': 3
            },
            {
                'question': 'Can I update my profile after ordering?',
                'answer': 'Yes, anytime. You have access to your dynamic profile portal where you can edit your phone number, title, social links, portfolio URL, and profile photo. Changes reflect immediately on your physical card without needing a new card.',
                'category': 'Features',
                'display_order': 4
            },
            {
                'question': 'Does the card expire or have a battery?',
                'answer': 'No, TapCard never expires and contains zero batteries. It draws passive wireless energy from the smartphone itself during the NFC touch interaction, guaranteeing a lifetime of trouble-free taps.',
                'category': 'Technical',
                'display_order': 5
            },
            {
                'question': 'Can I use a QR code as a backup?',
                'answer': 'Yes! Every TapCard features an elegantly integrated high-contrast dynamic QR code on the reverse side. If a smartphone has NFC disabled or an older camera-only setup, scanning the QR code opens the exact same digital profile instantly.',
                'category': 'Features',
                'display_order': 6
            },
            {
                'question': 'Can I customize my card with my name and logo?',
                'answer': 'Yes! You can choose your card finish, enter your custom Cardholder Name, Job Title, Company, and upload your high-resolution logo. Our laser-etching and UV-cure printing technologies ensure razor-sharp detail.',
                'category': 'Customization',
                'display_order': 7
            },
            {
                'question': 'How long does delivery take?',
                'answer': 'Standard nationwide delivery takes 2 to 3 business days across Dhaka and major cities, and 3 to 5 business days for regional districts. Express delivery options are also available.',
                'category': 'Shipping',
                'display_order': 8
            },
            {
                'question': 'Is there a monthly subscription?',
                'answer': 'No! TapCard operates on a one-time purchase model for standard profiles. There are no mandatory monthly recurring fees or hidden hosting costs.',
                'category': 'Pricing',
                'display_order': 9
            }
        ]
        for f in faqs_data:
            FAQ.objects.update_or_create(question=f['question'], defaults=f)
        self.stdout.write('FAQs seeded.')

        # 6. Sample Orders & Customers
        prod_black = Product.objects.filter(slug='essential-black').first()
        prod_purple = Product.objects.filter(slug='midnight-purple').first()
        prod_gold = Product.objects.filter(slug='golden-edition').first()

        sample_customers = [
            {
                'name': 'Kazi Tariqul Islam',
                'email': 'tariqul@techcorp.com',
                'phone': '+8801711223344',
                'address': 'House 12, Road 4, Banani, Dhaka-1213',
                'product': prod_black,
                'qty': 2,
                'status': 'Delivered',
                'payment': 'Paid',
                'customization': {'name': 'Kazi Tariqul Islam', 'designation': 'VP of Engineering', 'company': 'TechCorp Ltd', 'edition': 'Essential Black'}
            },
            {
                'name': 'Rubina Yasmin',
                'email': 'rubina@designhouse.io',
                'phone': '+8801822334455',
                'address': 'Level 5, Gulshan Avenue, Dhaka-1212',
                'product': prod_purple,
                'qty': 1,
                'status': 'Processing',
                'payment': 'Paid',
                'customization': {'name': 'Rubina Yasmin', 'designation': 'Lead Brand Designer', 'company': 'DesignHouse', 'edition': 'Midnight Purple'}
            },
            {
                'name': 'Mahmudul Hasan',
                'email': 'mahmud@hasangroup.bd',
                'phone': '+8801933445566',
                'address': 'Plot 45, GEC Circle, Chittagong',
                'product': prod_gold,
                'qty': 3,
                'status': 'Confirmed',
                'payment': 'Manual',
                'customization': {'name': 'Mahmudul Hasan', 'designation': 'Chairman', 'company': 'Hasan Group', 'edition': 'Sovereign Gold'}
            },
            {
                'name': 'Farhan Akhtar',
                'email': 'farhan@solarpower.net',
                'phone': '+8801644556677',
                'address': 'Sector 3, Uttara, Dhaka-1230',
                'product': prod_black,
                'qty': 1,
                'status': 'Pending',
                'payment': 'Pending',
                'customization': {'name': 'Farhan Akhtar', 'designation': 'Operations Manager', 'company': 'Solar Energy BD', 'edition': 'Essential Black'}
            }
        ]

        for sc in sample_customers:
            CustomerProfile.objects.update_or_create(
                email=sc['email'],
                defaults={
                    'name': sc['name'],
                    'phone': sc['phone'],
                    'address': sc['address'],
                    'company': sc['customization']['company'],
                    'designation': sc['customization']['designation'],
                }
            )

            p = sc['product']
            unit_price = p.discount_price if (p and p.discount_price) else 599.00
            tot = float(unit_price) * sc['qty']

            ord_obj, ord_c = Order.objects.get_or_create(
                customer_email=sc['email'],
                customer_name=sc['name'],
                defaults={
                    'customer_phone': sc['phone'],
                    'shipping_address': sc['address'],
                    'total_amount': tot,
                    'status': sc['status'],
                    'payment_status': sc['payment'],
                    'notes': 'Please pack carefully with gift sleeve.'
                }
            )
            if ord_c:
                OrderItem.objects.create(
                    order=ord_obj,
                    product=p,
                    product_name=p.name if p else 'NFC Card',
                    quantity=sc['qty'],
                    unit_price=unit_price,
                    customization_data=sc['customization']
                )

        # 7. Sample Contact Messages
        contact_messages = [
            {
                'name': 'Imtiaz Ahmed',
                'email': 'imtiaz@primebank.com',
                'phone': '+8801755667788',
                'message': 'We are looking to order 120 custom NFC cards with our corporate branding for our corporate banking leadership team. Could you share your enterprise pricing?',
                'is_read': False
            },
            {
                'name': 'Sabrina Noor',
                'email': 'sabrina@innovate.co',
                'phone': '+8801866778899',
                'message': 'Can you print custom NFC tags for our university alumni summit in November?',
                'is_read': True
            }
        ]
        for cm in contact_messages:
            ContactMessage.objects.get_or_create(email=cm['email'], defaults=cm)

        self.stdout.write(self.style.SUCCESS('Successfully seeded complete TapCard database!'))
