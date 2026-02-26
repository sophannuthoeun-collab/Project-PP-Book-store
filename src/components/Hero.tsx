import { useState, useEffect } from 'react';
import { FaArrowRight, FaStar, FaFire } from 'react-icons/fa';

interface HeroProps {
  onShopNow: () => void;
  onCategoryChange: (cat: string) => void;
}

const slides = [
  {
    badge: '🔥 Bestseller of the Year',
    title: 'Find Your Next',
    highlight: 'Great Read',
    subtitle: 'Over 10,000 books across every genre — delivered to your door',
    cta: 'Browse All Books',
    ctaCat: 'all',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=700&fit=crop&q=80',
    accent: 'from-amber-900 via-amber-800 to-orange-900',
    featuredBook: {
      cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg',
      title: 'Atomic Habits',
      author: 'James Clear',
      rating: 4.9,
      price: '$16.99',
    }
  },
  {
    badge: '📖 New Arrivals 2026',
    title: 'Epic Fantasy',
    highlight: 'Awaits You',
    subtitle: 'Dragons, magic, and romance — explore the latest fantasy releases',
    cta: 'Shop Fantasy',
    ctaCat: 'fiction',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=700&fit=crop&q=80',
    accent: 'from-indigo-900 via-purple-900 to-slate-900',
    featuredBook: {
      cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1701980900i/61431922.jpg',
      title: 'Fourth Wing',
      author: 'Rebecca Yarros',
      rating: 4.7,
      price: '$22.49',
    }
  },
  {
    badge: '💸 Up to 40% Off',
    title: 'Transform Your',
    highlight: 'Life & Mind',
    subtitle: 'Top self-help and finance books to unlock your potential',
    cta: 'Shop Self-Help',
    ctaCat: 'self-help',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=700&fit=crop&q=80',
    accent: 'from-emerald-900 via-teal-900 to-cyan-900',
    featuredBook: {
      cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1581527774i/41881472.jpg',
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      rating: 4.8,
      price: '$18.29',
    }
  },
];

export function Hero({ onShopNow, onCategoryChange }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(p => (p + 1) % slides.length);
        setAnimating(false);
      }, 400);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  const goTo = (idx: number) => {
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 300);
  };

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${slide.accent} transition-all duration-1000 min-h-[80vh] md:min-h-[88vh]`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt="Library"
          className={`w-full h-full object-cover opacity-20 transition-all duration-1000 ${animating ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
      </div>

      {/* Decorative circles - hidden on mobile */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none hidden md:block" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none hidden md:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 min-h-[80vh] md:min-h-[88vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full py-8 sm:py-12 md:py-16">
          {/* Left Content */}
          <div className={`text-white transition-all duration-700 ${animating ? 'opacity-0 -translate-x-10' : 'opacity-100 translate-x-0'}`}>
            {/* Badge - responsive sizing */}
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-white/20">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-pulse" />
              {slide.badge}
            </span>

            {/* Title - responsive text sizes */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-3 sm:mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
              {slide.title}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                {slide.highlight}
              </span>
            </h1>

            {/* Subtitle - responsive */}
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-lg leading-relaxed">
              {slide.subtitle}
            </p>

            {/* Buttons - stacked on mobile, row on larger screens */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
              <button
                onClick={() => { onCategoryChange(slide.ctaCat); onShopNow(); }}
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-full font-bold shadow-2xl shadow-amber-900/40 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
              >
                {slide.cta}
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onShopNow}
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 backdrop-blur-sm text-white rounded-full font-bold hover:bg-white/10 transition-all text-sm sm:text-base"
              >
                View All Books
              </button>
            </div>

            {/* Stats - grid on mobile, flex on larger screens */}
            <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-8 pt-6 sm:pt-8 border-t border-white/10">
              {[
                { value: '50K+', label: 'Books Available' },
                { value: '200K+', label: 'Happy Readers' },
                { value: '4.8★', label: 'Average Rating' },
              ].map(stat => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="text-lg sm:text-xl md:text-2xl font-black text-amber-300">{stat.value}</p>
                  <p className="text-gray-400 text-xs sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Featured Book Card */}
          <div className={`hidden lg:flex justify-center transition-all duration-700 ${animating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
            <div className="relative w-full max-w-md">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-500/30 blur-3xl rounded-full" />

              {/* Book Card */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                  {/* Book Cover */}
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <img
                      src={slide.featuredBook.cover}
                      alt={slide.featuredBook.title}
                      className="w-full sm:w-36 md:w-40 lg:w-44 h-auto sm:h-52 md:h-56 lg:h-64 object-cover rounded-xl shadow-2xl book-shadow"
                    />
                  </div>
                  {/* Details */}
                  <div className="text-white min-w-0 flex-1 pt-0 sm:pt-2">
                    <span className="text-xs text-amber-300 font-bold uppercase tracking-widest flex items-center gap-1 mb-2 sm:mb-3">
                      <FaFire className="text-amber-400" /> Featured
                    </span>
                    <h3 className="text-lg sm:text-xl font-black mb-1 leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>
                      {slide.featuredBook.title}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">by {slide.featuredBook.author}</p>
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} size={12} className={i < Math.round(slide.featuredBook.rating) ? 'text-amber-400' : 'text-gray-600'} />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-300">{slide.featuredBook.rating}</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-amber-300 mb-4 sm:mb-5">{slide.featuredBook.price}</p>
                    <button
                      onClick={onShopNow}
                      className="w-full py-2 sm:py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-all text-xs sm:text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating badges - responsive sizing and positioning */}
              <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-red-500 text-white rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 shadow-xl font-bold text-xs sm:text-sm">
                🔥 Bestseller
              </div>
              <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-white rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-xl">
                <p className="text-xs text-gray-500">Free Shipping</p>
                <p className="font-bold text-gray-900 text-xs sm:text-sm">Orders over $35</p>
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators - responsive sizing */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 sm:h-2 rounded-full transition-all ${
                i === current 
                  ? 'bg-amber-400 w-6 sm:w-8' 
                  : 'bg-white/30 w-1.5 sm:w-2 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Mobile Featured Book Preview - visible only on mobile/tablet */}
      <div className="lg:hidden absolute bottom-20 sm:bottom-24 left-4 right-4">
        <div className={`bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 transition-all duration-700 ${
          animating ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
        }`}>
          <div className="flex items-center gap-3">
            <img
              src={slide.featuredBook.cover}
              alt={slide.featuredBook.title}
              className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-lg shadow-xl"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm sm:text-base truncate">{slide.featuredBook.title}</p>
              <p className="text-gray-300 text-xs sm:text-sm truncate">by {slide.featuredBook.author}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={10} className={i < Math.round(slide.featuredBook.rating) ? 'text-amber-400' : 'text-gray-600'} />
                  ))}
                </div>
                <span className="text-amber-300 font-bold text-sm sm:text-base">{slide.featuredBook.price}</span>
              </div>
            </div>
            <button
              onClick={onShopNow}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-600 rounded-lg text-white text-xs sm:text-sm font-bold whitespace-nowrap"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}