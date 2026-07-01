import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const PromoCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      title: "Best Sellers",
      subtitle: "ALL YOUR FAVES ON REPEAT",
      description: "This months top-performing products from the brands shoppers trust most.",
      bgImage: "https://customer-assets.emergentagent.com/job_ecom-dashboard-58/artifacts/1y12eu3v_ChatGPT%20Image%20Dec%2024%2C%202025%2C%2006_36_45%20AM.png",
      buttonText: "Shop Best Sellers",
      link: "/shop?category=best-sellers"
    },
    {
      id: 4,
      title: "New Arrivals",
      subtitle: "FRESH IN. GOING FAST.",
      description: "Freshly released styles and products from the brands everyone's watching.",
      bgImage: "https://customer-assets.emergentagent.com/job_ecom-dashboard-58/artifacts/phc6vj1j_jgenerated-image%20%284%29.png",
      buttonText: "Shop New Arrivals",
      link: "/shop?sort=newest"
    },
    {
      id: 2,
      title: "Featured Brands",
      subtitle: "BRANDS WORTH FOLLOWING.",
      description: "A curated selection of trusted brands, chosen for quality, value and demand",
      bgImage: "https://customer-assets.emergentagent.com/job_ecom-dashboard-58/artifacts/z84dwllj_generated-image%20%2884%29.png",
      buttonText: "Shop Featured Brands",
      link: "/shop?featured=true"
    }
  ];

  // Auto-rotation every 5 seconds — disabled when user prefers reduced motion (WCAG 2.2.2)
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative overflow-hidden bg-black">
      {/* Carousel Container */}
      <div className="relative h-[260px] md:h-[360px] lg:h-[420px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image - fill the block */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            />
            {/* Dark scrim for text legibility over busy photos */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/40" />

            {/* Content */}
            <div className="relative h-full flex items-center justify-center">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center text-white">
                  {/* Content */}
                  <p className="text-sm font-semibold uppercase tracking-wider mb-3 text-[#FF3CFE]">
                    {slide.subtitle}
                  </p>
                  <h2 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl mb-8 text-gray-100 drop-shadow">
                    {slide.description}
                  </p>

                  {/* CTA Button */}
                  <Button
                    onClick={() => navigate(slide.link)}
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-6 text-lg shadow-xl"
                  >
                    {slide.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8 bg-white'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoCarousel;
