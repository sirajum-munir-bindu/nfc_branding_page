import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import ProductCollection from '../components/ProductCollection';
import CardCustomizer from '../components/CardCustomizer';
import OrderModal from '../components/OrderModal';
import DigitalProfile from '../components/DigitalProfile';
import AnalyticsPreview from '../components/AnalyticsPreview';
import WhyNFC from '../components/WhyNFC';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import ContactSection from '../components/ContactSection';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { productService } from '../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [customizerProduct, setCustomizerProduct] = useState(null);
  const [orderInitialData, setOrderInitialData] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await productService.getProducts();
        const items = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        setProducts(items);
      } catch (err) {
        console.error('Failed to load products in Home:', err);
      }
    };
    fetchAllProducts();
  }, []);

  // Triggered when clicking 'Get Your NFC Card' in Hero or Navbar
  const handleGetCardClick = () => {
    const el = document.getElementById('cards');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Triggered from Product cards 'Order Now'
  const handleSelectProduct = (product) => {
    setOrderInitialData({
      productId: product.id,
      edition: product.edition,
      editionCode: product.color_hex?.includes('purple') ? 'purple' : product.color_hex?.includes('gold') ? 'gold' : 'black',
      price: product.discount_price && product.discount_price > 0 ? product.discount_price : product.price,
      name: '',
      designation: '',
      company: '',
    });
    setOrderModalOpen(true);
  };

  // Triggered from Product cards 'Customize Design First'
  const handleCustomizeProduct = (product) => {
    setCustomizerProduct(product);
    const el = document.getElementById('customizer');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Triggered from CardCustomizer 'Continue to Order'
  const handleContinueToOrderFromCustomizer = (customData) => {
    setOrderInitialData({
      ...customData,
      productId: customizerProduct?.id || null,
    });
    setOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Sticky Glass Navbar */}
      <Navbar onOpenOrderModal={() => handleSelectProduct({ id: null, edition: 'Essential Black', price: 599 })} />

      <main className="flex-grow">
        {/* 1. Hero */}
        <Hero onGetCardClick={handleGetCardClick} products={products} />

        {/* 2. Product Showcase */}
        <ProductShowcase onExploreClick={handleGetCardClick} />

        {/* 3. How It Works */}
        <HowItWorks />

        {/* 4. Features */}
        <Features />

        {/* 5. NFC Card Collection (from Django API) */}
        <ProductCollection
          onSelectProduct={handleSelectProduct}
          onCustomizeProduct={handleCustomizeProduct}
        />

        {/* 6. Interactive Card Customizer */}
        <CardCustomizer
          initialProduct={customizerProduct}
          products={products}
          onContinueToOrder={handleContinueToOrderFromCustomizer}
        />

        {/* 7. Post-tap Digital Profile Mockup */}
        <DigitalProfile />

        {/* 8. Card Analytics Dashboard Preview */}
        <AnalyticsPreview />

        {/* 9. Why NFC (Comparison Table) */}
        <WhyNFC />

        {/* 10. Client Testimonials (from Django API) */}
        <Testimonials />

        {/* 11. FAQ Accordion (from Django API) */}
        <FAQ />

        {/* 12. Contact Form (submits to Django API) */}
        <ContactSection />

        {/* 13. Final CTA */}
        <CTA onGetCardClick={handleGetCardClick} />
      </main>

      {/* 14. Footer */}
      <Footer />

      {/* Instant Order Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        initialData={orderInitialData}
      />
    </div>
  );
}
