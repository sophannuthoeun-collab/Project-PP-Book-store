import { FaTimes, FaShoppingCart, FaTrash, FaHeart } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';
import { Book } from '../types';

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
  onBookClick: (book: Book) => void;
}

export function Wishlist({ isOpen, onClose, onBookClick }: WishlistProps) {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  const handleAddToCart = (book: Book) => {
    addToCart(book, book.format);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <FaHeart className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>My Wishlist</h2>
              <p className="text-sm text-gray-500">{wishlist.length} saved book{wishlist.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:rotate-90 transition-all shadow-sm">
            <FaTimes />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-red-200 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Merriweather, serif' }}>Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6 text-sm">Save books you love to read them later.</p>
              <button onClick={onClose} className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all">Discover Books</button>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlist.map(book => (
                <div key={book.id} className="flex gap-4 bg-gray-50 rounded-2xl p-4 group hover:bg-red-50 transition-colors">
                  <div
                    className="w-20 h-28 flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-2 cursor-pointer"
                    onClick={() => { onBookClick(book); onClose(); }}
                  >
                    <img src={book.image} alt={book.title} className="h-full w-auto object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div
                        className="cursor-pointer flex-1"
                        onClick={() => { onBookClick(book); onClose(); }}
                      >
                        <p className="text-xs text-amber-700 font-semibold uppercase">{book.genre}</p>
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-2 hover:text-red-600 transition-colors" style={{ fontFamily: 'Merriweather, serif' }}>{book.title}</h4>
                        <p className="text-xs text-gray-500">by {book.author}</p>
                      </div>
                      <button onClick={() => removeFromWishlist(book.id)} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                        <FaTrash size={13} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-black text-gray-900">${book.price.toFixed(2)}</span>
                      {book.originalPrice && <span className="text-sm text-gray-400 line-through">${book.originalPrice.toFixed(2)}</span>}
                    </div>
                    <button
                      onClick={() => handleAddToCart(book)}
                      className="mt-3 w-full py-2.5 bg-amber-800 text-white text-xs rounded-xl font-bold hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart size={11} /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="border-t p-6">
            <button
              onClick={() => { wishlist.forEach(b => handleAddToCart(b)); }}
              className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg"
            >
              <FaShoppingCart /> Add All to Cart ({wishlist.length} books)
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">Wishlist items are not reserved</p>
          </div>
        )}
      </div>
    </div>
  );
}
