import { useState, useEffect } from 'react';
import { FaShoppingCart, FaHeart, FaUser, FaSearch, FaBars, FaTimes, FaBook } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  onCartClick: () => void;
  onWishlistClick: () => void;
  onAuthClick: () => void;
  onSearch: (query: string) => void;
  currentCategory: string;
  onCategoryChange: (cat: string) => void;
}

const navCategories = [
  { id: 'all', label: 'All Books' },
  { id: 'khmer-literature', label: 'Khmer-Literature' },
  { id: 'fiction', label: 'Fiction' },
  { id: 'non-fiction', label: 'Non-Fiction' },
  { id: 'selfHelp', label: 'Self-Help' },
  { id: 'biography', label: 'Biography' },
  { id: 'children', label: 'Children' },
  { id: 'health', label: 'Health' },
];

export function Navbar({ onCartClick, onWishlistClick, onAuthClick, onSearch, currentCategory, onCategoryChange }: NavbarProps) {
  const { cartCount, wishlist, user } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <>
      {/* Top Promo Bar */}
      <div className="bg-amber-800 text-amber-50 text-center text-sm py-2 px-4 flex flex-wrap items-center justify-center gap-1">
        <span>📚 Free shipping on orders over <strong>$35</strong></span>
        <span className="hidden xs:inline">|</span>
        <span className="w-full xs:w-auto">Use code <strong className="text-amber-300">BOOKWORM15</strong> for 15% off your first order</span>
      </div>

      {/* Main Nav */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            {/* Logo Section - Always visible */}
            <div className="flex items-center gap-4 lg:gap-8 flex-shrink-0">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); onCategoryChange('all'); }} 
                className="flex items-center gap-2 flex-shrink-0"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-xl flex items-center justify-center shadow-md">
                  <FaBook className="text-white text-sm sm:text-lg" />
                </div>
                <div className="flex items-center">
                  <span className="text-lg sm:text-xl md:text-2xl font-black text-amber-900" style={{ fontFamily: 'Merriweather, serif' }}>Khmer</span>
                  <span className="text-lg sm:text-xl md:text-2xl font-black text-amber-600" style={{ fontFamily: 'Merriweather, serif' }}>Bookstore</span>
                </div>
              </a>

              {/* Desktop Category Links */}
              <div className="hidden xl:flex items-center gap-1">
                {navCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => onCategoryChange(cat.id)}
                    className={`px-3 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                      currentCategory === cat.id
                        ? 'bg-amber-900 text-white'
                        : 'text-gray-600 hover:text-amber-900 hover:bg-amber-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
                <button className="px-3 py-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full flex items-center gap-1 whitespace-nowrap">
                  🔥 Sale
                </button>
              </div>
            </div>

            {/* Search Bar - Desktop - WIDER NOW */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl xl:max-w-3xl mx-4">
              <div className={`relative w-full transition-all ${searchFocused ? 'scale-[1.01]' : ''}`}>
                <input
                  type="text"
                  placeholder="Search titles, authors, genres..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`w-full px-6 py-3 pl-14 rounded-full border-2 transition-all focus:outline-none bg-white text-base ${
                    searchFocused
                      ? 'border-amber-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                <FaSearch className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors text-lg ${searchFocused ? 'text-amber-600' : 'text-gray-400'}`} />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); onSearch(''); }}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1"
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* User Account Button */}
              <button 
                onClick={onAuthClick} 
                className="hidden md:flex items-center gap-2 px-2 lg:px-3 py-2 rounded-full text-gray-600 hover:text-amber-900 hover:bg-amber-50 transition-all"
              >
                <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center ${user ? 'bg-amber-800 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {user ? <span className="text-xs lg:text-sm font-bold">{user.name?.charAt(0).toUpperCase() || 'U'}</span> : <FaUser size={14} />}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs text-gray-400">{user ? 'Hello,' : 'Sign in'}</p>
                  <p className="text-sm font-semibold">{user ? (user.name?.split(' ')[0] || 'User') : 'Account'}</p>
                </div>
              </button>

              {/* Mobile Search Toggle */}
              <button 
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <FaSearch size={18} />
              </button>

              {/* Wishlist Button */}
              <button 
                onClick={onWishlistClick} 
                className="relative p-2.5 lg:p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              >
                <FaHeart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 lg:w-5 lg:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button 
                onClick={onCartClick} 
                className="relative p-2.5 lg:p-3 text-gray-600 hover:text-amber-700 hover:bg-amber-50 rounded-full transition-all"
              >
                <FaShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 lg:w-5 lg:h-5 bg-amber-700 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileOpen(!mobileOpen)} 
                className="lg:hidden p-2.5 text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="lg:hidden py-4 border-t animate-fadeIn">
              {/* Search Form - Mobile */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search titles, authors, genres..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-5 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(''); onSearch(''); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes size={14} />
                    </button>
                  )}
                </div>
              </form>

              {/* Mobile Category Links */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {navCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { onCategoryChange(cat.id); setMobileOpen(false); }}
                    className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left ${
                      currentCategory === cat.id
                        ? 'bg-amber-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-amber-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Mobile Auth Button */}
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => { onAuthClick(); setMobileOpen(false); }}
                  className="w-full py-3 bg-amber-900 text-white rounded-xl font-semibold hover:bg-amber-800 transition-colors"
                >
                  {user ? `Hi, ${user.name?.split(' ')[0] || 'User'}!` : 'Sign In / Create Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Quick Category Strip for Tablet */}
      <div className="lg:hidden bg-white border-b shadow-sm overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 px-4 py-2 max-w-7xl mx-auto">
          {navCategories.slice(0, 6).map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                currentCategory === cat.id
                  ? 'bg-amber-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-amber-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <button className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-full whitespace-nowrap">
            🔥 Sale
          </button>
        </div>
      </div>
    </>
  );
}