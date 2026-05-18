/* global React, StripeBg, Logo, Button, RedTitle, GreenTitle,
   MenuItem, PhotoPlaceholder, Eyebrow, useToast */
// Pepe Verde — public-facing pages (Home, Menu, Reservas, Sobre, Contactos)
const { useState, useEffect, useMemo, useRef } = React;

// ============================================================
// HOME — hero, about, highlights, quick reserve, uber, location.
// Hero has 3 variants exposed via Tweaks: 'menu', 'split', 'photo'.
// ============================================================
function HomePage({ lang, settings, items, tweaks = {} }) {
  const t = window.PV.T[lang];
  // Featured: items with photos first, then others
  const featured = items
    .filter((i) => i.featured && i.active)
    .sort((a, b) => (b.photo ? 1 : 0) - (a.photo ? 1 : 0));
  const heroVariant = tweaks.heroVariant || "split";
  const showStripes = tweaks.showStripes !== false;
  const showPhotos = tweaks.showPhotos !== false;

  return (
    <main>
      {/* ---------- HERO ---------- */}
      <Hero variant={heroVariant} lang={lang} settings={settings} tweaks={tweaks} />

      {/* ---------- ABOUT short ---------- */}
      {tweaks.showAbout !== false && (
      <section style={{ padding: "100px 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <Eyebrow>{t.hero_eyebrow}</Eyebrow>
          <RedTitle size={48} style={{ marginTop: 14 }}>{t.about_title}</RedTitle>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 17, lineHeight: 1.65,
            color: "#1F5A3F", marginTop: 24, textWrap: "pretty",
          }}>{t.about_body}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
            <Button as="a" href="#/menu">{t.cta_see_menu}</Button>
            <Button as="a" href="#/sobre" variant="outline">{t.nav_sobre} →</Button>
          </div>
        </div>
      </section>
      )}

      {/* ---------- HIGHLIGHTS strip ---------- */}
      {tweaks.showFeatured !== false && (
      <section style={{ position: "relative", padding: "60px 0 100px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <Eyebrow>{t.highlights_sub}</Eyebrow>
            <RedTitle size={44} style={{ marginTop: 12 }}>{t.highlights_title}</RedTitle>
          </div>
          <div style={{
            display: "grid", gap: 24,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}>
            {featured.slice(0, 4).map((it) => (
              <FeaturedCard key={it.id} item={it} lang={lang} />
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ---------- DUAL: reserva + uber ---------- */}
      <section style={{
        position: "relative", padding: "0 24px 100px",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "grid", gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        }}>
          <div style={{
            position: "relative", overflow: "hidden",
            background: "#1F5A3F", color: "#F7F4E8",
            padding: "44px 36px", minHeight: 320,
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            <div>
              <Eyebrow color="#C8463F" style={{ color: "#E89A95" }}>{t.cta_reserve}</Eyebrow>
              <h3 style={{
                fontFamily: 'Bowlby One, sans-serif', fontSize: 36,
                margin: "16px 0 12px", textTransform: "uppercase",
                fontWeight: 400, lineHeight: 1.05, letterSpacing: "0.02em",
              }}>{t.quick_reserve_title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, lineHeight: 1.6, opacity: 0.85, maxWidth: 360 }}>
                {t.quick_reserve_sub}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
              <Button onClick={() => window.openReservation && window.openReservation()} variant="red">{t.cta_reserve}</Button>
              <Button as="a" href={"https://wa.me/" + settings.whatsapp} variant="outline"
                      style={{ borderColor: "#F7F4E8", color: "#F7F4E8" }}>WhatsApp</Button>
            </div>
          </div>

          <div style={{
            position: "relative", overflow: "hidden",
            background: "#F7F4E8", color: "#1F5A3F",
            padding: "44px 36px", minHeight: 320,
            border: "1px solid #1F5A3F",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            <StripeBg opacity={0.5} />
            <div style={{ position: "relative" }}>
              <Eyebrow>delivery</Eyebrow>
              <h3 style={{
                fontFamily: 'Bowlby One, sans-serif', fontSize: 36,
                margin: "16px 0 12px", textTransform: "uppercase",
                fontWeight: 400, lineHeight: 1.05, letterSpacing: "0.02em",
              }}>{t.also_uber_title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, lineHeight: 1.6, opacity: 0.85, maxWidth: 360 }}>
                {t.also_uber_sub}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap", position: "relative" }}>
              <Button as="a" href={settings.ubereats} variant="primary" rel="noopener" target="_blank">{t.cta_order_uber}</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- LOCATION ---------- */}
      {tweaks.showLocation !== false && <LocationStrip lang={lang} settings={settings} />}
    </main>
  );
}

// ----- Hero variants -----
function Hero({ variant, lang, settings, tweaks }) {
  const t = window.PV.T[lang];
  const showStripes = tweaks.showStripes !== false;
  const showPhotos = tweaks.showPhotos !== false;
  const heroPhoto = tweaks.heroPhoto || "hero_neon_pepe.png";
  const headline = lang === "pt"
    ? (tweaks.heroHeadlinePT || t.hero_title)
    : (tweaks.heroHeadlineEN || t.hero_title);
  if (variant === "split") return <HeroSplit t={t} settings={settings} showStripes={showStripes} showPhotos={showPhotos} heroPhoto={heroPhoto} headline={headline} />;
  if (variant === "photo") return <HeroPhoto t={t} settings={settings} heroPhoto={heroPhoto} headline={headline} />;
  return <HeroMenu t={t} settings={settings} showStripes={showStripes} headline={headline} />;
}

// "Menu-as-hero": centered, on full stripe background, logo prominent
function HeroMenu({ t, settings, showStripes, headline }) {
  return (
    <section style={{
      position: "relative", overflow: "hidden",
      minHeight: "min(90vh, 760px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "60px 24px",
      borderBottom: "1px solid #1F5A3F",
    }}>
      {showStripes && <StripeBg opacity={0.7} />}
      <div style={{
        position: "relative", textAlign: "center", maxWidth: 880,
        background: "rgba(247,244,232,0.85)",
        padding: "60px 40px",
        border: "1px solid #1F5A3F",
        backdropFilter: "blur(2px)",
      }}>
        <Logo size={120} flat />
        <Eyebrow style={{ marginTop: 28 }}>{t.hero_eyebrow}</Eyebrow>
        <h1 style={{
          fontFamily: 'Bowlby One, sans-serif',
          color: "#1F5A3F",
          fontSize: "clamp(36px, 6vw, 64px)",
          lineHeight: 1.02, letterSpacing: "0.01em",
          margin: "18px 0 0", textTransform: "uppercase",
          fontWeight: 400, textWrap: "balance",
        }}>{headline}</h1>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: 17, lineHeight: 1.55,
          color: "#1F5A3F", marginTop: 22, maxWidth: 600, marginInline: "auto",
          textWrap: "pretty",
        }}>{t.hero_sub}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}>
          <Button as="a" href="#/menu" size="lg">{t.cta_see_menu}</Button>
          <Button onClick={() => window.openReservation && window.openReservation()} variant="red" size="lg">{t.cta_reserve}</Button>
          <Button as="a" href={settings.ubereats} target="_blank" rel="noopener" variant="outline" size="lg">{t.cta_order_uber}</Button>
        </div>
      </div>
    </section>
  );
}

// Split variant: text left, photo (or stripes) right
function HeroSplit({ t, settings, showStripes, showPhotos, heroPhoto, headline }) {
  return (
    <section style={{
      position: "relative", overflow: "hidden",
      borderBottom: "1px solid #1F5A3F",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "grid", gap: 0,
        gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 1fr)",
        minHeight: "min(80vh, 680px)",
      }} className="pv-hero-split-grid">
        <div style={{
          padding: "70px 50px", display: "flex", flexDirection: "column", justifyContent: "center",
          background: "#F7F4E8", position: "relative", overflow: "hidden",
        }}>
          {showStripes && <StripeBg opacity={0.35} />}
          <div style={{ position: "relative" }}>
            <Logo size={80} flat />
            <Eyebrow style={{ marginTop: 24 }}>{t.hero_eyebrow}</Eyebrow>
            <h1 style={{
              fontFamily: 'Bowlby One, sans-serif',
              color: "#1F5A3F", fontSize: "clamp(36px, 5.5vw, 60px)",
              lineHeight: 1.02, letterSpacing: "0.01em",
              margin: "16px 0 0", textTransform: "uppercase",
              fontWeight: 400, textWrap: "balance",
            }}>{headline}</h1>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 17, lineHeight: 1.55,
              color: "#1F5A3F", marginTop: 18, maxWidth: 540, textWrap: "pretty",
            }}>{t.hero_sub}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 32, flexWrap: "wrap" }}>
              <Button as="a" href="#/menu" size="lg">{t.cta_see_menu}</Button>
              <Button onClick={() => window.openReservation && window.openReservation()} variant="red" size="lg">{t.cta_reserve}</Button>
              <Button as="a" href={settings.ubereats} target="_blank" rel="noopener" variant="ghost" size="lg">{t.cta_order_uber} →</Button>
            </div>
          </div>
        </div>
        <div style={{ position: "relative", overflow: "hidden", borderLeft: "1px solid #1F5A3F", minHeight: 400 }}>
          {showPhotos ? (
            <>
              <img src={"assets/photos/" + heroPhoto} alt="Pepe Verde interior"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, rgba(31,90,63,0) 40%, rgba(31,90,63,0.55) 100%)",
              }} />
              <div style={{
                position: "absolute", left: 24, right: 24, bottom: 24,
                color: "#F7F4E8",
                display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                gap: 16, flexWrap: "wrap",
              }}>
                <div>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600,
                    letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.8,
                  }}>— Ericeira</span>
                  <div style={{
                    fontFamily: 'Bowlby One, sans-serif',
                    fontSize: 24, letterSpacing: "0.02em", marginTop: 6,
                    textTransform: "uppercase",
                  }}>{t.come_hungry}</div>
                </div>
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 11,
                  letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7,
                  textAlign: "right",
                }}>R. Mendes Leal 22</div>
              </div>
            </>
          ) : (
            <>
              {showStripes && <StripeBg opacity={1} />}
              <div style={{
                position: "absolute", inset: 32,
                border: "1px solid #1F5A3F",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "rgba(247,244,232,0.5)",
                gap: 20, padding: 32,
              }}>
                <span style={{
                  fontFamily: 'Bowlby One, sans-serif',
                  color: "#C8463F", fontSize: "clamp(32px, 4vw, 48px)",
                  letterSpacing: "0.02em", textAlign: "center", lineHeight: 1.05,
                }}>{t.come_hungry}</span>
                <span style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 13,
                  color: "#1F5A3F", letterSpacing: "0.2em", textTransform: "uppercase",
                }}>— Ericeira —</span>
                <span style={{
                  fontFamily: 'Bowlby One, sans-serif',
                  color: "#1F5A3F", fontSize: "clamp(24px, 3vw, 36px)",
                  letterSpacing: "0.02em", textAlign: "center", lineHeight: 1.05,
                }}>{t.made_fresh}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// Photo variant: real interior shot full-bleed
