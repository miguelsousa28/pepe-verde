/* global React */
// Pepe Verde — shared UI primitives + chrome.
const { useState, useEffect, useRef, useCallback } = React;

// ============================================================
// STRIPE BACKGROUND — vertical light-green / off-white stripes
// ============================================================
function StripeBg({ opacity = 1, className = "", style = {} }) {
  // 8 vertical bands across full width; soft sage/cream.
  return (
    <div
      className={"pv-stripes " + className}
      style={{
        position: "absolute", inset: 0, zIndex: 0,
        opacity, pointerEvents: "none",
        backgroundImage:
          "repeating-linear-gradient(90deg, #B7C6B0 0 12.5%, #F2EFE2 12.5% 25%)",
        ...style,
      }}
    />
  );
}

// ============================================================
// LOGO — uses the real Pepe Verde circle mark (jpg).
// `size` is the diameter in px. `flat` removes the cream backdrop
// so it sits on cream sections without a visible square.
// ============================================================
function Logo({ size = 80, flat = true, alt = "Pepe Verde" }) {
  return (
    <img
      src="assets/logo.jpg"
      alt={alt}
      width={size}
      height={size}
      style={{
        width: size, height: size, display: "block",
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  );
}

// Wordmark-only fallback (for header, mobile). Hand-blocky like the logo.
function Wordmark({ small = false }) {
  return (
    <span className="pv-wordmark" style={{
      fontFamily: 'Bowlby One, "Bowlby One SC", system-ui, sans-serif',
      letterSpacing: "0.02em",
      color: "#1F5A3F",
      fontSize: small ? 18 : 22,
      lineHeight: 1,
      textTransform: "uppercase",
    }}>
      Pepe Verde
    </span>
  );
}

// ============================================================
// BUTTONS
// ============================================================
function Button({ children, variant = "primary", as = "button", href, onClick, type = "button", size = "md", style = {}, full = false, ...rest }) {
  const sizes = {
    sm: { padding: "8px 14px", fontSize: 13 },
    md: { padding: "12px 22px", fontSize: 14 },
    lg: { padding: "16px 28px", fontSize: 15 },
  };
  const base = {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    borderRadius: 2,
    cursor: "pointer",
    transition: "all 0.15s ease",
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    border: "1px solid #1F5A3F",
    textDecoration: "none",
    width: full ? "100%" : "auto",
    ...sizes[size],
  };
  const variants = {
    primary: { background: "#1F5A3F", color: "#F7F4E8" },
    outline: { background: "transparent", color: "#1F5A3F" },
    red: { background: "#C8463F", color: "#F7F4E8", border: "1px solid #C8463F" },
    ghost: { background: "transparent", color: "#1F5A3F", border: "1px solid transparent" },
  };
  const Tag = as === "a" || href ? "a" : "button";
  const props = Tag === "a" ? { href, ...rest } : { type, onClick, ...rest };
  return (
    <Tag
      className="pv-btn"
      style={{ ...base, ...variants[variant], ...style }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Tag>
  );
}

// ============================================================
// SECTION TITLE — red, blocky, matches PIZZA CLÁSSICA style
// ============================================================
function RedTitle({ children, as = "h2", size = 40, align = "center", style = {} }) {
  const Tag = as;
  return (
    <Tag style={{
      fontFamily: 'Bowlby One, system-ui, sans-serif',
      color: "#C8463F",
      textTransform: "uppercase",
      letterSpacing: "0.02em",
      fontSize: size,
      lineHeight: 1,
      textAlign: align,
      margin: 0,
      fontWeight: 400,
      ...style,
    }}>{children}</Tag>
  );
}

function GreenTitle({ children, as = "h3", size = 22, align = "center", style = {} }) {
  const Tag = as;
  return (
    <Tag style={{
      fontFamily: 'Bowlby One, system-ui, sans-serif',
      color: "#1F5A3F",
      textTransform: "uppercase",
      letterSpacing: "0.02em",
      fontSize: size,
      lineHeight: 1.05,
      textAlign: align,
      margin: 0,
      fontWeight: 400,
      ...style,
    }}>{children}</Tag>
  );
}

// ============================================================
// MENU ITEM — name+price row, italics-style desc below
// ============================================================
function MenuItem({ item, lang = "pt", compact = false }) {
  const desc = lang === "en" ? item.desc_en : item.desc_pt;
  const tagLabel = { v: "(v)", vg: "(vegano)", gf: "(gf)" };
  return (
    <article style={{
      display: "flex", flexDirection: "column", gap: 6,
      padding: compact ? "10px 0" : "14px 0",
      borderBottom: "1px dashed rgba(31,90,63,0.18)",
    }}>
      <header style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between",
        gap: 12, flexWrap: "wrap",
      }}>
        <h4 style={{
          fontFamily: 'Bowlby One, system-ui, sans-serif',
          color: "#1F5A3F", margin: 0,
          fontSize: 15, letterSpacing: "0.03em",
          textTransform: "uppercase", fontWeight: 400,
        }}>
          {item.name}
          {item.tags?.length > 0 && (
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 500,
              marginLeft: 8, color: "#1F5A3F", opacity: 0.7,
              textTransform: "lowercase", letterSpacing: 0,
            }}>
              {item.tags.map((t) => tagLabel[t]).join(" ")}
            </span>
          )}
        </h4>
        {item.price && (
          <span style={{
            fontFamily: 'Bowlby One, system-ui, sans-serif',
            color: "#1F5A3F", fontSize: 14, letterSpacing: "0.02em",
          }}>
            {item.price}{item.price.includes("/") ? "" : " €"}
          </span>
        )}
      </header>
      {desc && (
        <p style={{
          margin: 0, fontFamily: 'Inter, sans-serif', fontSize: 13,
          color: "#2C5142", lineHeight: 1.45, maxWidth: 560,
        }}>{desc}</p>
      )}
    </article>
  );
}

