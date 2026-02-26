import { useState } from 'react';
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart, FaEye, FaFire } from 'react-icons/fa';
import { Book } from '../types';
import { useStore } from '../context/StoreContext';

interface BookCardProps {
  book: Book;
  onBookClick: (book: Book) => void;
}

export function BookCard({ book, onBookClick }: BookCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const inWishlist = isInWishlist(book.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book, book.format);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    inWishlist ? removeFromWishlist(book.id) : addToWishlist(book);
  };

  const discount = book.originalPrice
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => onBookClick(book)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 cursor-pointer border border-gray-100 flex flex-col"
    >
      {/* Cover */}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 aspect-[3/4] overflow-hidden flex items-center justify-center p-4">
        {!imgLoaded && <div className="absolute inset-0 shimmer" />}
        <img
          src={book.image}
          alt={book.title}
          onLoad={() => setImgLoaded(true)}
          className={`h-full w-auto max-w-full object-contain drop-shadow-xl transition-all duration-500 ${hovered ? 'scale-105' : 'scale-100'} ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {book.isNew && (
            <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-sm">NEW</span>
          )}
          {book.isBestseller && (
            <span className="px-2.5 py-1 bg-amber-600 text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
              <FaFire size={9} /> Best
            </span>
          )}
          {book.isSale && discount > 0 && (
            <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">-{discount}%</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 shadow-md ${
            inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500 hover:scale-110'
          }`}
        >
          {inWishlist ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
        </button>

        {/* Format badge */}
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 text-white text-xs rounded-lg backdrop-blur-sm">
          {book.format}
        </div>

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 p-4 transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              added ? 'bg-emerald-500 text-white' : 'bg-white text-gray-900 hover:bg-amber-50'
            }`}
          >
            <FaShoppingCart size={13} />
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
          <button
            onClick={e => { e.stopPropagation(); onBookClick(book); }}
            className="w-full py-2.5 rounded-xl border-2 border-white text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
          >
            <FaEye size={13} /> Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide mb-1">{book.genre}</p>
        <h3 className="font-bold text-gray-900 group-hover:text-amber-800 transition-colors line-clamp-2 text-sm leading-snug mb-1" style={{ fontFamily: 'Merriweather, serif' }}>
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 mb-2 truncate">by {book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={11} className={i < Math.round(book.rating) ? 'text-amber-400' : 'text-gray-200'} />
            ))}
          </div>
          <span className="text-xs font-semibold text-gray-700">{book.rating}</span>
          <span className="text-xs text-gray-400">({book.reviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-gray-900">${book.price.toFixed(2)}</span>
            {book.originalPrice && (
              <span className="text-sm text-gray-400 line-through">${book.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {book.inStock ? (
            <span className="text-xs text-emerald-600 font-medium">In Stock</span>
          ) : (
            <span className="text-xs text-red-500 font-medium">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