function HeroPhoto({ t, settings, heroPhoto, headline }) {
  return (
    <section style={{
      position: "relative", overflow: "hidden",
      borderBottom: "1px solid #1F5A3F",
      minHeight: "min(85vh, 720px)",
    }}>
      <img src={"assets/photos/" + heroPhoto} alt="Pepe Verde Ericeira"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(31,90,63,0.55) 0%, rgba(31,90,63,0.25) 50%, rgba(31,90,63,0.45) 100%)",
      }} />
      <div style={{
        position: "relative", maxWidth: 1280, margin: "0 auto",
        padding: "100px 24px 80px",
        display: "flex", alignItems: "flex-end",
        minHeight: "min(85vh, 720px)",
      }}>
        <div style={{
          background: "#F7F4E8", border: "1px solid #1F5A3F",
          padding: "44px 40px", maxWidth: 620,
        }}>
          <Logo size={70} flat />
          <Eyebrow style={{ marginTop: 22 }}>{t.hero_eyebrow}</Eyebrow>
          <h1 style={{
            fontFamily: 'Bowlby One, sans-serif',
            color: "#1F5A3F", fontSize: "clamp(32px, 4.5vw, 52px)",
            lineHeight: 1.02, margin: "14px 0 0",
            textTransform: "uppercase", fontWeight: 400, textWrap: "balance",
          }}>{headline}</h1>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 16, lineHeight: 1.55,
            color: "#1F5A3F", marginTop: 16, textWrap: "pretty",
          }}>{t.hero_sub}</p>
          <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
            <Button as="a" href="#/menu">{t.cta_see_menu}</Button>
            <Button onClick={() => window.openReservation && window.openReservation()} variant="red">{t.cta_reserve}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- Featured card -----