// ============================================================
// TOAST
// ============================================================
const ToastCtx = React.createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, kind = "ok") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div style={{
        position: "fixed", bottom: 20, right: 20, zIndex: 999,
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        {toasts.map((t) => (
          <div key={t.id} style={{
            background: t.kind === "err" ? "#C8463F" : "#1F5A3F",
            color: "#F7F4E8", padding: "12px 18px", fontSize: 13,
            fontFamily: 'Inter, sans-serif',
            border: "1px solid rgba(0,0,0,0.15)",
            maxWidth: 340, animation: "pvSlide 0.2s ease",
          }}>{t.msg}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
function useToast() { return React.useContext(ToastCtx); }

// ============================================================
// PLACEHOLDER PHOTO — striped block with monospace explainer
// (used wherever a real photo isn't available yet)
// ============================================================
function PhotoPlaceholder({ label = "interior photo", aspect = "4/3", style = {} }) {
  return (
    <div style={{
      position: "relative", width: "100%", aspectRatio: aspect,
      background: "#F2EFE2",
      backgroundImage:
        "repeating-linear-gradient(135deg, rgba(31,90,63,0.05) 0 8px, transparent 8px 16px)",
      border: "1px solid rgba(31,90,63,0.25)",
      display: "flex", alignItems: "center", justifyContent: "center",
      ...style,
    }}>
      <span style={{
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: 11, color: "#1F5A3F", opacity: 0.6,
        letterSpacing: "0.05em", textTransform: "uppercase",
      }}>[ {label} ]</span>
    </div>
  );
}

// ============================================================
// HEADER + nav (responsive). `route` is current hash route key.
// ============================================================
function Header({ route, lang, setLang, settings }) {
  const t = window.PV.T[lang];
  const [open, setOpen] = useState(false);
  const links = [
    ["home", t.nav_home],
    ["menu", t.nav_menu],
    ["sobre", t.nav_sobre],
    ["contactos", t.nav_contactos],
  ];

  const navLink = (key, label) => (
    <a
      key={key}
      href={"#/" + (key === "home" ? "" : key)}
      onClick={() => setOpen(false)}
      style={{
        fontFamily: 'Inter, sans-serif', fontSize: 13,
        color: route === key ? "#C8463F" : "#1F5A3F",
        textDecoration: "none", letterSpacing: "0.06em",
        textTransform: "uppercase", fontWeight: 500,
        padding: "8px 0",
        borderBottom: route === key ? "1px solid #C8463F" : "1px solid transparent",
      }}
    >{label}</a>
  );

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "#F7F4E8",
      borderBottom: "1px solid #1F5A3F",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 24,
      }}>
        <a href="#/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <Logo size={44} flat />
          <span style={{
            display: "none",
            fontFamily: 'Bowlby One, system-ui, sans-serif',
            color: "#1F5A3F", fontSize: 18, letterSpacing: "0.04em",
            textTransform: "uppercase",
          }} className="pv-wordmark-show">PEPE VERDE</span>
        </a>

        <nav className="pv-nav-desk" style={{
          display: "flex", gap: 28, alignItems: "center",
        }}>
          {links.map(([k, l]) => navLink(k, l))}
        </nav>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{
            display: "flex", border: "1px solid #1F5A3F",
            fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
            letterSpacing: "0.06em",
          }}>
            {["pt", "en"].map((l) => (
              <button key={l} onClick={() => setLang(l)} style={{
                background: lang === l ? "#1F5A3F" : "transparent",
                color: lang === l ? "#F7F4E8" : "#1F5A3F",
                border: "none", padding: "6px 10px", cursor: "pointer",
                textTransform: "uppercase",
              }}>{l}</button>
            ))}
          </div>
          <a className="pv-uber-desk" href={settings.ubereats} target="_blank" rel="noopener" style={{
            fontFamily: 'Inter, sans-serif', fontSize: 12,
            color: "#1F5A3F", letterSpacing: "0.06em",
            textTransform: "uppercase", textDecoration: "none",
            borderBottom: "1px solid #1F5A3F", paddingBottom: 2,
          }}>{t.cta_uber}</a>
          <button className="pv-reserve-desk" onClick={() => window.openReservation && window.openReservation()} style={{
            fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600,
            background: "#1F5A3F", color: "#F7F4E8", border: "1px solid #1F5A3F",
            padding: "10px 16px", textDecoration: "none", cursor: "pointer",
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>{t.cta_reserve}</button>
          <button className="pv-menu-toggle" onClick={() => setOpen(!open)} aria-label="Menu" style={{
            display: "none", background: "transparent", border: "1px solid #1F5A3F",
            width: 40, height: 40, cursor: "pointer", padding: 0,
          }}>
            <span style={{
              display: "block", width: 18, height: 2, background: "#1F5A3F",
              margin: "5px auto", boxShadow: "0 6px 0 #1F5A3F, 0 -6px 0 #1F5A3F",
            }} />
          </button>
        </div>
      </div>

      {open && (
        <div className="pv-nav-mobile-panel" style={{
          borderTop: "1px solid #1F5A3F", background: "#F7F4E8",
          padding: "16px 24px", display: "flex", flexDirection: "column", gap: 14,
        }}>
          {links.map(([k, l]) => navLink(k, l))}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => { setOpen(false); window.openReservation && window.openReservation(); }} style={{
              flex: 1, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
              background: "#1F5A3F", color: "#F7F4E8", padding: "12px 16px", border: "none",
              cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase",
              textAlign: "center",
            }}>{t.cta_reserve}</button>
            <a href={settings.ubereats} target="_blank" rel="noopener" style={{
              flex: 1, fontFamily: 'Inter, sans-serif', fontSize: 13,
              border: "1px solid #1F5A3F", color: "#1F5A3F", padding: "12px 16px",
              textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase",
              textAlign: "center",
            }}>{t.cta_uber}</a>
          </div>
        </div>
      )}
    </header>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer({ lang, settings }) {
  const t = window.PV.T[lang];
  const orderedDays = [1, 2, 3, 4, 5, 6, 0].map(
    (d) => settings.hours.find((h) => h.day === d)
  );
  return (
    <footer style={{
      background: "#1F5A3F", color: "#F2EFE2", marginTop: 80,
      borderTop: "1px solid #1F5A3F",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto", padding: "60px 24px 30px",
        display: "grid", gap: 40,
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      }}>
        <div>
          <img src="assets/logo.jpg" alt="Pepe Verde" width="120" height="120"
               style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }} />
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 13, marginTop: 16,
            lineHeight: 1.6, opacity: 0.85, maxWidth: 280,
          }}>{t.come_hungry}<br/>{t.made_fresh}</p>
        </div>
        <div>
          <h4 style={{ fontFamily: 'Bowlby One, sans-serif', fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0, marginBottom: 14, color: "#F2EFE2", fontWeight: 400 }}>{t.nav_contactos}</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: 1.5 }}>
            <li>{settings.address_line1}</li>
            <li>{settings.address_line2}</li>
            <li style={{ marginTop: 6 }}>
              <a href={"tel:+351" + settings.phone.replace(/\s/g, "")} style={{ color: "#F2EFE2", textDecoration: "underline" }}>{settings.phone}</a>
            </li>
            <li>
              <a href={"https://wa.me/" + settings.whatsapp} target="_blank" rel="noopener" style={{ color: "#F2EFE2", textDecoration: "underline" }}>WhatsApp</a>
            </li>
            <li>
              <a href={"https://instagram.com/" + settings.instagram} target="_blank" rel="noopener" style={{ color: "#F2EFE2", textDecoration: "underline" }}>@{settings.instagram}</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontFamily: 'Bowlby One, sans-serif', fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0, marginBottom: 14, color: "#F2EFE2", fontWeight: 400 }}>{t.hours_title}</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4, fontFamily: 'Inter, sans-serif', fontSize: 12, lineHeight: 1.6, opacity: 0.9 }}>
            {orderedDays.map((h) => (
              <li key={h.day} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>{lang === "pt" ? h.label_pt : h.label_en}</span>
                <span style={{ opacity: 0.85, fontVariantNumeric: "tabular-nums" }}>
                  {h.open ? h.slots.map((s) => s.join("–")).join(", ") : t.closed}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ fontFamily: 'Bowlby One, sans-serif', fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0, marginBottom: 14, color: "#F2EFE2", fontWeight: 400 }}>Menu</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
            <li><a href="#/menu" style={{ color: "#F2EFE2", textDecoration: "underline" }}>{t.nav_menu}</a></li>
            <li><a href="#/reservas" style={{ color: "#F2EFE2", textDecoration: "underline" }}>{t.nav_reservas}</a></li>
            <li><a href="#/sobre" style={{ color: "#F2EFE2", textDecoration: "underline" }}>{t.nav_sobre}</a></li>
            <li><a href={settings.ubereats} target="_blank" rel="noopener" style={{ color: "#F2EFE2", textDecoration: "underline" }}>Uber Eats</a></li>
            <li style={{ marginTop: 8 }}><a href="#/admin" style={{ color: "#F2EFE2", opacity: 0.6, fontSize: 11, textDecoration: "underline" }}>{t.admin}</a></li>
          </ul>
        </div>
      </div>
      <div style={{
        borderTop: "1px solid rgba(242,239,226,0.2)",
        padding: "20px 24px", maxWidth: 1280, margin: "0 auto",
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        fontFamily: 'Inter, sans-serif', fontSize: 11, opacity: 0.7,
      }}>
        <span>© {new Date().getFullYear()} {t.footer_legal}</span>
        <span>{t.allergens_note.slice(0, 90)}…</span>
      </div>
    </footer>
  );
}

// ============================================================
// Eyebrow label (small uppercase)
// ============================================================
function Eyebrow({ children, color = "#C8463F", style = {} }) {
  return (
    <span style={{
      fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
      letterSpacing: "0.2em", textTransform: "uppercase",
      color, display: "inline-block",
      ...style,
    }}>{children}</span>
  );
}

// Export to window
Object.assign(window, {
  StripeBg, Logo, Wordmark, Button, RedTitle, GreenTitle,
  MenuItem, ToastProvider, useToast, PhotoPlaceholder,
  Header, Footer, Eyebrow,
});
