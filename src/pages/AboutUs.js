import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Heart, Globe, Shield, Sparkles } from 'lucide-react';
import Banner from '../components/Banner';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Sticky Category Navigation with Search */}
      <CategoryNav />

      {/* Hero Section */}
      <section className="relative py-28 bg-gray-950 text-white overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/3 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl gs-aurora" />
        <div className="pointer-events-none absolute -bottom-44 right-0 h-80 w-[36rem] rounded-full bg-brand-700/20 blur-3xl gs-glow" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)', backgroundSize: '22px 22px' }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <div className="h-1 w-12 rounded-full bg-brand-500 mx-auto mb-6 gs-glow" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Your Marketplace for Quality, Trusted Brands</h1>
          <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
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
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300">
              <div className="h-16 w-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Sellers</h3>
              <p className="text-gray-700 text-lg">
                A streamlined, high-performing channel to move older inventory and maximise revenue.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300">
              <div className="h-16 w-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
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
          <div className="relative overflow-hidden bg-gray-950 rounded-2xl p-12 text-white text-center shadow-xl">
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-[36rem] rounded-full bg-brand-500/20 blur-3xl" />
            <Sparkles className="relative h-14 w-14 mx-auto mb-6 text-brand-400" />
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
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <Globe className="h-12 w-12 text-brand-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Circular Economy Thinking</h3>
              <p className="text-gray-600">Reducing waste by preventing the disposal of dead stock.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <Shield className="h-12 w-12 text-brand-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality-First Retail</h3>
              <p className="text-gray-600">Guiding consumers toward well-made, trusted products instead of low-quality fast fashion.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <Heart className="h-12 w-12 text-brand-600 mb-4" />
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
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Discover Quality Brands?</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Join thousands of smart shoppers finding premium products at unbeatable prices.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-700 transition shadow-sm"
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