function FeaturedCard({ item, lang }) {
  const t = window.PV.T[lang];
  const desc = lang === "en" ? item.desc_en : item.desc_pt;
  return (
    <a href="#/menu" style={{
      display: "block", textDecoration: "none", position: "relative",
      border: "1px solid #1F5A3F", overflow: "hidden",
      background: "#F7F4E8", transition: "transform 0.2s ease",
    }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
       onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
      <div style={{ position: "relative", aspectRatio: "5/4", overflow: "hidden" }}>
        {item.photo ? (
          <img src={item.photo} alt={item.name} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <>
            <StripeBg opacity={0.85} />
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontFamily: 'Bowlby One, sans-serif',
              color: "#1F5A3F", fontSize: 30, textTransform: "uppercase",
              letterSpacing: "0.04em", textAlign: "center", padding: 16,
            }}>{item.name}</div>
          </>
        )}
      </div>
      <div style={{ padding: "18px 20px 22px", borderTop: "1px solid #1F5A3F" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <div>
            <Eyebrow color="#C8463F" style={{ fontSize: 10 }}>{item.category.replace("-", " ")}</Eyebrow>
            <h4 style={{
              fontFamily: 'Bowlby One, sans-serif', color: "#1F5A3F",
              margin: "4px 0 0", fontSize: 18, letterSpacing: "0.02em",
              textTransform: "uppercase", fontWeight: 400,
            }}>{item.name}</h4>
          </div>
          {item.price && (
            <span style={{ fontFamily: 'Bowlby One, sans-serif', color: "#1F5A3F", fontSize: 16, flexShrink: 0 }}>
              {item.price}{item.price.includes("/") ? "" : " €"}
            </span>
          )}
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: 13, color: "#2C5142",
          margin: "8px 0 0", lineHeight: 1.5,
        }}>{desc}</p>
      </div>
    </a>
  );
}

