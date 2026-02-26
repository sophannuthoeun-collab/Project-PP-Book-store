import { useState } from 'react';
import {
  FaTimes, FaCheck, FaTruck, FaBox, FaLock, FaCreditCard, FaShieldAlt,
  FaArrowLeft, FaArrowRight, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone,
  FaTag, FaStar, FaGift, FaInfoCircle, FaHome, FaBuilding, FaCheckCircle,
  FaSpinner, FaBarcode, FaCalendarAlt, FaPaypal,
  FaApple,
  FaGooglePay
} from 'react-icons/fa';
import { SiVisa, SiMastercard, SiAmericanexpress, SiApplepay, SiGooglepay } from 'react-icons/si';
import { useStore } from '../context/StoreContext';

interface CheckoutProps { isOpen: boolean; onClose: () => void; }

type Step = 'cart' | 'address' | 'shipping' | 'payment' | 'review' | 'confirmation';

const STEPS: Step[] = ['cart', 'address', 'shipping', 'payment', 'review', 'confirmation'];
const STEP_LABELS = ['Cart', 'Address', 'Shipping', 'Payment', 'Review', 'Confirm'];

const PROMO_CODES: Record<string, number> = {
  'BOOKWORM15': 0.15,
  'READER20': 0.20,
  'SAVE10': 0.10,
  'NEWUSER25': 0.25,
};

const SHIPPING_METHODS = [
  {
    id: 'standard',
    icon: '📦',
    name: 'Standard Shipping',
    subtitle: 'Free on orders over $35',
    time: '5–7 business days',
    price: (subtotal: number) => subtotal >= 35 ? 0 : 4.99,
    badge: null,
  },
  {
    id: 'express',
    icon: '🚚',
    name: 'Express Shipping',
    subtitle: 'Faster delivery guaranteed',
    time: '2–3 business days',
    price: () => 12.99,
    badge: 'Popular',
  },
  {
    id: 'overnight',
    icon: '⚡',
    name: 'Overnight Shipping',
    subtitle: 'Next business day',
    time: '1 business day',
    price: () => 24.99,
    badge: 'Fastest',
  },
  {
    id: 'pickup',
    icon: '🏪',
    name: 'Store Pickup',
    subtitle: 'Pick up at your nearest store',
    time: 'Ready in 2 hours',
    price: () => 0,
    badge: 'Free',
  },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
  { id: 'apple', label: 'Apple Pay', icon: <FaApple/> },
  { id: 'google', label: 'Google Pay', icon: <FaGooglePay/> },
];

