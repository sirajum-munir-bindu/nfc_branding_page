import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import ProductCollection from '../components/ProductCollection';
import OrderModal from '../components/OrderModal';
import DigitalProfile from '../components/DigitalProfile';
import Testimonials from '../components/Testimonials';
import VideoShowcase from '../components/VideoShowcase';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { productService } from '../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
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
    const regularCost = Number(product.discount_price && product.discount_price > 0 
      ? product.discount_price 
      : (product.regular_price || product.price || 500));
    const vipCost = product.vip_price ? Number(product.vip_price) : (regularCost + 300);

    setOrderInitialData({
      productId: product.id,
      name: product.name || '',
      edition: product.edition,
      editionCode: product.color_hex?.includes('purple') ? 'purple' : product.color_hex?.includes('gold') ? 'gold' : 'black',
      price: vipCost,
      regularPrice: regularCost,
      vipPrice: vipCost,
      image_url: product.image_url || product.image || null,
      designation: '',
      company: '',
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
        <ProductShowcase onExploreClick={handleGetCardClick} products={products} />

        {/* 3. NFC Card Collection (from Django API) */}
        <ProductCollection
          onSelectProduct={handleSelectProduct}
        />

        {/* 5. Post-tap Digital Profile Mockup */}
        <DigitalProfile />

        {/* 6. Client Testimonials (from Django API) */}
        <Testimonials />

        {/* 6.5 Video Showcase (YouTube Demonstration) */}
        <VideoShowcase />

        {/* 7. FAQ Accordion (from Django API) */}
        <FAQ />

        {/* 8. Final CTA */}
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