// ----- Location strip -----
function LocationStrip({ lang, settings }) {
  const t = window.PV.T[lang];
  const mapsQ = encodeURIComponent(settings.address_line1 + ", " + settings.address_line2);
  return (
    <section style={{ borderTop: "1px solid #1F5A3F", borderBottom: "1px solid #1F5A3F" }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "grid", gap: 0,
        gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 1.4fr)",
        minHeight: 380,
      }} className="pv-loc-grid">
        <div style={{ padding: "50px 40px", background: "#F7F4E8" }}>
          <Eyebrow>localização</Eyebrow>
          <RedTitle size={36} align="left" style={{ marginTop: 12 }}>{t.location_title}</RedTitle>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 16, lineHeight: 1.6,
            color: "#1F5A3F", marginTop: 16,
          }}>
            {settings.address_line1}<br/>
            {settings.address_line2}
          </p>
          <div style={{
            display: "flex", flexDirection: "column", gap: 8, marginTop: 22,
            fontFamily: 'Inter, sans-serif', fontSize: 14, color: "#1F5A3F",
          }}>
            <a href={"tel:+351" + settings.phone.replace(/\s/g, "")} style={{ color: "#1F5A3F", textDecoration: "underline" }}>{settings.phone}</a>
            <a href={"https://wa.me/" + settings.whatsapp} target="_blank" rel="noopener" style={{ color: "#1F5A3F", textDecoration: "underline" }}>WhatsApp</a>
            <a href={"https://instagram.com/" + settings.instagram} target="_blank" rel="noopener" style={{ color: "#1F5A3F", textDecoration: "underline" }}>@{settings.instagram}</a>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
            <Button as="a" href={"https://maps.google.com/?q=" + mapsQ} target="_blank" rel="noopener" variant="outline">Google Maps</Button>
            <Button as="a" href="#/contactos">{t.nav_contactos}</Button>
          </div>
        </div>
        <iframe
          title="map"
          loading="lazy"
          src={"https://maps.google.com/maps?q=" + mapsQ + "&t=&z=15&ie=UTF8&iwloc=&output=embed"}
          style={{ border: 0, width: "100%", height: "100%", minHeight: 380, filter: "saturate(0.7) contrast(0.95)" }}
        ></iframe>
      </div>
    </section>
  );
}

// ============================================================
// MENU PAGE — full menu with filters, sticky category nav
// ============================================================
function MenuPage({ lang, items, categories, stickers = "polaroid" }) {
  const t = window.PV.T[lang];
  const [filter, setFilter] = useState("all"); // all, v, vg, gf
  const [activeCat, setActiveCat] = useState(categories[0]?.id);
  const sectionRefs = useRef({});

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => i.tags?.includes(filter) || i.category === "extras");
  }, [items, filter]);

  const grouped = useMemo(() => {
    const g = {};
    categories.forEach((c) => { g[c.id] = filtered.filter((i) => i.category === c.id && i.active); });
    return g;
  }, [filtered, categories]);

  const scrollToCat = (id) => {
    setActiveCat(id);
    const el = sectionRefs.current[id];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // observe sections
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActiveCat(e.target.dataset.cat);
      });
    }, { rootMargin: "-150px 0px -60% 0px" });
    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [categories.length]);

  return (
    <main style={{ position: "relative" }}>
      {/* Top header */}
      <div style={{ position: "relative", borderBottom: "1px solid #1F5A3F", overflow: "hidden" }}>
        <StripeBg opacity={0.6} />
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "60px 24px 30px", textAlign: "center" }}>
          <Eyebrow>{t.hero_eyebrow}</Eyebrow>
          <RedTitle size={56} style={{ marginTop: 12 }}>{t.menu_title}</RedTitle>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: "#1F5A3F", marginTop: 16, opacity: 0.7 }}>{t.menu_sub}</p>
        </div>
      </div>

      {/* Sticky nav: tabs + filters */}
      <div style={{
        position: "sticky", top: 73, zIndex: 30,
        background: "#F7F4E8", borderBottom: "1px solid #1F5A3F",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 24px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 4, overflowX: "auto", maxWidth: "100%" }} className="pv-cat-tabs">
            {categories.map((c) => (
              <button key={c.id} onClick={() => scrollToCat(c.id)} style={{
                background: activeCat === c.id ? "#1F5A3F" : "transparent",
                color: activeCat === c.id ? "#F7F4E8" : "#1F5A3F",
                border: "1px solid #1F5A3F",
                padding: "8px 14px", fontFamily: 'Inter, sans-serif',
                fontSize: 12, fontWeight: 600, letterSpacing: "0.05em",
                textTransform: "uppercase", cursor: "pointer",
                whiteSpace: "nowrap",
              }}>{lang === "en" ? c.name_en : c.name_pt}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[
              ["all", t.filter_all],
              ["v", t.filter_v],
              ["vg", t.filter_vg],
              ["gf", t.filter_gf],
            ].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)} style={{
                background: filter === k ? "#C8463F" : "transparent",
                color: filter === k ? "#F7F4E8" : "#C8463F",
                border: "1px solid #C8463F",
                padding: "6px 12px", fontFamily: 'Inter, sans-serif',
                fontSize: 11, fontWeight: 600, letterSpacing: "0.05em",
                textTransform: "uppercase", cursor: "pointer",
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ position: "relative", background: "#F7F4E8" }}>
        <StripeBg opacity={0.3} />
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "50px 24px 80px" }}>
          {categories.map((c, ci) => {
            const list = grouped[c.id] || [];
            if (list.length === 0) return null;
            // Pick a photo'd item from this category to use as a decorative sticker
            const photoItem = (items || []).find((i) => i.category === c.id && i.photo && i.active);
            // Alternate sticker side: even = right, odd = left
            const stickerSide = ci % 2 === 0 ? "right" : "left";
            return (
              <section
                key={c.id}
                ref={(el) => (sectionRefs.current[c.id] = el)}
                data-cat={c.id}
                style={{ scrollMarginTop: 140, marginBottom: 60, position: "relative" }}
              >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <RedTitle size={36}>{lang === "en" ? c.name_en : c.name_pt}</RedTitle>
                </div>
                <div style={{ position: "relative" }}>
                  <div style={{
                    display: "grid", gap: "0 60px",
                    gridTemplateColumns: list.length > 4 ? "repeat(auto-fit, minmax(320px, 1fr))" : "1fr",
                    maxWidth: 920, margin: "0 auto",
                    background: "rgba(247,244,232,0.85)",
                    border: "1px solid rgba(31,90,63,0.18)",
                    padding: "20px 32px",
                    position: "relative", zIndex: 2,
                  }}>
                    {list.map((it) => <MenuItem key={it.id} item={it} lang={lang} />)}
                  </div>
                  {stickers !== "off" && photoItem && (
                    <MenuSticker item={photoItem} variant={stickers} side={stickerSide} index={ci} />
                  )}
                </div>
              </section>
            );
          })}

          <div style={{
            maxWidth: 920, margin: "60px auto 0",
            padding: "24px 32px",
            border: "1px solid rgba(31,90,63,0.3)", background: "rgba(247,244,232,0.85)",
            fontFamily: 'Inter, sans-serif', fontSize: 12,
            color: "#1F5A3F", lineHeight: 1.6,
          }}>
            <strong style={{ fontFamily: 'Bowlby One, sans-serif', fontSize: 13, letterSpacing: "0.04em" }}>(v) (vg) (gf)</strong>
            <p style={{ margin: "8px 0 0" }}>{t.allergens_note}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