export function Checkout({ isOpen, onClose }: CheckoutProps) {
  const { cart, cartTotal, clearCart, updateQuantity, removeFromCart } = useStore();
  const [step, setStep] = useState<Step>('cart');
  const [processing, setProcessing] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  // Promo
  const [promoCode, setPromoCode] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Address
  const [address, setAddress] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    line1: '', line2: '', city: '', state: '', zip: '', country: 'United States',
    saveAddress: true, addressType: 'home' as 'home' | 'work',
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Shipping
  const [shipMethod, setShipMethod] = useState('standard');

  // Payment
  const [payMethod, setPayMethod] = useState('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [saveCard, setSaveCard] = useState(false);
  const [billingDiff, setBillingDiff] = useState(false);

  // Gift
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  // Order
  const [orderNumber] = useState(`BH-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);

  // --- Calculations ---
  const selectedShipping = SHIPPING_METHODS.find(m => m.id === shipMethod)!;
  const shippingCost = selectedShipping ? selectedShipping.price(cartTotal) : 0;
  const discountAmount = cartTotal * promoDiscount;
  const giftCost = giftWrap ? 4.99 : 0;
  const tax = (cartTotal - discountAmount) * 0.08;
  const total = cartTotal - discountAmount + shippingCost + giftCost + tax;

  const deliveryDate = new Date();
  const daysToAdd = shipMethod === 'overnight' ? 1 : shipMethod === 'express' ? 3 : shipMethod === 'pickup' ? 0 : 7;
  deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);

  // --- Handlers ---
  const applyPromo = () => {
    const code = promoInput.toUpperCase().trim();
    const rate = PROMO_CODES[code];
    if (rate) {
      setPromoCode(code);
      setPromoDiscount(rate);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try: BOOKWORM15, READER20, SAVE10');
      setPromoApplied(false);
    }
  };

  const removePromo = () => {
    setPromoCode('');
    setPromoInput('');
    setPromoDiscount(0);
    setPromoApplied(false);
    setPromoError('');
  };

  const validateAddress = () => {
    const errs: Record<string, string> = {};
    if (!address.firstName.trim()) errs.firstName = 'Required';
    if (!address.lastName.trim()) errs.lastName = 'Required';
    if (!address.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) errs.email = 'Valid email required';
    if (!address.phone.trim()) errs.phone = 'Required';
    if (!address.line1.trim()) errs.line1 = 'Street address required';
    if (!address.city.trim()) errs.city = 'Required';
    if (!address.state.trim()) errs.state = 'Required';
    if (!address.zip.trim()) errs.zip = 'Required';
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateCard = () => {
    if (payMethod !== 'card') return true;
    const errs: Record<string, string> = {};
    if (!card.number.replace(/\s/g, '') || card.number.replace(/\s/g, '').length < 16) errs.number = 'Valid 16-digit card required';
    if (!card.name.trim()) errs.name = 'Name required';
    if (!card.expiry || !/^\d{2}\/\d{2}$/.test(card.expiry)) errs.expiry = 'MM/YY format required';
    if (!card.cvv || card.cvv.length < 3) errs.cvv = 'CVV required';
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    const idx = STEPS.indexOf(step);
    if (step === 'address' && !validateAddress()) return;
    if (step === 'payment' && !validateCard()) return;
    if (idx < STEPS.length - 2) setStep(STEPS[idx + 1]);
  };

  const prevStep = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const placeOrder = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setOrderDone(true);
      setStep('confirmation');
      clearCart();
    }, 2500);
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').substr(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').substr(0, 4);
    if (digits.length > 2) return `${digits.substr(0, 2)}/${digits.substr(2)}`;
    return digits;
  };

  if (!isOpen) return null;

  // --- Order Summary Sidebar ---
  const OrderSummary = ({ compact = false }: { compact?: boolean }) => (
    <div className={`${compact ? '' : 'lg:col-span-2 bg-amber-50 border-l border-amber-100'} p-6`}>
      <h3 className="font-black text-gray-900 text-lg mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
        Order Summary
      </h3>

      {/* Items */}
      <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1 scrollbar-hide">
        {cart.map((item, i) => (
          <div key={i} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
            <div className="w-12 h-16 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-lg p-1">
              <img src={item.image} alt={item.title} className="h-full w-auto object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-amber-700 uppercase tracking-wide">{item.selectedFormat}</p>
              <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug" style={{ fontFamily: 'Merriweather, serif' }}>{item.title}</p>
              <p className="text-xs text-gray-400">by {item.author}</p>
              <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity}</p>
            </div>
            <p className="font-black text-gray-900 text-sm flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Promo (only on cart step) */}
      {step === 'cart' && (
        <div className="mb-4">
          {promoApplied ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <FaTag className="text-emerald-600" size={13} />
                <span className="text-sm font-bold text-emerald-700">{promoCode}</span>
                <span className="text-xs text-emerald-600">(-{(promoDiscount * 100).toFixed(0)}%)</span>
              </div>
              <button onClick={removePromo} className="text-red-400 hover:text-red-600 text-xs font-semibold">Remove</button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoInput}
                    onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoError(''); }}
                    onKeyDown={e => e.key === 'Enter' && applyPromo()}
                    className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <button
                  onClick={applyPromo}
                  disabled={!promoInput}
                  className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 disabled:opacity-40 transition-all"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><FaInfoCircle size={10} /> {promoError}</p>}
              <p className="text-xs text-gray-400 mt-1.5">Try: BOOKWORM15 or READER20</p>
            </div>
          )}
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-2 border-t border-amber-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
          <span className="font-semibold">${cartTotal.toFixed(2)}</span>
        </div>
        {promoApplied && (
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600 flex items-center gap-1"><FaTag size={11} /> Promo ({promoCode})</span>
            <span className="text-emerald-600 font-bold">-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        {step !== 'cart' && step !== 'address' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping ({selectedShipping?.name})</span>
            <span className={`font-semibold ${shippingCost === 0 ? 'text-emerald-600' : ''}`}>
              {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
            </span>
          </div>
        )}
        {giftWrap && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1"><FaGift size={11} /> Gift Wrap</span>
            <span className="font-semibold">$4.99</span>
          </div>
        )}
        {step !== 'cart' && step !== 'address' && step !== 'shipping' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax (8%)</span>
            <span className="font-semibold">${tax.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-black pt-3 border-t border-amber-200">
          <span>Total</span>
          <span className="text-amber-900">
            ${step === 'cart' || step === 'address' ? (cartTotal - discountAmount + giftCost).toFixed(2) :
               step === 'shipping' ? (cartTotal - discountAmount + shippingCost + giftCost).toFixed(2) :
               total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Gift wrap */}
      {(step === 'cart' || step === 'address') && (
        <div className="mt-4 p-3 bg-white rounded-xl border border-amber-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={giftWrap} onChange={e => setGiftWrap(e.target.checked)} className="w-4 h-4 accent-amber-700" />
            <div>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-2"><FaGift className="text-amber-600" /> Gift Wrap (+$4.99)</p>
              <p className="text-xs text-gray-500">Premium wrapping with a personalized note</p>
            </div>
          </label>
          {giftWrap && (
            <textarea
              placeholder="Add a gift message (optional)"
              value={giftNote}
              onChange={e => setGiftNote(e.target.value)}
              rows={2}
              className="mt-3 w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 resize-none"
            />
          )}
        </div>
      )}

      {/* Trust badges */}
      <div className="mt-5 space-y-2">
        {['30-day free returns policy', '100% authentic & genuine books', 'Secure 256-bit SSL encryption'].map(g => (
          <div key={g} className="flex items-center gap-2 text-xs text-gray-500">
            <FaCheckCircle className="text-emerald-500 flex-shrink-0" size={12} />
            {g}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={orderDone ? undefined : () => { if (!processing) onClose(); }}
      />
      <div className="relative min-h-screen flex items-start justify-center p-3 py-6 md:p-6">
        <div className="relative bg-white rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden my-4">

          {/* Close Button */}
          {!orderDone && (
            <button
              onClick={() => { if (!processing) onClose(); }}
              className="absolute top-4 right-4 z-20 w-12 h-12 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full flex items-center justify-center text-gray-500 hover:rotate-90 transition-all"
            >
              <FaTimes size={18} />
            </button>
          )}

          {/* Header & Progress */}
          {!orderDone && (
            <div className="bg-gradient-to-r from-amber-900 to-amber-700 px-6 pt-6 pb-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📚</span>
                </div>
                <div>
                  <h1 className="text-white font-black text-xl" style={{ fontFamily: 'Merriweather, serif' }}>KhmerBookStore Checkout</h1>
                  <p className="text-amber-200 text-xs">Secure & encrypted checkout</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-amber-200 text-xs">
                  <FaShieldAlt size={12} /> SSL Secured
                </div>
              </div>

              {/* Step Progress */}
              <div className="flex items-center justify-between">
                {STEPS.filter(s => s !== 'confirmation').map((s, i) => {
                  const currentIdx = STEPS.indexOf(step);
                  const isActive = s === step;
                  const isDone = i < currentIdx;
                  return (
                    <div key={s} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                          isDone ? 'bg-emerald-400 text-white shadow-lg' :
                          isActive ? 'bg-white text-amber-900 shadow-lg scale-110' :
                          'bg-white/20 text-white/60'
                        }`}>
                          {isDone ? <FaCheck size={12} /> : i + 1}
                        </div>
                        <span className={`text-xs mt-1 font-semibold transition-all ${isActive ? 'text-white' : isDone ? 'text-emerald-300' : 'text-white/40'}`}>
                          {STEP_LABELS[i]}
                        </span>
                      </div>
                      {i < STEPS.filter(s => s !== 'confirmation').length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 mb-4 rounded transition-all ${i < currentIdx ? 'bg-emerald-400' : 'bg-white/20'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================== STEP: CART ======================== */}
          {step === 'cart' && (
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
                    Your Cart <span className="text-amber-700">({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                  </h2>
                  {cartTotal < 35 && (
                    <div className="text-right">
                      <p className="text-xs text-amber-700 font-semibold">Add ${(35 - cartTotal).toFixed(2)} for free shipping</p>
                      <div className="w-32 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-amber-600 rounded-full transition-all" style={{ width: `${Math.min((cartTotal / 35) * 100, 100)}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Add some books to get started!</p>
                    <button onClick={onClose} className="px-6 py-3 bg-amber-800 text-white rounded-xl font-bold hover:bg-amber-700 transition-all">Browse Books</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, i) => (
                      <div key={i} className="flex gap-4 bg-gray-50 hover:bg-amber-50 rounded-2xl p-4 transition-colors group">
                        <div className="w-20 h-28 flex-shrink-0 bg-white rounded-xl p-2 shadow-sm flex items-center justify-center">
                          <img src={item.image} alt={item.title} className="h-full w-auto object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full mb-1">{item.selectedFormat}</span>
                              <h4 className="font-black text-gray-900 text-sm line-clamp-2 leading-snug" style={{ fontFamily: 'Merriweather, serif' }}>{item.title}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">by {item.author}</p>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, j) => (
                                  <FaStar key={j} size={10} className={j < Math.round(item.rating) ? 'text-amber-400' : 'text-gray-200'} />
                                ))}
                                <span className="text-xs text-gray-400">({item.rating})</span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.selectedFormat)}
                              className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 w-7 h-7 flex items-center justify-center hover:bg-red-50 rounded-lg"
                            >
                              <FaTimes size={13} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.selectedFormat, item.quantity - 1)}
                                className="px-3 py-2 hover:bg-amber-50 transition-colors text-gray-600 font-bold"
                              >−</button>
                              <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.selectedFormat, item.quantity + 1)}
                                className="px-3 py-2 hover:bg-amber-50 transition-colors text-gray-600 font-bold"
                              >+</button>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-gray-900 text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                              {item.quantity > 1 && <p className="text-xs text-gray-400">${item.price.toFixed(2)} each</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {cart.length > 0 && (
                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <FaArrowLeft size={13} /> Continue Shopping
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={cart.length === 0}
                      className="flex-[2] py-4 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-amber-900/20 transition-all disabled:opacity-40"
                    >
                      Proceed to Checkout <FaArrowRight />
                    </button>
                  </div>
                )}
              </div>
              <OrderSummary />
            </div>
          )}

          {/* ======================== STEP: ADDRESS ======================== */}
          {step === 'address' && (
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-6 md:p-8">
                <button onClick={prevStep} className="flex items-center gap-2 text-gray-500 hover:text-amber-800 mb-6 text-sm font-semibold transition-colors">
                  <FaArrowLeft size={12} /> Back to Cart
                </button>
                <h2 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Merriweather, serif' }}>Shipping Address</h2>
                <p className="text-gray-500 text-sm mb-6">Where should we deliver your books?</p>

                {/* Address Type */}
                <div className="flex gap-3 mb-6">
                  {[{ id: 'home', icon: FaHome, label: 'Home' }, { id: 'work', icon: FaBuilding, label: 'Work' }].map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setAddress({ ...address, addressType: id as 'home' | 'work' })}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-semibold transition-all text-sm ${
                        address.addressType === id ? 'border-amber-700 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                      <input
                        type="text" placeholder="Hak" value={address.firstName}
                        onChange={e => { setAddress({ ...address, firstName: e.target.value }); setAddressErrors({ ...addressErrors, firstName: '' }); }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${addressErrors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-500'}`}
                      />
                    </div>
                    {addressErrors.firstName && <p className="text-xs text-red-500 mt-1">{addressErrors.firstName}</p>}
                  </div>
                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text" placeholder="Hai" value={address.lastName}
                      onChange={e => { setAddress({ ...address, lastName: e.target.value }); setAddressErrors({ ...addressErrors, lastName: '' }); }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${addressErrors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-500'}`}
                    />
                    {addressErrors.lastName && <p className="text-xs text-red-500 mt-1">{addressErrors.lastName}</p>}
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                      <input
                        type="email" placeholder="hai123@email.com" value={address.email}
                        onChange={e => { setAddress({ ...address, email: e.target.value }); setAddressErrors({ ...addressErrors, email: '' }); }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${addressErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-500'}`}
                      />
                    </div>
                    {addressErrors.email && <p className="text-xs text-red-500 mt-1">{addressErrors.email}</p>}
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                    <div className="relative">
                      <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                      <input
                        type="tel" placeholder="+885 555 000-0000" value={address.phone}
                        onChange={e => { setAddress({ ...address, phone: e.target.value }); setAddressErrors({ ...addressErrors, phone: '' }); }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${addressErrors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-500'}`}
                      />
                    </div>
                    {addressErrors.phone && <p className="text-xs text-red-500 mt-1">{addressErrors.phone}</p>}
                  </div>
                  {/* Address Line 1 */}
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Street Address *</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                      <input
                        type="text" placeholder="123 Reading Lane" value={address.line1}
                        onChange={e => { setAddress({ ...address, line1: e.target.value }); setAddressErrors({ ...addressErrors, line1: '' }); }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${addressErrors.line1 ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-500'}`}
                      />
                    </div>
                    {addressErrors.line1 && <p className="text-xs text-red-500 mt-1">{addressErrors.line1}</p>}
                  </div>
                  {/* Address Line 2 */}
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Apartment, Suite, etc. <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                      type="text" placeholder="Apt 4B" value={address.line2}
                      onChange={e => setAddress({ ...address, line2: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  {/* City */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                    <input
                      type="text" placeholder="New York" value={address.city}
                      onChange={e => { setAddress({ ...address, city: e.target.value }); setAddressErrors({ ...addressErrors, city: '' }); }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${addressErrors.city ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-500'}`}
                    />
                    {addressErrors.city && <p className="text-xs text-red-500 mt-1">{addressErrors.city}</p>}
                  </div>
                  {/* State */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">State *</label>
                    <select
                      value={address.state}
                      onChange={e => { setAddress({ ...address, state: e.target.value }); setAddressErrors({ ...addressErrors, state: '' }); }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors appearance-none bg-white ${addressErrors.state ? 'border-red-400' : 'border-gray-200 focus:border-amber-500'}`}
                    >
                      <option value="">Select State</option>
                      {['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {addressErrors.state && <p className="text-xs text-red-500 mt-1">{addressErrors.state}</p>}
                  </div>
                  {/* ZIP */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ZIP Code *</label>
                    <input
                      type="text" placeholder="10001" value={address.zip}
                      onChange={e => { setAddress({ ...address, zip: e.target.value }); setAddressErrors({ ...addressErrors, zip: '' }); }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${addressErrors.zip ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-500'}`}
                    />
                    {addressErrors.zip && <p className="text-xs text-red-500 mt-1">{addressErrors.zip}</p>}
                  </div>
                  {/* Country */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                    <select
                      value={address.country}
                      onChange={e => setAddress({ ...address, country: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors appearance-none bg-white"
                    >
                      {['United States','Canada','United Kingdom','Australia','Germany','France','Spain','Italy','Netherlands','Japan'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Save address */}
                <label className="flex items-center gap-3 mt-5 cursor-pointer p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <input type="checkbox" checked={address.saveAddress} onChange={e => setAddress({ ...address, saveAddress: e.target.checked })} className="w-4 h-4 accent-amber-700" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Save this address for future orders</p>
                    <p className="text-xs text-gray-500">We'll securely store your address for faster checkout next time</p>
                  </div>
                </label>

                <div className="mt-6 flex gap-3">
                  <button onClick={prevStep} className="px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2">
                    <FaArrowLeft size={13} /> Back
                  </button>
                  <button onClick={nextStep} className="flex-1 py-4 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-black flex items-center justify-center gap-3 shadow-xl shadow-amber-900/20 transition-all">
                    Continue to Shipping <FaArrowRight />
                  </button>
                </div>
              </div>
              <OrderSummary />
            </div>
          )}

          {/* ======================== STEP: SHIPPING ======================== */}
          {step === 'shipping' && (
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-6 md:p-8">
                <button onClick={prevStep} className="flex items-center gap-2 text-gray-500 hover:text-amber-800 mb-6 text-sm font-semibold transition-colors">
                  <FaArrowLeft size={12} /> Back to Address
                </button>
                <h2 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Merriweather, serif' }}>Shipping Method</h2>
                <p className="text-gray-500 text-sm mb-6">Choose how fast you want your books delivered</p>

                {/* Delivery Address Preview */}
                <div className="bg-amber-50 rounded-2xl p-4 mb-6 flex items-start gap-3">
                  <FaMapMarkerAlt className="text-amber-700 mt-0.5 flex-shrink-0" size={16} />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{address.firstName} {address.lastName}</p>
                    <p className="text-sm text-gray-600">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                    <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zip}</p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                  </div>
                  <button onClick={() => setStep('address')} className="text-amber-700 text-xs font-bold hover:underline flex-shrink-0">Edit</button>
                </div>

                <div className="space-y-3">
                  {SHIPPING_METHODS.map(method => {
                    const cost = method.price(cartTotal);
                    const isSelected = shipMethod === method.id;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                          isSelected ? 'border-amber-700 bg-amber-50 shadow-md' : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/30'
                        }`}
                      >
                        <input
                          type="radio" name="shipping" value={method.id}
                          checked={isSelected}
                          onChange={() => setShipMethod(method.id)}
                          className="w-5 h-5 accent-amber-700"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900">{method.name}</p>
                            {method.badge && (
                              <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                                method.badge === 'Popular' ? 'bg-amber-100 text-amber-700' :
                                method.badge === 'Fastest' ? 'bg-red-100 text-red-600' :
                                'bg-emerald-100 text-emerald-700'
                              }`}>{method.badge}</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{method.subtitle}</p>
                          <p className="text-sm font-semibold text-amber-700 flex items-center gap-1 mt-0.5">
                            <FaCalendarAlt size={11} /> {method.time}
                          </p>
                        </div>
                        <span className={`text-lg font-black flex-shrink-0 ${cost === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                          {cost === 0 ? 'FREE' : `$${cost.toFixed(2)}`}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Estimated Delivery */}
                <div className="mt-6 bg-blue-50 rounded-2xl p-4 flex items-center gap-3">
                  <FaTruck className="text-blue-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-bold text-blue-900 text-sm">Estimated Delivery</p>
                    <p className="text-blue-700 text-sm">
                      {shipMethod === 'pickup' ? 'Ready for pickup in ~2 hours' :
                       `Expected by ${deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={prevStep} className="px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2">
                    <FaArrowLeft size={13} /> Back
                  </button>
                  <button onClick={nextStep} className="flex-1 py-4 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-black flex items-center justify-center gap-3 shadow-xl shadow-amber-900/20 transition-all">
                    Continue to Payment <FaArrowRight />
                  </button>
                </div>
              </div>
              <OrderSummary />
            </div>
          )}

          {/* ======================== STEP: PAYMENT ======================== */}
          {step === 'payment' && (
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-6 md:p-8">
                <button onClick={prevStep} className="flex items-center gap-2 text-gray-500 hover:text-amber-800 mb-6 text-sm font-semibold transition-colors">
                  <FaArrowLeft size={12} /> Back to Shipping
                </button>
                <h2 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Merriweather, serif' }}>Payment</h2>
                <p className="text-gray-500 text-sm mb-6">All transactions are secure and encrypted</p>

                {/* Security notice */}
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                  <FaShieldAlt className="text-emerald-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-bold text-emerald-800 text-sm">100% Secure Payment</p>
                    <p className="text-xs text-emerald-600">Your payment info is encrypted with 256-bit SSL</p>
                  </div>
                  <div className="ml-auto flex gap-1 text-gray-400">
                    <SiVisa size={28} className="text-blue-700" />
                    <SiMastercard size={28} className="text-orange-500" />
                    <SiAmericanexpress size={28} className="text-blue-600" />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {PAYMENT_METHODS.map(pm => (
                    <label
                      key={pm.id}
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        payMethod === pm.id ? 'border-amber-700 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input type="radio" name="paymethod" value={pm.id} checked={payMethod === pm.id} onChange={() => setPayMethod(pm.id)} className="w-4 h-4 accent-amber-700" />
                      <span className="text-xl">{pm.icon}</span>
                      <span className="text-sm font-bold text-gray-900">{pm.label}</span>
                    </label>
                  ))}
                </div>

                {/* Card Form */}
                {payMethod === 'card' && (
                  <div className="space-y-4">
                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Card Number *</label>
                      <div className="relative">
                        <FaCreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text" placeholder="1234 5678 9012 3456"
                          value={card.number}
                          onChange={e => { setCard({ ...card, number: formatCardNumber(e.target.value) }); setCardErrors({ ...cardErrors, number: '' }); }}
                          maxLength={19}
                          className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-colors font-mono tracking-widest ${cardErrors.number ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-500'}`}
                        />
                        {card.number.startsWith('4') && <SiVisa className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-700" size={30} />}
                        {card.number.startsWith('5') && <SiMastercard className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500" size={30} />}
                      </div>
                      {cardErrors.number && <p className="text-xs text-red-500 mt-1">{cardErrors.number}</p>}
                    </div>
                    {/* Name on Card */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Name on Card *</label>
                      <div className="relative">
                        <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                        <input
                          type="text" placeholder="Hak Hai"
                          value={card.name}
                          onChange={e => { setCard({ ...card, name: e.target.value }); setCardErrors({ ...cardErrors, name: '' }); }}
                          className={`w-full pl-10 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-colors ${cardErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-500'}`}
                        />
                      </div>
                      {cardErrors.name && <p className="text-xs text-red-500 mt-1">{cardErrors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Expiry */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date *</label>
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                          <input
                            type="text" placeholder="MM/YY"
                            value={card.expiry}
                            onChange={e => { setCard({ ...card, expiry: formatExpiry(e.target.value) }); setCardErrors({ ...cardErrors, expiry: '' }); }}
                            maxLength={5}
                            className={`w-full pl-10 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-colors ${cardErrors.expiry ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-500'}`}
                          />
                        </div>
                        {cardErrors.expiry && <p className="text-xs text-red-500 mt-1">{cardErrors.expiry}</p>}
                      </div>
                      {/* CVV */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          CVV *
                          <span className="ml-1 text-gray-400 font-normal text-xs">(3-4 digits)</span>
                        </label>
                        <div className="relative">
                          <FaBarcode className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                          <input
                            type="password" placeholder="•••"
                            value={card.cvv}
                            onChange={e => { setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').substr(0, 4) }); setCardErrors({ ...cardErrors, cvv: '' }); }}
                            maxLength={4}
                            className={`w-full pl-10 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-colors ${cardErrors.cvv ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-500'}`}
                          />
                        </div>
                        {cardErrors.cvv && <p className="text-xs text-red-500 mt-1">{cardErrors.cvv}</p>}
                      </div>
                    </div>

                    {/* Save Card & Billing */}
                    <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <input type="checkbox" checked={saveCard} onChange={e => setSaveCard(e.target.checked)} className="w-4 h-4 accent-amber-700" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Save card for future purchases</p>
                        <p className="text-xs text-gray-500">We'll securely tokenize your card details</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <input type="checkbox" checked={billingDiff} onChange={e => setBillingDiff(e.target.checked)} className="w-4 h-4 accent-amber-700" />
                      <p className="text-sm font-semibold text-gray-900">Billing address is different from shipping</p>
                    </label>
                  </div>
                )}

                {/* PayPal */}
                {payMethod === 'paypal' && (
                  <div className="text-center py-12 border-2 border-blue-200 rounded-2xl bg-blue-50">
                    <FaPaypal className="text-blue-600 mx-auto mb-3" size={48} />
                    <h3 className="font-bold text-gray-900 mb-2">Pay with PayPal</h3>
                    <p className="text-gray-500 text-sm mb-4">You'll be redirected to PayPal to complete your payment securely</p>
                    <div className="text-2xl font-black text-gray-900">${total.toFixed(2)}</div>
                  </div>
                )}

                {/* Apple Pay */}
                {payMethod === 'apple' && (
                  <div className="text-center py-12 border-2 border-gray-200 rounded-2xl bg-black">
                    <SiApplepay className="text-white mx-auto mb-3" size={80} />
                    <p className="text-gray-400 text-sm mb-4">Use Face ID, Touch ID, or your passcode</p>
                    <div className="text-2xl font-black text-white">${total.toFixed(2)}</div>
                  </div>
                )}

                {/* Google Pay */}
                {payMethod === 'google' && (
                  <div className="text-center py-12 border-2 border-gray-200 rounded-2xl bg-white">
                    <SiGooglepay className="mx-auto mb-3" size={80} />
                    <p className="text-gray-500 text-sm mb-4">Pay with your saved Google payment method</p>
                    <div className="text-2xl font-black text-gray-900">${total.toFixed(2)}</div>
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button onClick={prevStep} className="px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2">
                    <FaArrowLeft size={13} /> Back
                  </button>
                  <button onClick={nextStep} className="flex-1 py-4 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-black flex items-center justify-center gap-3 shadow-xl shadow-amber-900/20 transition-all">
                    Review Order <FaArrowRight />
                  </button>
                </div>
              </div>
              <OrderSummary />
            </div>
          )}

          {/* ======================== STEP: REVIEW ======================== */}
          {step === 'review' && (
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-6 md:p-8">
                <button onClick={prevStep} className="flex items-center gap-2 text-gray-500 hover:text-amber-800 mb-6 text-sm font-semibold transition-colors">
                  <FaArrowLeft size={12} /> Back to Payment
                </button>
                <h2 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Merriweather, serif' }}>Review Your Order</h2>
                <p className="text-gray-500 text-sm mb-6">Please confirm all details before placing your order</p>

                {/* Sections */}
                <div className="space-y-4">
                  {/* Delivery */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-black text-gray-900 flex items-center gap-2"><FaMapMarkerAlt className="text-amber-700" /> Delivery Address</h3>
                      <button onClick={() => setStep('address')} className="text-xs text-amber-700 font-bold hover:underline">Edit</button>
                    </div>
                    <p className="text-gray-700 font-semibold">{address.firstName} {address.lastName}</p>
                    <p className="text-gray-600 text-sm">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                    <p className="text-gray-600 text-sm">{address.city}, {address.state} {address.zip}, {address.country}</p>
                    <p className="text-gray-600 text-sm mt-1">{address.email} · {address.phone}</p>
                  </div>

                  {/* Shipping */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-black text-gray-900 flex items-center gap-2"><FaTruck className="text-amber-700" /> Shipping Method</h3>
                      <button onClick={() => setStep('shipping')} className="text-xs text-amber-700 font-bold hover:underline">Edit</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{selectedShipping?.name}</p>
                        <p className="text-sm text-amber-700">{selectedShipping?.time}</p>
                        {shipMethod !== 'pickup' && (
                          <p className="text-xs text-gray-500 mt-1">
                            Estimated: {deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                          </p>
                        )}
                      </div>
                      <span className={`font-black text-lg ${shippingCost === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-black text-gray-900 flex items-center gap-2"><FaCreditCard className="text-amber-700" /> Payment</h3>
                      <button onClick={() => setStep('payment')} className="text-xs text-amber-700 font-bold hover:underline">Edit</button>
                    </div>
                    {payMethod === 'card' ? (
                      <div className="flex items-center gap-3">
                        {card.number.startsWith('4') ? <SiVisa size={32} className="text-blue-700" /> :
                         card.number.startsWith('5') ? <SiMastercard size={32} className="text-orange-500" /> :
                         <FaCreditCard size={24} className="text-gray-400" />}
                        <div>
                          <p className="font-semibold text-gray-800">Credit / Debit Card</p>
                          <p className="text-sm text-gray-500">•••• •••• •••• {card.number.replace(/\s/g, '').substr(-4) || '••••'}</p>
                          {card.name && <p className="text-xs text-gray-400">{card.name}</p>}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{PAYMENT_METHODS.find(m => m.id === payMethod)?.icon}</span>
                        <p className="font-semibold text-gray-800">{PAYMENT_METHODS.find(m => m.id === payMethod)?.label}</p>
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <h3 className="font-black text-gray-900 flex items-center gap-2 mb-3">
                      <FaBox className="text-amber-700" /> Items ({cart.reduce((s, i) => s + i.quantity, 0)})
                    </h3>
                    <div className="space-y-3">
                      {cart.map((item, i) => (
                        <div key={i} className="flex gap-3 items-center">
                          <div className="w-10 h-14 flex-shrink-0 bg-white rounded-lg p-1 shadow-sm flex items-center justify-center">
                            <img src={item.image} alt={item.title} className="h-full w-auto object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 line-clamp-1" style={{ fontFamily: 'Merriweather, serif' }}>{item.title}</p>
                            <p className="text-xs text-gray-500">{item.selectedFormat} · Quantity {item.quantity}</p>
                          </div>
                          <p className="font-black text-gray-900 text-sm flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final price breakdown */}
                  <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
                    <h3 className="font-black text-gray-900 mb-3">Price Breakdown</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">${cartTotal.toFixed(2)}</span></div>
                      {promoApplied && <div className="flex justify-between text-emerald-600"><span>Promo ({promoCode})</span><span className="font-bold">-${discountAmount.toFixed(2)}</span></div>}
                      <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className={`font-semibold ${shippingCost === 0 ? 'text-emerald-600' : ''}`}>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span></div>
                      {giftWrap && <div className="flex justify-between"><span className="text-gray-600">Gift Wrap</span><span className="font-semibold">$4.99</span></div>}
                      <div className="flex justify-between"><span className="text-gray-600">Tax (8%)</span><span className="font-semibold">${tax.toFixed(2)}</span></div>
                      <div className="flex justify-between text-lg font-black pt-2 border-t border-amber-200">
                        <span>Total Charged</span><span className="text-amber-900">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Place Order */}
                <div className="mt-6">
                  <p className="text-xs text-gray-500 mb-4 text-center">
                    By placing your order you agree to our <a href="#" className="text-amber-700 hover:underline">Terms of Service</a> and <a href="#" className="text-amber-700 hover:underline">Privacy Policy</a>
                  </p>
                  <button
                    onClick={placeOrder}
                    disabled={processing}
                    className="w-full py-5 bg-gradient-to-r from-amber-800 to-amber-600 hover:from-amber-700 hover:to-amber-500 disabled:opacity-70 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-amber-900/30 group"
                  >
                    {processing ? (
                      <>
                        <FaSpinner className="animate-spin" size={20} />
                        Processing Your Order...
                      </>
                    ) : (
                      <>
                        <FaLock size={16} />
                        Place Order · ${total.toFixed(2)}
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><FaShieldAlt size={11} /> SSL Secure</span>
                    <span className="flex items-center gap-1"><FaCreditCard size={11} /> Safe Payment</span>
                    <span className="flex items-center gap-1"><FaTruck size={11} /> Free Returns</span>
                  </div>
                </div>
              </div>
              <OrderSummary />
            </div>
          )}

          {/* ======================== STEP: CONFIRMATION ======================== */}
          {step === 'confirmation' && orderDone && (
            <div className="p-6 md:p-12 text-center max-w-2xl mx-auto">
              {/* Success animation */}
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <FaCheck className="text-emerald-600 text-5xl" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-400/20 rounded-full animate-ping" />
              </div>

              <h2 className="text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Merriweather, serif' }}>
                Order Confirmed! 🎉
              </h2>
              <p className="text-gray-500 text-lg mb-8">
                Thank you, <strong>{address.firstName}</strong>! Your books are on their way.
              </p>

              {/* Order Details Card */}
              <div className="bg-amber-50 rounded-3xl p-8 mb-8 text-left border border-amber-200">
                <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-amber-200">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Order Number</p>
                    <p className="font-black text-gray-900 text-lg">{orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Total Charged</p>
                    <p className="font-black text-amber-800 text-lg">${total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Payment</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {payMethod === 'card' ? `Card ending in ${card.number.replace(/\s/g, '').substr(-4)}` :
                       PAYMENT_METHODS.find(m => m.id === payMethod)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Items</p>
                    <p className="font-semibold text-gray-800 text-sm">{cart.length > 0 ? cart.length : 'Your books'} book(s)</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  {[
                    { icon: FaCheckCircle, color: 'text-emerald-600 bg-emerald-100', title: 'Order Confirmed', subtitle: 'Just now', done: true },
                    { icon: FaBox, color: 'text-blue-600 bg-blue-100', title: 'Preparing Your Books', subtitle: 'Within 24 hours', done: false },
                    { icon: FaTruck, color: 'text-amber-600 bg-amber-100', title: shipMethod === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery', subtitle: selectedShipping?.time, done: false },
                    { icon: FaHome, color: 'text-purple-600 bg-purple-100', title: shipMethod === 'pickup' ? 'Picked Up' : 'Delivered!', subtitle: shipMethod === 'pickup' ? 'At your convenience' : deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }), done: false },
                  ].map(({ icon: Icon, color, title, subtitle, done }) => (
                    <div key={title} className={`flex items-center gap-4 ${done ? 'opacity-100' : 'opacity-60'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${done ? 'text-gray-900' : 'text-gray-600'}`}>{title}</p>
                        <p className="text-xs text-gray-500">{subtitle}</p>
                      </div>
                      {done && <FaCheck className="text-emerald-500" size={14} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Email & Info */}
              <div className="flex items-start gap-3 bg-blue-50 rounded-2xl p-4 mb-8 text-left">
                <FaEnvelope className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <p className="font-bold text-blue-900 text-sm">Confirmation Email Sent</p>
                  <p className="text-blue-600 text-sm">We've sent your order details and tracking info to <strong>{address.email}</strong></p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => { setOrderDone(false); setStep('cart'); onClose(); }}
                  className="flex-1 py-4 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-black transition-all shadow-xl"
                >
                  Continue Shopping 📚
                </button>
                <button
                  onClick={() => { setOrderDone(false); setStep('cart'); onClose(); }}
                  className="flex-1 py-4 border-2 border-amber-800 text-amber-800 hover:bg-amber-50 rounded-xl font-black transition-all"
                >
                  Track Order 🚚
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-6">
                Need help? Contact us at <a href="mailto:support@bookhaven.com" className="text-amber-700 hover:underline">support@bookhaven.com</a> or call 1-800-BOOKS-NOW
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
