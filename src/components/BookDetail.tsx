import { useState } from 'react';
import { FaTimes, FaStar, FaShoppingCart, FaHeart, FaRegHeart, FaCheck, FaTruck, FaUndo, FaShieldAlt,FaBox,FaLock,FaCreditCard,FaArrowLeft,FaArrowRight,FaMapMarkerAlt,FaEnvelope,FaPhone,FaGift,FaTag ,FaCheckCircle,FaBookOpen,FaInfoCircle,FaHome, FaBuilding, FaPaypal,FaUser,FaGooglePay,FaApple, FaCalendar,FaBarcode, FaLanguage, FaHashtag } from 'react-icons/fa';
import { Book } from '../types';
import { useStore } from '../context/StoreContext';



interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

const fakeReviews = [
  { name: 'Sarah M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', rating: 5, date: '3 days ago', title: 'Life-changing read!', comment: 'Absolutely incredible book. Changed the way I think about everything. Highly recommended to anyone looking to improve themselves.', verified: true, helpful: 127 },
  { name: 'James R.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', rating: 5, date: '1 week ago', title: 'A must-read', comment: 'One of those books you wish you\'d read years ago. Clear, practical, and deeply insightful. I bought copies for my entire team.', verified: true, helpful: 89 },
  { name: 'Emily K.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', rating: 4, date: '2 weeks ago', title: 'Very well written', comment: 'Great book overall. Some concepts felt familiar but the presentation is unique and refreshing. Would recommend.', verified: true, helpful: 54 },
  { name: 'David C.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', rating: 5, date: '1 month ago', title: 'Couldn\'t put it down', comment: 'Started reading on Friday evening and finished it by Sunday morning. The writing style is engaging and the content is excellent.', verified: false, helpful: 43 },
];

const formats = ['Paperback', 'Hardcover', 'E-Book', 'Audiobook'] as const;