// ----- Menu sticker (decorative floating photo, lives in the side gutter) -----
// The outer menu container is 1280px wide and the inner card 920px, so each
// gutter is ~180px — wide enough for a 170px sticker without touching the card.
function MenuSticker({ item, variant = "polaroid", side = "right", index = 0 }) {
  const rotations = [-7, 6, -5, 8, -9, 4, -6, 7, -4];
  const rot = rotations[index % rotations.length];
  const topOffset = 10 + (index % 3) * 30;

  const isPolaroid = variant === "polaroid";
  const width = isPolaroid ? 170 : 150;

  const sideStyle = side === "right"
    ? { right: -10, top: topOffset }
    : { left: -10, top: topOffset };

  const baseStyle = {
    position: "absolute",
    width,
    transform: `rotate(${rot}deg)`,
    transformOrigin: "center center",
    zIndex: 3, pointerEvents: "none",
    transition: "transform 0.3s ease",
    ...sideStyle,
  };

  if (!isPolaroid) {
    return (
      <div className="pv-menu-sticker" style={{
        ...baseStyle,
        aspectRatio: "1",
        borderRadius: "50%",
        overflow: "hidden",
        border: "4px solid #F7F4E8",
        boxShadow: "0 16px 32px rgba(31,90,63,0.28), 0 4px 8px rgba(31,90,63,0.18)",
      }}>
        <img src={item.photo} alt={item.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    );
  }

  return (
    <div className="pv-menu-sticker" style={{
      ...baseStyle,
      background: "#F7F4E8",
      border: "1px solid rgba(31,90,63,0.2)",
      padding: 8,
      boxShadow: "0 18px 36px rgba(31,90,63,0.22), 0 4px 8px rgba(31,90,63,0.15)",
    }}>
      <div style={{ width: "100%", aspectRatio: "1", overflow: "hidden", background: "#F2EFE2" }}>
        <img src={item.photo} alt={item.name} loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{
        fontFamily: 'Bowlby One, sans-serif',
        color: "#1F5A3F", textAlign: "center",
        fontSize: 11, letterSpacing: "0.04em",
        textTransform: "uppercase", marginTop: 6, lineHeight: 1.1,
      }}>{item.name}</div>
    </div>
  );
}

