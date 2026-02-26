import { useState } from "react";

const NAV_LINKS = ["Khmer-Literature", "Fiction", "Non-Fiction", "Self-Help", "Biography", "Children", "Health"];

const FAQ_DATA = [
  {
    category: "Orders & Shipping",
    icon: "📦",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 3–7 business days within Cambodia. Express shipping (1–2 business days) is available at checkout for an additional fee. International orders may take 10–21 business days depending on the destination.",
      },
      {
        q: "Can I track my order?",
        a: "Yes! Once your order is shipped, you'll receive a confirmation email with a tracking number. You can use this number on our order tracking page or the courier's website to monitor your delivery in real time.",
      },
      {
        q: "Do you offer free shipping?",
        a: "We offer free standard shipping on all orders over $35 USD within Cambodia. Orders below this threshold have a flat shipping rate of $3.99.",
      },
      {
        q: "Can I change or cancel my order after placing it?",
        a: "Orders can be modified or cancelled within 1 hour of placement. After that window, the order enters our fulfillment process and changes may not be possible. Please contact our support team as quickly as possible at support@khmerbookstore.com.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    icon: "↩️",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 30 days of delivery. Books must be in their original, unread condition — no markings, damage, or missing pages. Sale items and digital downloads are non-refundable.",
      },
      {
        q: "How do I start a return?",
        a: "Visit our Returns page in the footer, fill in your order number and reason for return, and we'll email you a prepaid return label. Once we receive and inspect the item, your refund will be processed within 5–7 business days.",
      },
      {
        q: "What if I received a damaged or wrong book?",
        a: "We're sorry about that! Please email us at support@khmerbookstore.com within 7 days of delivery with a photo of the issue. We'll send a replacement or issue a full refund — your choice — at no extra cost.",
      },
    ],
  },
  {
    category: "Account & Membership",
    icon: "👤",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click the user icon in the top-right corner of any page and select 'Sign Up'. Enter your name, email, and a password. You'll receive a verification email to activate your account.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "On the login page, click 'Forgot Password?' and enter your registered email address. You'll receive a reset link within a few minutes. Check your spam folder if it doesn't arrive.",
      },
      {
        q: "Is there a loyalty or rewards program?",
        a: "Yes! Every purchase earns you Bookstore Points. 100 points = $1 discount on future orders. Points are automatically added to your account after delivery confirmation. Check your balance anytime in your account dashboard.",
      },
    ],
  },
  {
    category: "Books & Inventory",
    icon: "📚",
    questions: [
      {
        q: "How do I know if a book is in stock?",
        a: "Each book listing shows a real-time stock status ('In Stock', 'Low Stock', or 'Out of Stock') directly on the product card and detail page.",
      },
      {
        q: "Can I request a book that isn't listed?",
        a: "Absolutely! Use the 'Request a Book' form on our Contact page. We review all requests weekly and will notify you by email if we're able to source it. We stock over 50,000 titles and add new ones regularly.",
      },
      {
        q: "Do you sell e-books or audiobooks?",
        a: "Currently, our catalog focuses on physical books. We are actively working on a digital library feature and plan to launch e-books and audiobooks in late 2025. Subscribe to our newsletter to be the first to know!",
      },
    ],
  },
  {
    category: "Payments",
    icon: "💳",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, American Express, PayPal, ABA Pay, Wing, and KHQR (Cambodia QR payment). All transactions are secured with 256-bit SSL encryption.",
      },
      {
        q: "Is my payment information safe?",
        a: "Yes. We never store your full card details on our servers. All payment processing is handled by PCI-DSS compliant payment gateways, ensuring your financial data is fully protected.",
      },
    ],
  },
];