export function BookDetail({ book, onClose }: BookDetailProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const [selectedFormat, setSelectedFormat] = useState(book.format);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [added, setAdded] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const inWishlist = isInWishlist(book.id);

  const formatPrices: Record<string, number> = {
    'Paperback': book.price,
    'Hardcover': book.price + 8,
    'E-Book': book.price - 5,
    'Audiobook': book.price + 5,
  };

  const currentPrice = formatPrices[selectedFormat] ?? book.price;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart({ ...book, price: currentPrice }, selectedFormat);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative min-h-screen flex items-start justify-center p-4 py-8">
        <div className="relative bg-white rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden animate-fadeIn">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:rotate-90 transition-all"
          >
            <FaTimes size={18} />
          </button>

          <div className="grid lg:grid-cols-5 gap-0">
            {/* Left - Book Cover */}
            <div className="lg:col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 p-8 flex flex-col items-center">
              {/* Badges */}
              <div className="flex gap-2 mb-6 self-start">
                {book.isNew && <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">NEW</span>}
                {book.isBestseller && <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full">🔥 Bestseller</span>}
                {book.isSale && <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">SALE</span>}
              </div>

              <img
                src={book.images[currentImg] || book.image}
                alt={book.title}
                className="w-52 h-72 object-contain drop-shadow-2xl mb-6 rounded-lg"
              />

              {book.images.length > 1 && (
                <div className="flex gap-2">
                  {book.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImg(i)}
                      className={`w-14 h-20 rounded-lg overflow-hidden border-2 transition-all ${currentImg === i ? 'border-amber-500 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain bg-white" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mt-8 w-full">
                {[
                  { icon: FaTruck, label: 'Free Shipping $35+', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { icon: FaUndo, label: '30-Day Returns', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { icon: FaShieldAlt, label: 'Authentic Books', color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map(({ icon: Icon, label, color, bg }) => (
                  <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                    <Icon className={`${color} mx-auto mb-1`} size={16} />
                    <p className="text-xs text-gray-600 font-medium leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Details */}
            <div className="lg:col-span-3 p-8 flex flex-col">
              <p className="text-sm text-amber-700 font-bold uppercase tracking-widest mb-2">{book.genre}</p>
              <h1 className="text-3xl font-black text-gray-900 mb-2 leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>{book.title}</h1>
              <p className="text-gray-500 mb-4">by <span className="text-amber-800 font-semibold">{book.author}</span></p>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={18} className={i < Math.round(book.rating) ? 'text-amber-400' : 'text-gray-200'} />
                  ))}
                </div>
                <span className="font-bold text-gray-700">{book.rating}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">{book.reviews.toLocaleString()} reviews</span>
                <span className={`font-semibold text-sm ${book.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                  {book.inStock ? `✓ In Stock (${book.stockCount})` : '✗ Out of Stock'}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-black text-gray-900">${currentPrice.toFixed(2)}</span>
                {book.originalPrice && selectedFormat === book.format && (
                  <>
                    <span className="text-xl text-gray-400 line-through">${book.originalPrice.toFixed(2)}</span>
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-full">
                      Save ${(book.originalPrice - currentPrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Format Selection */}
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-3">FORMAT</p>
                <div className="grid grid-cols-4 gap-2">
                  {formats.map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border-2 ${
                        selectedFormat === fmt
                          ? 'bg-amber-900 text-white border-amber-900'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400'
                      }`}
                    >
                      {fmt}
                      <br />
                      <span className={`text-xs font-normal ${selectedFormat === fmt ? 'text-amber-200' : 'text-gray-400'}`}>
                        ${formatPrices[fmt]?.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-3">QUANTITY</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-gray-100 transition-colors text-lg font-bold">−</button>
                    <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-gray-100 transition-colors text-lg font-bold">+</button>
                  </div>
                  {book.stockCount <= 10 && book.inStock && (
                    <span className="text-red-500 text-sm font-medium">Only {book.stockCount} left!</span>
                  )}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!book.inStock}
                  className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                    added ? 'bg-emerald-600 text-white' :
                    !book.inStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                    'bg-amber-800 hover:bg-amber-700 text-white shadow-xl shadow-amber-900/20 hover:shadow-amber-700/30'
                  }`}
                >
                  {added ? <><FaCheck /> Added to Cart!</> : <><FaShoppingCart /> Add to Cart</>}
                </button>
                <button
                  onClick={() => inWishlist ? removeFromWishlist(book.id) : addToWishlist(book)}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                    inWishlist ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  {inWishlist ? <FaHeart size={22} /> : <FaRegHeart size={22} />}
                </button>
              </div>

              {/* Tabs */}
              <div className="border-t">
                <div className="flex border-b">
                  {(['description', 'details', 'reviews'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-sm font-bold capitalize transition-all ${
                        activeTab === tab
                          ? 'text-amber-800 border-b-2 border-amber-800 bg-amber-50/50'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {tab === 'reviews' ? `Reviews (${book.reviews.toLocaleString()})` : tab}
                    </button>
                  ))}
                </div>

                <div className="py-6 max-h-60 overflow-y-auto pr-1">
                  {activeTab === 'description' && (
                    <p className="text-gray-600 leading-relaxed">{book.description}</p>
                  )}

                  {activeTab === 'details' && (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: FaBookOpen, label: 'Pages', value: book.pages.toLocaleString() },
                        { icon: FaUser, label: 'Author', value: book.author },
                        { icon: FaCalendar, label: 'Published', value: book.publishedYear.toString() },
                        { icon: FaLanguage, label: 'Language', value: book.language },
                        { icon: FaHashtag, label: 'ISBN', value: book.isbn },
                        { icon: FaBookOpen, label: 'Publisher', value: book.publisher },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <Icon className="text-amber-700 flex-shrink-0" size={14} />
                          <div>
                            <p className="text-xs text-gray-400">{label}</p>
                            <p className="text-sm font-semibold text-gray-800">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      {/* Summary */}
                      <div className="bg-amber-50 rounded-2xl p-4 flex items-center gap-6 mb-4">
                        <div className="text-center">
                          <p className="text-4xl font-black text-gray-900">{book.rating}</p>
                          <div className="flex justify-center my-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} size={13} className={i < Math.round(book.rating) ? 'text-amber-400' : 'text-gray-300'} />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">{book.reviews.toLocaleString()} reviews</p>
                        </div>
                        <div className="flex-1 space-y-1">
                          {[5, 4, 3, 2, 1].map(s => (
                            <div key={s} className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 w-2">{s}</span>
                              <FaStar size={10} className="text-amber-400" />
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${s === 5 ? 72 : s === 4 ? 18 : s === 3 ? 6 : s === 2 ? 2 : 2}%` }} />
                              </div>
                              <span className="text-xs text-gray-400 w-6">{s === 5 ? '72%' : s === 4 ? '18%' : s === 3 ? '6%' : s === 2 ? '2%' : '2%'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {fakeReviews.map((rev, i) => (
                        <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                          <div className="flex items-start gap-3">
                            <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-gray-900 text-sm">{rev.name}</p>
                                  {rev.verified && <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Verified</span>}
                                </div>
                                <span className="text-xs text-gray-400">{rev.date}</span>
                              </div>
                              <div className="flex my-1">
                                {[...Array(5)].map((_, j) => (
                                  <FaStar key={j} size={11} className={j < rev.rating ? 'text-amber-400' : 'text-gray-200'} />
                                ))}
                              </div>
                              <p className="font-semibold text-gray-800 text-sm mb-1">{rev.title}</p>
                              <p className="text-gray-600 text-sm">{rev.comment}</p>
                              <p className="text-xs text-gray-400 mt-2">{rev.helpful} people found this helpful</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