// ============================================================
// RESERVAS PAGE
// ============================================================
function ReservasPage({ lang, settings, reservations, setReservations }) {
  const t = window.PV.T[lang];
  const toast = useToast();
  const [submitted, setSubmitted] = useState(null);
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    date: "", time: "", people: 2,
    area: "indiferente", notes: "", rgpd: false,
  });
  const [errors, setErrors] = useState({});

  // Compute min selectable date (today + advance hours)
  const minDate = useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + settings.minAdvanceHours);
    return d.toISOString().slice(0, 10);
  }, [settings.minAdvanceHours]);

  // Available time slots for chosen date
  const availableSlots = useMemo(() => {
    if (!form.date) return [];
    const d = new Date(form.date + "T00:00:00");
    const day = d.getDay();
    const hours = settings.hours.find((h) => h.day === day);
    if (!hours || !hours.open) return [];
    if (settings.blockedDates.includes(form.date)) return [];
    const slots = [];
    hours.slots.forEach(([from, to]) => {
      const [fh, fm] = from.split(":").map(Number);
      const [th, tm] = to.split(":").map(Number);
      let cur = fh * 60 + fm;
      const end = th * 60 + tm - 60; // last reservation 1h before close
      while (cur <= end) {
        const hh = String(Math.floor(cur / 60)).padStart(2, "0");
        const mm = String(cur % 60).padStart(2, "0");
        // check capacity
        const taken = reservations
          .filter((r) => r.date === form.date && r.time === `${hh}:${mm}` &&
                         (r.status === "confirmed" || r.status === "pending"))
          .reduce((s, r) => s + r.people, 0);
        const remaining = settings.capacityPerSlot - taken;
        slots.push({ time: `${hh}:${mm}`, remaining });
        cur += settings.slotMinutes;
      }
    });
    return slots;
  }, [form.date, reservations, settings]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.phone.trim()) e.phone = true;
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = true;
    if (!form.date) e.date = true;
    if (!form.time) e.time = true;
    if (form.people < 1) e.people = true;
    if (!form.rgpd) e.rgpd = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) { toast(lang === "pt" ? "Verifica os campos em vermelho" : "Check fields in red", "err"); return; }
    const slot = availableSlots.find((s) => s.time === form.time);
    const fits = slot && slot.remaining >= Number(form.people);
    const status = settings.autoConfirm && fits ? "confirmed" : "pending";
    const r = {
      id: "r-" + Date.now().toString(36),
      ...form, people: Number(form.people),
      status, createdAt: Date.now(),
    };
    setReservations([r, ...reservations]);
    setSubmitted({ ...r });
    toast(status === "confirmed"
      ? (lang === "pt" ? "Reserva confirmada!" : "Reservation confirmed!")
      : (lang === "pt" ? "Reserva enviada — pendente" : "Reservation sent — pending"));
  };

  if (submitted) {
    return (
      <main style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px", position: "relative" }}>
        <StripeBg opacity={0.4} />
        <div style={{
          position: "relative", maxWidth: 580, background: "#F7F4E8",
          border: "1px solid #1F5A3F", padding: "50px 40px", textAlign: "center",
        }}>
          <Eyebrow>{submitted.status === "confirmed" ? (lang === "pt" ? "confirmada" : "confirmed") : (lang === "pt" ? "pendente" : "pending")}</Eyebrow>
          <RedTitle size={44} style={{ marginTop: 14 }}>{lang === "pt" ? "Obrigado!" : "Thank you!"}</RedTitle>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: "#1F5A3F", marginTop: 18, lineHeight: 1.6 }}>
            {lang === "pt"
              ? `A tua reserva para ${submitted.people} pessoa${submitted.people > 1 ? "s" : ""} a ${submitted.date} às ${submitted.time} ${submitted.status === "confirmed" ? "está confirmada" : "está a aguardar confirmação"}.`
              : `Your booking for ${submitted.people} guest${submitted.people > 1 ? "s" : ""} on ${submitted.date} at ${submitted.time} is ${submitted.status === "confirmed" ? "confirmed" : "pending"}.`}
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: "#1F5A3F", marginTop: 12, opacity: 0.7 }}>
            {lang === "pt" ? `Vamos enviar confirmação para ${submitted.email}.` : `We'll email you at ${submitted.email}.`}
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}>
            <Button as="a" href="#/" variant="outline">{lang === "pt" ? "Voltar ao início" : "Back home"}</Button>
            <Button onClick={() => { setSubmitted(null); setForm({ name: "", phone: "", email: "", date: "", time: "", people: 2, area: "indiferente", notes: "", rgpd: false }); }}>{lang === "pt" ? "Nova reserva" : "New booking"}</Button>
          </div>
        </div>
      </main>
    );
  }

  const fieldStyle = (err) => ({
    width: "100%", padding: "12px 14px",
    fontFamily: 'Inter, sans-serif', fontSize: 14,
    background: "#F7F4E8", color: "#1F5A3F",
    border: err ? "1px solid #C8463F" : "1px solid rgba(31,90,63,0.4)",
    outline: "none", borderRadius: 0,
  });
  const labelStyle = {
    fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
    color: "#1F5A3F", letterSpacing: "0.08em", textTransform: "uppercase",
    marginBottom: 6, display: "block",
  };

  return (
    <main style={{ position: "relative", minHeight: "80vh" }}>
      <div style={{ position: "relative", borderBottom: "1px solid #1F5A3F", overflow: "hidden" }}>
        <StripeBg opacity={0.5} />
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "60px 24px 30px", textAlign: "center" }}>
          <Eyebrow>{t.cta_reserve}</Eyebrow>
          <RedTitle size={56} style={{ marginTop: 12 }}>{t.reservas_title}</RedTitle>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: "#1F5A3F", marginTop: 14 }}>{t.reservas_sub}</p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "50px 24px 80px" }}>
        <form onSubmit={submit} style={{ display: "grid", gap: 18 }}>
          <div style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr 1fr" }} className="pv-form-2col">
            <div>
              <label style={labelStyle}>{t.field_name} *</label>
              <input style={fieldStyle(errors.name)} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t.field_phone} *</label>
              <input style={fieldStyle(errors.phone)} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>{t.field_email} *</label>
            <input type="email" style={fieldStyle(errors.email)} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr 1fr 1fr" }} className="pv-form-3col">
            <div>
              <label style={labelStyle}>{t.field_date} *</label>
              <input type="date" min={minDate} style={fieldStyle(errors.date)} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value, time: "" })} />
            </div>
            <div>
              <label style={labelStyle}>{t.field_time} *</label>
              <select style={fieldStyle(errors.time)} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                <option value="">—</option>
                {availableSlots.map((s) => (
                  <option key={s.time} value={s.time} disabled={s.remaining < form.people}>
                    {s.time} {s.remaining < form.people ? (lang === "pt" ? "(cheio)" : "(full)") : ""}
                  </option>
                ))}
              </select>
              {form.date && availableSlots.length === 0 && (
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: "#C8463F", marginTop: 4 }}>
                  {lang === "pt" ? "Fechado neste dia" : "Closed on this date"}
                </p>
              )}
            </div>
            <div>
              <label style={labelStyle}>{t.field_people} *</label>
              <input type="number" min="1" max="20" style={fieldStyle(errors.people)} value={form.people} onChange={(e) => setForm({ ...form, people: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>{t.field_area}</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                ["interior", t.area_inside],
                ["exterior", t.area_outside],
                ["indiferente", t.area_either],
              ].map(([k, l]) => (
                <button key={k} type="button" onClick={() => setForm({ ...form, area: k })} style={{
                  flex: 1, padding: "12px 8px",
                  background: form.area === k ? "#1F5A3F" : "transparent",
                  color: form.area === k ? "#F7F4E8" : "#1F5A3F",
                  border: "1px solid #1F5A3F",
                  fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600,
                  letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer",
                }}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>{t.field_notes}</label>
            <textarea rows="3" style={{ ...fieldStyle(false), resize: "vertical", fontFamily: 'Inter, sans-serif' }}
              value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <label style={{
            display: "flex", gap: 10, alignItems: "flex-start",
            fontFamily: 'Inter, sans-serif', fontSize: 13, color: "#1F5A3F",
            cursor: "pointer", lineHeight: 1.5,
          }}>
            <input type="checkbox" checked={form.rgpd} onChange={(e) => setForm({ ...form, rgpd: e.target.checked })}
              style={{ marginTop: 3, accentColor: "#1F5A3F" }} />
            <span>{t.rgpd} <a href="#/privacidade" style={{ color: "#C8463F" }}>{t.rgpd_link}</a></span>
          </label>
          {errors.rgpd && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: "#C8463F" }}>{lang === "pt" ? "Necessário aceitar para continuar" : "Required to continue"}</span>}
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <Button type="submit" size="lg" style={{ flex: 1, minWidth: 200 }}>{t.submit_reserve}</Button>
            <Button as="a" href={"https://wa.me/" + settings.whatsapp} target="_blank" rel="noopener" variant="outline" size="lg">
              WhatsApp
            </Button>
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: "#1F5A3F", opacity: 0.6, marginTop: 4 }}>
            {lang === "pt"
              ? `Reservas com pelo menos ${settings.minAdvanceHours}h de antecedência. Duração média ${settings.reservationDuration} min.`
              : `Bookings at least ${settings.minAdvanceHours}h in advance. Average duration ${settings.reservationDuration} min.`}
          </p>
        </form>
      </div>
    </main>
  );
}

