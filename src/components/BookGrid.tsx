import { useState, useMemo } from 'react';
import { FaFilter, FaTimes, FaSortAmountDown, FaThLarge, FaTh } from 'react-icons/fa';
import { Book } from '../types';
import { BookCard } from './BookCard';
import { genres } from '../data/books';

interface BookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  category: string;
  searchQuery: string;
}

export function BookGrid({ books, onBookClick, category, searchQuery }: BookGridProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [gridCols, setGridCols] = useState<4 | 5>(5);

  const filtered = useMemo(() => {
    let res = [...books];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q) ||
        b.tags.some(t => t.includes(q))
      );
    }

    if (category !== 'all') res = res.filter(b => b.category === category);

    res = res.filter(b => b.price >= priceRange[0] && b.price <= priceRange[1]);

    if (selectedGenres.length > 0) res = res.filter(b => selectedGenres.includes(b.genre));
    if (selectedFormats.length > 0) res = res.filter(b => selectedFormats.includes(b.format));

    switch (sortBy) {
      case 'price-low': res.sort((a, b) => a.price - b.price); break;
      case 'price-high': res.sort((a, b) => b.price - a.price); break;
      case 'rating': res.sort((a, b) => b.rating - a.rating); break;
      case 'reviews': res.sort((a, b) => b.reviews - a.reviews); break;
      case 'newest': res.sort((a, b) => b.publishedYear - a.publishedYear); break;
      case 'az': res.sort((a, b) => a.title.localeCompare(b.title)); break;
    }

    return res;
  }, [books, searchQuery, category, priceRange, selectedGenres, selectedFormats, sortBy]);

  const clearFilters = () => {
    setPriceRange([0, 50]);
    setSelectedGenres([]);
    setSelectedFormats([]);
  };

  const activeCount = selectedGenres.length + selectedFormats.length + (priceRange[0] > 0 || priceRange[1] < 50 ? 1 : 0);

  const catLabel = category === 'all' ? searchQuery ? `Search: "${searchQuery}"` : 'All Books' :
    category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');

  const formats = ['Paperback', 'Hardcover', 'E-Book', 'Audiobook'];

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>{catLabel}</h1>
              <p className="text-gray-500 mt-1">{filtered.length} book{filtered.length !== 1 ? 's' : ''} found</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Grid toggle */}
              <div className="hidden md:flex bg-white border border-gray-200 rounded-xl p-1">
                <button onClick={() => setGridCols(4)} className={`p-2.5 rounded-lg transition-all ${gridCols === 4 ? 'bg-amber-800 text-white' : 'text-gray-400 hover:text-gray-600'}`}><FaThLarge size={14} /></button>
                <button onClick={() => setGridCols(5)} className={`p-2.5 rounded-lg transition-all ${gridCols === 5 ? 'bg-amber-800 text-white' : 'text-gray-400 hover:text-gray-600'}`}><FaTh size={14} /></button>
              </div>

              {/* Sort */}
              <div className="relative flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
                <FaSortAmountDown className="text-gray-400" size={13} />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="appearance-none bg-transparent focus:outline-none text-gray-700 font-medium text-sm pr-4 cursor-pointer">
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="az">A – Z</option>
                </select>
              </div>

              {/* Filter btn */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${showFilters || activeCount > 0 ? 'bg-amber-800 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'}`}
              >
                <FaFilter size={13} /> Filters
                {activeCount > 0 && <span className="w-5 h-5 bg-white text-amber-800 text-xs rounded-full flex items-center justify-center font-bold">{activeCount}</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100 animate-fadeIn">
            <div className="flex justify-between mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Filter Books</h3>
              <button onClick={clearFilters} className="text-sm text-amber-700 hover:underline font-semibold">Clear All</button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Price Range</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full pl-7 pr-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 text-sm" placeholder="Min" />
                  </div>
                  <span className="text-gray-400">–</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full pl-7 pr-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 text-sm" placeholder="Max" />
                  </div>
                </div>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Genre</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {genres.filter(g => g !== 'All Genres').slice(0, 12).map(g => (
                    <button key={g} onClick={() => setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedGenres.includes(g) ? 'bg-amber-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-amber-50 hover:text-amber-800'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Format</label>
                <div className="flex flex-wrap gap-2">
                  {formats.map(f => (
                    <button key={f} onClick={() => setSelectedFormats(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedFormats.includes(f) ? 'bg-amber-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-amber-50 hover:text-amber-800'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active filter tags */}
        {activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-gray-500 font-medium">Active:</span>
            {selectedGenres.map(g => (
              <button key={g} onClick={() => setSelectedGenres(prev => prev.filter(x => x !== g))} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium hover:bg-amber-200 transition-colors">
                {g} <FaTimes size={9} />
              </button>
            ))}
            {selectedFormats.map(f => (
              <button key={f} onClick={() => setSelectedFormats(prev => prev.filter(x => x !== f))} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium hover:bg-amber-200 transition-colors">
                {f} <FaTimes size={9} />
              </button>
            ))}
          </div>
        )}

        {/* Books Grid */}
        {filtered.length > 0 ? (
          <div className={`grid grid-cols-2 sm:grid-cols-3 ${gridCols === 4 ? 'lg:grid-cols-4' : 'md:grid-cols-4 lg:grid-cols-5'} gap-4 md:gap-6`}>
            {filtered.map(book => (
              <BookCard key={book.id} book={book} onBookClick={onBookClick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl">
            <div className="text-7xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Merriweather, serif' }}>No books found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="px-8 py-3 bg-amber-800 text-white rounded-xl font-bold hover:bg-amber-700 transition-all">Clear Filters</button>
          </div>
        )}
      </div>
    </section>
  );
}
