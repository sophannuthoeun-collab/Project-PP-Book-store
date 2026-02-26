import { useState, useMemo } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedBooks } from './components/FeaturedBooks';
import { BookGrid } from './components/BookGrid';
import { BookDetail } from './components/BookDetail';
import { Cart } from './components/Cart';
import { Wishlist } from './components/Wishlist';
import { Checkout } from './components/Checkout';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { books } from './data/books';
import { Book } from './types';

function AppContent() {
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const filteredBooks = useMemo(() => {
    let res = [...books];
    if (category !== 'all') res = res.filter(b => b.category === category);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q) ||
        b.tags.some(t => t.includes(q))
      );
    }
    return res;
  }, [category, searchQuery]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setSearchQuery('');
    if (cat !== 'all') {
      setShowGrid(true);
      setTimeout(() => document.getElementById('books-grid')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      setShowGrid(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q) {
      setShowGrid(true);
      setTimeout(() => document.getElementById('books-grid')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const handleShopNow = () => {
    setShowGrid(true);
    setCategory('all');
    setTimeout(() => document.getElementById('books-grid')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBackHome = () => {
    setShowGrid(false);
    setCategory('all');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        onSearch={handleSearch}
        currentCategory={category}
        onCategoryChange={handleCategoryChange}
      />

      <main>
        {!showGrid ? (
          <>
            <Hero onShopNow={handleShopNow} onCategoryChange={handleCategoryChange} />

            {/* Features Strip */}
            <div className="bg-white border-b border-gray-100">
              <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { emoji: '🚚', title: 'Free Shipping', desc: 'On orders over $35' },
                    { emoji: '↩️', title: '30-Day Returns', desc: 'Hassle-free returns' },
                    { emoji: '📦', title: '50K+ Books', desc: 'Every genre covered' },
                    { emoji: '🔒', title: 'Secure Checkout', desc: '256-bit SSL encrypted' },
                  ].map(f => (
                    <div key={f.title} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-amber-50 transition-colors">
                      <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{f.emoji}</div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Categories section */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                  <span className="text-amber-700 font-bold text-sm uppercase tracking-widest">Browse by Category</span>
                  <h2 className="text-4xl font-black text-gray-900 mt-2" style={{ fontFamily: 'Merriweather, serif' }}>Find Your Perfect Read</h2>
                  <p className="text-gray-500 mt-3 max-w-xl mx-auto">From timeless classics to the latest bestsellers, we have something for every reader.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {[
                    { id: 'khmer-literature', label: 'Khmer-Literature', desc: 'khmer-fiction, short stories & more', emoji: '📖', image: 'https://i.pinimg.com/736x/b0/da/ea/b0daead3ba9804134a61307d2737c0b2.jpg', count: books.filter(b => b.category === 'khmer-literature').length },
                    { id: 'novel', label: 'Novel', desc: 'khmer-novel, short stories, love & more', emoji: '📚', image: 'https://i.pinimg.com/736x/c3/b0/f4/c3b0f4d2c70607ca2d69db3cdbd20ae1.jpg', count: books.filter(b => b.category === 'novel').length },
                    { id: 'technology', label: 'Technology', desc: 'khmer-novel, short stories, love & more', emoji: '🧑‍💻', image: 'https://i.pinimg.com/736x/f4/c0/27/f4c0271289275fe3cfdef89eb16d9f5e.jpg', count: books.filter(b => b.category === 'technology').length },
                    { id: 'science', label: 'Science', desc: 'Chemical, New exploration & more', emoji: '🧪🦠', image: 'https://i.pinimg.com/736x/4d/4f/39/4d4f391c0a90625b180a182498a85ffe.jpg', count: books.filter(b => b.category === 'science').length },
                    { id: 'fiction', label: 'Fiction', desc: 'Novels, short stories & more', emoji: '📖', image: 'https://i.pinimg.com/736x/5c/c4/8d/5cc48da80c989e9aa5eb20e1ba4f7211.jpg', count: books.filter(b => b.category === 'fiction').length },
                    { id: 'selfHelp', label: 'Self-Help', desc: 'Grow & improve yourself', emoji: '🌱', image: 'https://i.pinimg.com/736x/89/3a/d6/893ad68020bb0ac7f38673363d0a7d9e.jpg', count: books.filter(b => b.category === 'selfHelp').length },
                    { id: 'biography', label: 'Biography', desc: 'Real lives, real stories', emoji: '👤', image: 'https://i.pinimg.com/1200x/15/e1/0f/15e10fa22242765071035b8eadbdb7ce.jpg', count: books.filter(b => b.category === 'biography').length },
                    { id: 'children', label: "Children's", desc: 'Books for young readers', emoji: '🧒', image: 'https://i.pinimg.com/1200x/7b/fb/48/7bfb482c8680bffc5bf3f23401725b0f.jpg', count: books.filter(b => b.category === 'children').length },
                    { id: 'health', label: 'Health', desc: 'Mind & body wellness', emoji: '💪', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop&q=80', count: books.filter(b => b.category === 'health').length },
                    { id: 'finance', label: 'Finance', desc: 'Build your wealth', emoji: '💰', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&q=80', count: books.filter(b => b.category === 'finance').length },
                    { id: 'art', label: 'Arts', desc: 'Creativity & design', emoji: '🎨', image: 'https://i.pinimg.com/1200x/c1/d0/2b/c1d02b69b6d275336914db687117ccbd.jpg', count: books.filter(b => b.category === 'art').length },
                    { id: 'non-fiction', label: 'Non-Fiction', desc: 'Knowledge & discovery', emoji: '🔬', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=400&fit=crop&q=80', count: books.filter(b => b.category === 'non-fiction').length },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className="group relative rounded-2xl overflow-hidden aspect-[4/3] text-left"
                    >
                      <img src={cat.image} alt={cat.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute inset-0 p-5 flex flex-col justify-end">
                        <span className="text-2xl mb-1">{cat.emoji}</span>
                        <h3 className="text-lg font-black text-white" style={{ fontFamily: 'Merriweather, serif' }}>{cat.label}</h3>
                        <p className="text-white/70 text-xs">{cat.count} books</p>
                        <div className="flex items-center gap-1 mt-2 text-amber-300 text-xs font-semibold group-hover:gap-2 transition-all">Shop now →</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <FeaturedBooks books={books} onBookClick={setSelectedBook} onViewAll={handleShopNow} />
          </>
        ) : (
          <>
            <div id="books-grid">
              <BookGrid
                books={filteredBooks}
                onBookClick={setSelectedBook}
                category={category}
                searchQuery={searchQuery}
              />
            </div>
            <div className="text-center py-10 border-t bg-white">
              <button
                onClick={handleBackHome}
                className="inline-flex items-center gap-3 px-8 py-4 bg-amber-900 text-white rounded-full font-bold hover:bg-amber-800 transition-all shadow-xl"
              >
                ← Back to Home
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />

      {/* Modals */}
      {selectedBook && (
        <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckout} />
      <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} onBookClick={setSelectedBook} />
      <Checkout isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
