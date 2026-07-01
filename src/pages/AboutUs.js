import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Heart, Globe, Shield, Sparkles } from 'lucide-react';
import Banner from '../components/Banner';
import CartBadge from '../components/CartBadge';
import CategoryNav from '../components/CategoryNav';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src="/GSwhiteonblack.png" alt="GOT-STOCK" className="h-10" />
            </Link>
            
            <nav className="hidden md:flex items-center space-x-4 ml-8">
              <Link to="/" className="text-gray-600 hover:text-purple-600 transition text-sm">Home</Link>
              <Link to="/shop" className="text-gray-600 hover:text-purple-600 transition text-sm">Shop</Link>
              <CartBadge />
              <Link to="/customer-login" className="text-gray-600 hover:text-purple-600 transition text-sm">Sign In</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Sticky Category Navigation with Search */}
      <CategoryNav />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-purple-900 to-pink-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Your Marketplace for Quality, Trusted Brands</h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
            Got-Stock unites value-conscious shoppers with reputable brands, ensuring affordability never comes at the expense of quality.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Brand Overview */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Who We Are</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Got-Stock Marketplace is a one-stop destination where trusted big-brand sellers can confidently offload out-of-season or excess stock — and where consumers can discover premium brands at genuinely discounted prices. As a strictly e-commerce platform based in Melbourne, Got-Stock unites value-conscious shoppers with reputable apparel, footwear, homeware, and health & beauty brands, ensuring affordability never comes at the expense of quality.
            </p>
          </div>
        </section>

        {/* Dual Purpose */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
              <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Sellers</h3>
              <p className="text-gray-700 text-lg">
                A streamlined, high-performing channel to move older inventory and maximise revenue.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="h-16 w-16 bg-pink-600 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Consumers</h3>
              <p className="text-gray-700 text-lg">
                Access to premium, trusted brands while staying within budget.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white text-center shadow-2xl">
            <Sparkles className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto">
              To optimise stock flow and revenue for sellers while providing consumers with an outlet for quality big-brand goods at affordable prices. We deliver a frictionless marketplace that feels modern, simple, and efficient — without compromising the e-commerce optimisation that sellers expect and consumers need.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <Globe className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Circular Economy Thinking</h3>
              <p className="text-gray-600">Reducing waste by preventing the disposal of dead stock.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <Shield className="h-12 w-12 text-pink-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality-First Retail</h3>
              <p className="text-gray-600">Guiding consumers toward well-made, trusted products instead of low-quality fast fashion.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <Heart className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Affordability Without Compromise</h3>
              <p className="text-gray-600">Ensuring luxury and quality are accessible to those living within a budget.</p>
            </div>
          </div>
        </section>

        {/* The Story */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">The Got-Stock Story</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Got-Stock Marketplace was created to address a clear gap in Australia's e-commerce landscape. Sellers struggled with unwanted or excess stock, often resorting to wasteful disposal, while consumers faced rising living costs that pushed them toward low-quality alternatives. Founder insight revealed a missing link: a trusted online marketplace where big-brand sellers can efficiently clear old stock, and consumers can purchase premium goods without sacrificing quality or overspending. Motivated by sustainability, affordability, and quality, Got-Stock became Australia's go-to clearance destination for recognised brands.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-slate-100 to-purple-100 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Discover Quality Brands?</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Join thousands of smart shoppers finding premium products at unbeatable prices.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
            >
              Start Shopping
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}