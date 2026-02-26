import { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebook, FaSignOutAlt, FaShoppingBag, FaHeart, FaBook } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';

interface AuthModalProps { isOpen: boolean; onClose: () => void; }

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, login, logout } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && form.password !== form.confirm) { alert('Passwords do not match'); return; }
    setLoading(true);
    setTimeout(() => {
      login(form.name || form.email.split('@')[0], form.email);
      setLoading(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-fadeIn">
          <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:rotate-90 transition-all">
            <FaTimes />
          </button>

          {user ? (
            /* Logged In */
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <span className="text-4xl font-black text-white">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>Welcome back!</h2>
                <p className="text-gray-500 text-sm mt-1">{user.email}</p>
              </div>
              <div className="bg-amber-50 rounded-2xl p-5 mb-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center"><FaUser className="text-amber-700" size={14} /></div>
                  <div><p className="text-xs text-gray-400">Name</p><p className="font-bold text-gray-900 text-sm">{user.name}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center"><FaEnvelope className="text-amber-700" size={14} /></div>
                  <div><p className="text-xs text-gray-400">Email</p><p className="font-bold text-gray-900 text-sm">{user.email}</p></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: FaShoppingBag, label: 'Orders', color: 'bg-blue-100 text-blue-600' },
                  { icon: FaHeart, label: 'Wishlist', color: 'bg-red-100 text-red-600' },
                  { icon: FaBook, label: 'Library', color: 'bg-amber-100 text-amber-700' },
                ].map(({ icon: Icon, label, color }) => (
                  <button key={label} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}><Icon size={15} /></div>
                    <span className="text-xs font-medium text-gray-600">{label}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => { logout(); onClose(); }} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                <FaSignOutAlt /> Sign Out
              </button>
            </div>
          ) : (
            /* Login/Register */
            <div>
              <div className="h-32 bg-gradient-to-br from-amber-800 to-amber-600 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl">📚</span>
                  <p className="text-white font-bold mt-1 text-lg" style={{ fontFamily: 'Merriweather, serif' }}>KhmerBookStore</p>
                </div>
              </div>
              <div className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
                    {isLogin ? 'Welcome Back, Reader!' : 'Join KhmerBookStore'}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {isLogin ? 'Sign in to your reading account' : 'Create your free account today'}
                  </p>
                </div>

                {/* Social */}
                <div className="space-y-3 mb-6">
                  <button className="w-full py-3 border-2 border-gray-200 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all text-sm">
                    <FaGoogle className="text-red-500" /> Continue with Google
                  </button>
                  <button className="w-full py-3 border-2 border-gray-200 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all text-sm">
                    <FaFacebook className="text-blue-600" /> Continue with Facebook
                  </button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-gray-100" /></div>
                  <div className="relative flex justify-center"><span className="px-4 bg-white text-gray-400 text-sm">or with email</span></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                      <input type="text" placeholder="Full Name" value={form.name} required onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors" />
                    </div>
                  )}
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input type="email" placeholder="Email Address" value={form.email} required onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors" />
                  </div>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input type="password" placeholder="Password" value={form.password} required onChange={e => setForm({ ...form, password: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors" />
                  </div>
                  {!isLogin && (
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                      <input type="password" placeholder="Confirm Password" value={form.confirm} required onChange={e => setForm({ ...form, confirm: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors" />
                    </div>
                  )}
                  {isLogin && (
                    <div className="flex justify-end">
                      <button type="button" className="text-sm text-amber-700 hover:underline font-medium">Forgot password?</button>
                    </div>
                  )}
                  <button type="submit" disabled={loading} className="w-full py-4 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70">
                    {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Please wait...</> : (isLogin ? 'Sign In' : 'Create Account')}
                  </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                  {isLogin ? "Don't have an account? " : 'Already a member? '}
                  <button onClick={() => setIsLogin(!isLogin)} className="text-amber-700 font-bold hover:underline">
                    {isLogin ? 'Sign Up Free' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
