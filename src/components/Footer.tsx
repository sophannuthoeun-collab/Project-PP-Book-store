import { 
  FaFacebook, FaTwitter, FaInstagram, FaYoutube, 
  FaEnvelope, FaCcVisa, FaCcMastercard, 
  FaCcPaypal, FaCcApplePay, FaGooglePlay 
} from 'react-icons/fa';
import { FaApple } from 'react-icons/fa6';

export function Footer() {
  return (
    <footer className="bg-amber-950 text-amber-100">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-700">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black mb-2" style={{ fontFamily: 'Merriweather, serif' }}>📚 Get Reading Recommendations</h3>
              <p className="text-amber-200 text-sm">Weekly curated picks + 15% off your first order. No spam, just great books.</p>
            </div>
            <form className="flex w-full md:w-auto max-w-md" onSubmit={e => e.preventDefault()}>
  <div className="relative flex-1">
    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
    <input 
      type="email" 
      placeholder="your@email.com" 
      className="
        w-full pl-11 pr-4 py-4 
        bg-white text-gray-900 
        rounded-l-xl border border-gray-300 
        focus:outline-none focus:border-amber-950 
        transition-colors duration-200 ease-in-out
        placeholder:text-gray-500 placeholder:font-light
      " 
    />
  </div>
  <button className="
    px-6 py-4 
    bg-amber-950 text-white font-bold 
    rounded-r-xl border border-amber-950 border-l-0
    hover:bg-amber-900 hover:border-amber-900
    transition-colors duration-200 ease-in-out 
    whitespace-nowrap
  ">
    Subscribe
  </button>
</form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-amber-700 rounded-xl flex items-center justify-center text-xl">📚</div>
              <span className="text-2xl font-black" style={{ fontFamily: 'Merriweather, serif' }}>Khmer<span className="text-amber-400">Bookstore</span></span>
            </div>
            <p className="text-amber-300/70 text-sm mb-6 max-w-xs leading-relaxed">Your premier online destination for books of every genre. Discover, read, and grow with over 50,000 titles.</p>
            <div className="flex gap-3">
              {[FaFacebook, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-amber-900 rounded-full flex items-center justify-center text-amber-400 hover:bg-amber-700 hover:text-white transition-all">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Shop', links: ['All Books', 'New Arrivals', 'Bestsellers', 'On Sale', 'Award Winners', 'Book Bundles'] },
            { title: 'Genres', links: ['Fiction', 'Non-Fiction', 'Self-Help', 'Biography', 'Children\'s', 'Science Fiction'] },
            { title: 'Help', links: ['FAQ', 'Shipping Info', 'Returns', 'Track Order', 'Gift Cards', 'Contact Us'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-bold text-white mb-4" style={{ fontFamily: 'Merriweather, serif' }}>{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}><a href="#" className="text-amber-300/70 hover:text-amber-200 transition-colors text-sm">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App badges */}
        <div className="border-t border-amber-900 mt-12 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-bold text-white mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Read Anywhere — Get the App</h4>
            <p className="text-amber-300/60 text-sm">Access your library on iOS and Android</p>
          </div>
          <div className="flex gap-3">
            {[{ icon: <FaApple/>, store: 'App Store', sub: 'Download on the' }, { icon: <FaGooglePlay/>, store: 'Google Play', sub: 'Get it on' }].map(a => (
              <button key={a.store} className="px-5 py-3 bg-amber-900 rounded-xl flex items-center gap-3 hover:bg-amber-800 transition-colors">
                <span className="text-2xl">{a.icon}</span>
                <div className="text-left">
                  <p className="text-xs text-amber-400">{a.sub}</p>
                  <p className="font-bold text-white text-sm">{a.store}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-amber-900">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-amber-400">We Accept:</span>
            <div className="flex gap-2 text-2xl text-amber-600">
              <FaCcVisa className="hover:text-amber-300 transition-colors" />
              <FaCcMastercard className="hover:text-amber-300 transition-colors" />
              <FaCcPaypal className="hover:text-amber-300 transition-colors" />
              <FaCcApplePay className="hover:text-amber-300 transition-colors" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-amber-400/60">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'].map(l => (
              <a key={l} href="#" className="hover:text-amber-300 transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-sm text-amber-400/40">© 2026 KhmerBookStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