// ============================================================
// SOBRE
// ============================================================
function SobrePage({ lang, showPhotos = true }) {
  const t = window.PV.T[lang];
  return (
    <main>
      <div style={{ position: "relative", borderBottom: "1px solid #1F5A3F", overflow: "hidden" }}>
        <StripeBg opacity={0.5} />
        <div style={{ position: "relative", maxWidth: 920, margin: "0 auto", padding: "80px 24px 50px", textAlign: "center" }}>
          <Eyebrow>{t.hero_eyebrow}</Eyebrow>
          <RedTitle size={56} style={{ marginTop: 12 }}>{t.sobre_title}</RedTitle>
        </div>
      </div>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 18, color: "#1F5A3F",
            lineHeight: 1.7, textWrap: "pretty",
          }}>{t.about_body}</p>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 16, color: "#1F5A3F",
            lineHeight: 1.7, marginTop: 24, textWrap: "pretty",
          }}>
            {lang === "pt"
              ? "Massa de longa fermentação, mussarela fresca, presunto de Parma, bresaola, burrata cremosa. Ingredientes italianos quando faz sentido — produtos locais sempre que possível. Forno quente, mesas próximas, conversa fácil."
              : "Long-fermented dough, fresh mozzarella, Parma ham, bresaola, creamy burrata. Italian ingredients when it makes sense — local produce whenever possible. A hot oven, close tables, easy conversation."}
          </p>
        </div>

        {showPhotos && (
          <div style={{
            display: "grid", gap: 16, marginTop: 50,
            gridTemplateColumns: "2fr 1fr",
          }} className="pv-sobre-grid">
            <div style={{ border: "1px solid #1F5A3F", overflow: "hidden", aspectRatio: "4/3" }}>
              <img src="assets/photos/hero_neon_pepe.png" alt="Interior"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ border: "1px solid #1F5A3F", overflow: "hidden", flex: 1, minHeight: 160 }}>
                <img src="assets/photos/hero_balcao.png" alt="Equipa"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ border: "1px solid #1F5A3F", overflow: "hidden", flex: 1, minHeight: 160 }}>
                <img src="assets/photos/hero_exterior.png" alt="Esplanada"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </div>
          </div>
        )}

        <p style={{
          fontFamily: 'Bowlby One, sans-serif',
          color: "#C8463F", textAlign: "center", fontSize: 28,
          letterSpacing: "0.04em", marginTop: 60, lineHeight: 1.1,
        }}>{t.come_hungry}</p>
        <p style={{
          fontFamily: 'Bowlby One, sans-serif',
          color: "#1F5A3F", textAlign: "center", fontSize: 22,
          letterSpacing: "0.04em", marginTop: 8, lineHeight: 1.1,
        }}>{t.made_fresh}</p>
      </div>
    </main>
  );
}