function Navbar() {
  return (
    <header style={{ background: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, height: 60 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ background: "#c0392b", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📖</div>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700 }}>
              <span style={{ color: "#222" }}>Khmer</span>
              <span style={{ color: "#c0392b" }}>Bookstore</span>
            </span>
          </div>

          {/* Nav Links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
            <a href="#" style={{ background: "#2c2c2c", color: "#fff", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>All Books</a>
            {NAV_LINKS.map((link) => (
              <a key={link} href="#" style={{ color: "#444", fontSize: 13, padding: "6px 10px", textDecoration: "none", whiteSpace: "nowrap", borderRadius: 6 }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c0392b")}
                onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
                {link}
              </a>
            ))}
            <a href="#" style={{ color: "#e74c3c", fontSize: 13, padding: "6px 10px", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}>🔥 Sale</a>
          </nav>

          {/* Search + User */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", background: "#f5f5f5", borderRadius: 24, padding: "6px 14px", gap: 8, width: 220 }}>
              <span style={{ color: "#999", fontSize: 14 }}>🔍</span>
              <input placeholder="Search titles, authors, genres..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#333", width: "100%" }} />
            </div>
            <div style={{ background: "#c0392b", color: "#fff", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>P</div>
            <span style={{ color: "#555", fontSize: 14, cursor: "pointer" }}>♡</span>
            <div style={{ position: "relative", cursor: "pointer" }}>
              <span style={{ fontSize: 18 }}>🛒</span>
              <span style={{ position: "absolute", top: -6, right: -6, background: "#c0392b", color: "#fff", borderRadius: "50%", fontSize: 9, width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>6</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#1a1a1a", color: "#ccc", paddingTop: 48, paddingBottom: 24 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, paddingBottom: 36, borderBottom: "1px solid #333" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ background: "#c0392b", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📖</div>
              <span style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700 }}>
                <span style={{ color: "#fff" }}>Khmer</span>
                <span style={{ color: "#e74c3c" }}>Bookstore</span>
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#999", maxWidth: 260 }}>
              Your premier online destination for books of every genre. Discover, read, and grow with over 50,000 titles.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p style={{ color: "#fff", fontWeight: 600, marginBottom: 14, fontSize: 14 }}>Shop</p>
            {["All Books", "New Arrivals", "Bestsellers", "Sale"].map(l => (
              <a key={l} href="#" style={{ display: "block", color: "#999", fontSize: 13, marginBottom: 8, textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e74c3c")}
                onMouseLeave={e => (e.currentTarget.style.color = "#999")}>{l}</a>
            ))}
          </div>

          {/* Genres */}
          <div>
            <p style={{ color: "#fff", fontWeight: 600, marginBottom: 14, fontSize: 14 }}>Genres</p>
            {["Fiction", "Non-Fiction", "Self-Help", "Biography", "Children"].map(l => (
              <a key={l} href="#" style={{ display: "block", color: "#999", fontSize: 13, marginBottom: 8, textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e74c3c")}
                onMouseLeave={e => (e.currentTarget.style.color = "#999")}>{l}</a>
            ))}
          </div>

          {/* Help */}
          <div>
            <p style={{ color: "#fff", fontWeight: 600, marginBottom: 14, fontSize: 14 }}>Help</p>
            {[
              { label: "FAQ", href: "/faq" },
              { label: "Shipping Info", href: "#" },
              { label: "Returns", href: "#" },
              { label: "Contact Us", href: "#" },
            ].map(l => (
              <a key={l.label} href={l.href} style={{ display: "block", color: l.label === "FAQ" ? "#e74c3c" : "#999", fontSize: 13, marginBottom: 8, textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e74c3c")}
                onMouseLeave={e => (e.currentTarget.style.color = l.label === "FAQ" ? "#e74c3c" : "#999")}>{l.label}</a>
            ))}
          </div>
        </div>

        <div style={{ paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 12, color: "#666" }}>© 2025 KhmerBookstore. All rights reserved.</p>
          <div style={{ display: "flex", gap: 16 }}>
            {["Privacy Policy", "Terms of Service"].map(l => (
              <a key={l} href="#" style={{ color: "#666", fontSize: 12, textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e74c3c")}
                onMouseLeave={e => (e.currentTarget.style.color = "#666")}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: "1px solid #eee",
        transition: "background 0.2s",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 0",
          textAlign: "left",
          gap: 16,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: "#222", lineHeight: 1.4 }}>{q}</span>
        <span
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: open ? "#c0392b" : "#f5f5f5",
            color: open ? "#fff" : "#555",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 300,
            transition: "all 0.2s",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div style={{ paddingBottom: 18, paddingRight: 44 }}>
          <p style={{ margin: 0, fontSize: 14, color: "#555", lineHeight: 1.75 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const displayed = activeCategory
    ? FAQ_DATA.filter((c) => c.category === activeCategory)
    : FAQ_DATA;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #fdf6ec 0%, #fde8d8 100%)", padding: "56px 24px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#c0392b", borderRadius: 12, padding: "8px 16px", marginBottom: 16 }}>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Help Center</span>
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 40, fontWeight: 700, color: "#1a1a1a", margin: "0 0 12px" }}>
          Frequently Asked Questions
        </h1>
        <p style={{ fontSize: 16, color: "#666", maxWidth: 500, margin: "0 auto 32px" }}>
          Everything you need to know about shopping at KhmerBookstore. Can't find your answer?{" "}
          <a href="#" style={{ color: "#c0392b", textDecoration: "none", fontWeight: 600 }}>Contact us</a>.
        </p>

        {/* Search bar */}
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", background: "#fff", borderRadius: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <span style={{ padding: "14px 18px", fontSize: 18, color: "#999" }}>🔍</span>
          <input
            placeholder="Search your question..."
            style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: "#333", paddingRight: 16 }}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", position: "sticky", top: 60, zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", gap: 8, overflowX: "auto", paddingTop: 12, paddingBottom: 12 }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              padding: "8px 18px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: "nowrap",
              background: activeCategory === null ? "#c0392b" : "#f5f5f5",
              color: activeCategory === null ? "#fff" : "#555",
              transition: "all 0.2s",
            }}
          >
            All Topics
          </button>
          {FAQ_DATA.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
              style={{
                padding: "8px 18px",
                borderRadius: 20,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
                background: activeCategory === cat.category ? "#c0392b" : "#f5f5f5",
                color: activeCategory === cat.category ? "#fff" : "#555",
                transition: "all 0.2s",
              }}
            >
              {cat.icon} {cat.category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Content */}
      <main style={{ flex: 1, background: "#fafafa", padding: "48px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
          {displayed.map((cat) => (
            <div key={cat.category} style={{ background: "#fff", borderRadius: 16, padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{cat.icon}</span>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{cat.category}</h2>
                <span style={{ marginLeft: "auto", background: "#fdf0ee", color: "#c0392b", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 12 }}>
                  {cat.questions.length} questions
                </span>
              </div>
              <div style={{ height: 2, background: "linear-gradient(to right, #c0392b, transparent)", marginBottom: 8, borderRadius: 2 }} />
              {cat.questions.map((item) => (
                <AccordionItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          ))}
        </div>

        {/* Still need help CTA */}
        <div style={{
          maxWidth: 900,
          margin: "40px auto 0",
          background: "linear-gradient(135deg, #c0392b, #e74c3c)",
          borderRadius: 16,
          padding: "36px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
        }}>
          <div>
            <h3 style={{ color: "#fff", fontFamily: "Georgia, serif", fontSize: 22, margin: "0 0 6px" }}>Still have questions?</h3>
            <p style={{ color: "rgba(255,255,255,0.85)", margin: 0, fontSize: 14 }}>Our support team is happy to help you out.</p>
          </div>
          <a
            href="#"
            style={{
              background: "#fff",
              color: "#c0392b",
              borderRadius: 28,
              padding: "12px 28px",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            Contact Support →
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}