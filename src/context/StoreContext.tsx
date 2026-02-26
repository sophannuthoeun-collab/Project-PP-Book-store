import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, CartItem, WishlistItem, User } from '../types';

interface StoreContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  user: User | null;
  addToCart: (book: Book, format: string) => void;
  removeFromCart: (bookId: number, format: string) => void;
  updateQuantity: (bookId: number, format: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: number) => void;
  isInWishlist: (bookId: number) => boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { const s = localStorage.getItem('bh_cart'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try { const s = localStorage.getItem('bh_wishlist'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });
  const [user, setUser] = useState<User | null>(() => {
    try { const s = localStorage.getItem('bh_user'); return s ? JSON.parse(s) : null; }
    catch { return null; }
  });

  useEffect(() => { localStorage.setItem('bh_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('bh_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => {
    if (user) localStorage.setItem('bh_user', JSON.stringify(user));
    else localStorage.removeItem('bh_user');
  }, [user]);

  const addToCart = (book: Book, format: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === book.id && i.selectedFormat === format);
      if (existing) {
        return prev.map(i =>
          i.id === book.id && i.selectedFormat === format
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...book, quantity: 1, selectedFormat: format }];
    });
  };

  const removeFromCart = (bookId: number, format: string) => {
    setCart(prev => prev.filter(i => !(i.id === bookId && i.selectedFormat === format)));
  };

  const updateQuantity = (bookId: number, format: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(bookId, format); return; }
    setCart(prev => prev.map(i =>
      i.id === bookId && i.selectedFormat === format ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => setCart([]);

  const addToWishlist = (book: Book) => {
    setWishlist(prev => {
      if (prev.find(i => i.id === book.id)) return prev;
      return [...prev, book];
    });
  };

  const removeFromWishlist = (bookId: number) => {
    setWishlist(prev => prev.filter(i => i.id !== bookId));
  };

  const isInWishlist = (bookId: number) => wishlist.some(i => i.id === bookId);

  const login = (name: string, email: string) => {
    setUser({ name, email, isLoggedIn: true, joinDate: new Date().getFullYear().toString(), ordersCount: 0 });
  };

  const logout = () => setUser(null);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <StoreContext.Provider value={{
      cart, wishlist, user,
      addToCart, removeFromCart, updateQuantity, clearCart,
      addToWishlist, removeFromWishlist, isInWishlist,
      login, logout, cartTotal, cartCount,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