// ============================================================
// CONTACTOS
// ============================================================
function ContactosPage({ lang, settings }) {
  const t = window.PV.T[lang];
  const mapsQ = encodeURIComponent(settings.address_line1 + ", " + settings.address_line2);
  return (
    <main>
      <div style={{ position: "relative", borderBottom: "1px solid #1F5A3F", overflow: "hidden" }}>
        <StripeBg opacity={0.5} />
        <div style={{ position: "relative", maxWidth: 920, margin: "0 auto", padding: "80px 24px 50px", textAlign: "center" }}>
          <Eyebrow>{t.hero_eyebrow}</Eyebrow>
          <RedTitle size={56} style={{ marginTop: 12 }}>{t.contactos_title}</RedTitle>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{
          display: "grid", gap: 40,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}>
          <div>
            <Eyebrow>{lang === "pt" ? "morada" : "address"}</Eyebrow>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, color: "#1F5A3F", lineHeight: 1.5, marginTop: 10 }}>
              {settings.address_line1}<br/>{settings.address_line2}
            </p>
          </div>
          <div>
            <Eyebrow>{lang === "pt" ? "telefone" : "phone"}</Eyebrow>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, color: "#1F5A3F", lineHeight: 1.5, marginTop: 10 }}>
              <a href={"tel:+351" + settings.phone.replace(/\s/g, "")} style={{ color: "#1F5A3F", textDecoration: "underline" }}>{settings.phone}</a><br/>
              <a href={"https://wa.me/" + settings.whatsapp} target="_blank" rel="noopener" style={{ color: "#1F5A3F", textDecoration: "underline" }}>WhatsApp</a>
            </p>
          </div>
          <div>
            <Eyebrow>{lang === "pt" ? "social" : "social"}</Eyebrow>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, color: "#1F5A3F", lineHeight: 1.5, marginTop: 10 }}>
              <a href={"https://instagram.com/" + settings.instagram} target="_blank" rel="noopener" style={{ color: "#1F5A3F", textDecoration: "underline" }}>@{settings.instagram}</a><br/>
              <a href={settings.ubereats} target="_blank" rel="noopener" style={{ color: "#1F5A3F", textDecoration: "underline" }}>Uber Eats</a>
            </p>
          </div>
          <div>
            <Eyebrow>{t.hours_title}</Eyebrow>
            <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0", fontFamily: 'Inter, sans-serif', fontSize: 14, color: "#1F5A3F", lineHeight: 1.7 }}>
              {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                const h = settings.hours.find((x) => x.day === d);
                return (
                  <li key={d} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span>{lang === "pt" ? h.label_pt : h.label_en}</span>
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>
                      {h.open ? h.slots.map((s) => s.join("–")).join(", ") : t.closed}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 60, border: "1px solid #1F5A3F" }}>
          <iframe
            title="map"
            loading="lazy"
            src={"https://maps.google.com/maps?q=" + mapsQ + "&t=&z=15&ie=UTF8&iwloc=&output=embed"}
            style={{ border: 0, width: "100%", height: 420, display: "block", filter: "saturate(0.7) contrast(0.95)" }}
          ></iframe>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}>
          <Button onClick={() => window.openReservation && window.openReservation()} size="lg">{t.cta_reserve}</Button>
          <Button as="a" href={settings.ubereats} target="_blank" rel="noopener" variant="outline" size="lg">{t.cta_uber}</Button>
        </div>
      </div>
    </main>
  );
}

Object.assign(window, { HomePage, MenuPage, ReservasPage, SobrePage, ContactosPage });
