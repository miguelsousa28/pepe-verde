/* global React, ReactDOM, PV, ToastProvider, Header, Footer,
   HomePage, MenuPage, ReservasPage, SobrePage, ContactosPage, AdminApp,
   ReservationProvider */
// Pepe Verde — root app + hash router + Tweaks panel.
const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "split",
  "heroPhoto": "hero_pepeverde_neon.png",
  "heroHeadlinePT": "Pizza italiana no coração da Ericeira.",
  "heroHeadlineEN": "Italian pizza in the heart of Ericeira.",
  "brandRed": "#C8463F",
  "brandGreen": "#1F5A3F",
  "menuStickers": "polaroid",
  "showStripes": true,
  "showPhotos": true,
  "showFeatured": true,
  "showLocation": true,
  "showAbout": true,
  "defaultLang": "pt"
}/*EDITMODE-END*/;

function App() {
  const [route, setRoute] = useState(window.location.hash.replace(/^#\/?/, "") || "");
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem(PV.KEYS.lang) || TWEAK_DEFAULTS.defaultLang; }
    catch (e) { return TWEAK_DEFAULTS.defaultLang; }
  });

  // Data state (persisted)
  const [categories, setCategoriesState] = useState(() => PV.load(PV.KEYS.cats, PV.SEED_CATEGORIES));
  const [items, setItemsState] = useState(() => PV.load(PV.KEYS.items, PV.SEED_ITEMS));
  const [settings, setSettingsState] = useState(() => PV.load(PV.KEYS.settings, PV.SEED_SETTINGS));
  const [reservations, setReservationsState] = useState(() => PV.load(PV.KEYS.reservations, PV.SEED_RESERVATIONS));

  const setCategories = (v) => { setCategoriesState(v); PV.save(PV.KEYS.cats, v); };
  const setItems = (v) => { setItemsState(v); PV.save(PV.KEYS.items, v); };
  const setSettings = (v) => { setSettingsState(v); PV.save(PV.KEYS.settings, v); };
  const setReservations = (v) => { setReservationsState(v); PV.save(PV.KEYS.reservations, v); };

  // Tweaks
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const setTweak = (key, value) => {
    const next = typeof key === "string" ? { ...tweaks, [key]: value } : { ...tweaks, ...key };
    setTweaks(next);
    try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits: typeof key === "string" ? { [key]: value } : key }, "*"); } catch (e) {}
  };

  // Tweaks panel visibility
  const [showTweaks, setShowTweaks] = useState(false);
  useEffect(() => {
    function handler(ev) {
      if (ev.data?.type === "__activate_edit_mode") setShowTweaks(true);
      if (ev.data?.type === "__deactivate_edit_mode") setShowTweaks(false);
    }
    window.addEventListener("message", handler);
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}
    return () => window.removeEventListener("message", handler);
  }, []);

  // Hash routing
  useEffect(() => {
    const handler = () => {
      setRoute(window.location.hash.replace(/^#\/?/, ""));
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  // Persist lang
  useEffect(() => { try { localStorage.setItem(PV.KEYS.lang, lang); } catch (e) {} }, [lang]);

  // Document title per route
  useEffect(() => {
    const t = PV.T[lang];
    const titles = {
      "": "Pepe Verde | Pizzaria Italiana na Ericeira",
      "menu": `${t.menu_title} — Pepe Verde`,
      "reservas": `${t.reservas_title} — Pepe Verde`,
      "sobre": `${t.sobre_title} — Pepe Verde`,
      "contactos": `${t.contactos_title} — Pepe Verde`,
      "admin": "Admin — Pepe Verde",
    };
    document.title = titles[route] || titles[""];
  }, [route, lang]);

  // Active items by category order
  const activeItems = useMemo(() => items.filter((i) => i.active), [items]);
  const orderedCats = useMemo(() => [...categories].sort((a, b) => a.order - b.order), [categories]);

  // ----- Admin route is a separate shell -----
  if (route === "admin") {
    return (
      <ToastProvider>
        <AdminApp
          lang={lang}
          settings={settings} setSettings={setSettings}
          items={items} setItems={setItems}
          categories={categories} setCategories={setCategories}
          reservations={reservations} setReservations={setReservations}
        />
      </ToastProvider>
    );
  }

  // ----- Public site shell -----
  const routeKey = route || "home";
  return (
    <ToastProvider>
      <ReservationProvider lang={lang} settings={settings} reservations={reservations} setReservations={setReservations}>
      <div style={{ background: "#F7F4E8", color: "#1F5A3F", minHeight: "100vh" }}>
        <Header route={routeKey} lang={lang} setLang={setLang} settings={settings} />
        {routeKey === "home" && <HomePage lang={lang} settings={settings} items={activeItems} tweaks={tweaks} />}
        {routeKey === "menu" && <MenuPage lang={lang} items={activeItems} categories={orderedCats} stickers={tweaks.menuStickers} />}
        {routeKey === "reservas" && <ReservasPage lang={lang} settings={settings} reservations={reservations} setReservations={setReservations} />}
        {routeKey === "sobre" && <SobrePage lang={lang} showPhotos={tweaks.showPhotos} />}
        {routeKey === "contactos" && <ContactosPage lang={lang} settings={settings} />}
        {routeKey === "privacidade" && <PrivacyPage lang={lang} />}
        {!["home", "menu", "reservas", "sobre", "contactos", "privacidade"].includes(routeKey) && (
          <main style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: 24 }}>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontFamily: 'Bowlby One, sans-serif', color: "#C8463F", fontSize: 48 }}>404</h2>
              <a href="#/" style={{ fontFamily: 'Inter, sans-serif', color: "#1F5A3F" }}>← Voltar ao início</a>
            </div>
          </main>
        )}
        <Footer lang={lang} settings={settings} />
      </div>
      {showTweaks && <TweaksPanel tweaks={tweaks} setTweak={setTweak} onClose={() => setShowTweaks(false)} />}
      </ReservationProvider>
    </ToastProvider>
  );
}

function PrivacyPage({ lang }) {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px" }}>
      <h1 style={{ fontFamily: 'Bowlby One, sans-serif', color: "#C8463F", fontSize: 40, letterSpacing: "0.02em", textTransform: "uppercase", fontWeight: 400 }}>
        {lang === "pt" ? "Política de Privacidade" : "Privacy Policy"}
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: "#1F5A3F", lineHeight: 1.65, marginTop: 18 }}>
        {lang === "pt"
          ? "Recolhemos apenas os dados necessários para gerir a tua reserva (nome, telefone, email, data, hora, número de pessoas e notas). Não partilhamos com terceiros e podes pedir a remoção a qualquer momento pelo email indicado nos contactos."
          : "We only collect the data needed to manage your booking (name, phone, email, date, time, party size and notes). We don't share with third parties; you may request deletion at any time via our contact email."}
      </p>
    </main>
  );
}

// ============================================================
// TWEAKS PANEL
// ============================================================
const HERO_PHOTOS = [
  { id: "hero_pepeverde_neon.png", label: "PEPE VERDE Neon", hint: "Sala neon + plantas" },
  { id: "hero_neon_pepe.png", label: "Neon Pepe Verde", hint: "Interior c/ neon" },
  { id: "hero_balcao.png", label: "Balcão verde", hint: "Bar com equipa" },
  { id: "hero_sala.png", label: "Sala", hint: "Mesas + chão xadrez" },
  { id: "hero_exterior.png", label: "Esplanada", hint: "Toldos verdes" },
  { id: "pizzas_spread.png", label: "Spread Pizzas", hint: "Várias pizzas + bebidas" },
  { id: "ambiente_jantar.jpg", label: "Jantar", hint: "Esplanada à noite" },
];

function TweaksPanel({ tweaks, setTweak, onClose }) {
  const [tab, setTab] = useState("look"); // look | content | sections

  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 200,
      width: 360, maxHeight: "calc(100vh - 40px)",
      background: "#F7F4E8", border: "1px solid #1F5A3F",
      boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
      fontFamily: 'Inter, sans-serif',
      display: "flex", flexDirection: "column",
    }}>
      <header style={{
        background: "#1F5A3F", color: "#F2EFE2",
        padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'Bowlby One, sans-serif', fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase" }}>Tweaks</span>
        <button onClick={() => { onClose(); try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch (e) {} }} style={{ background: "transparent", border: "none", color: "#F2EFE2", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 0 }}>×</button>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(31,90,63,0.18)", flexShrink: 0 }}>
        {[
          ["look", "Look"],
          ["content", "Textos"],
          ["sections", "Secções"],
        ].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: "10px",
            background: tab === k ? "rgba(31,90,63,0.08)" : "transparent",
            color: "#1F5A3F",
            border: "none",
            borderBottom: "2px solid " + (tab === k ? "#C8463F" : "transparent"),
            fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
            letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
          }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: 16, display: "grid", gap: 18, overflowY: "auto" }}>
        {tab === "look" && <>
          <TweakGroup label="Hero — Estilo">
            <div style={{ display: "grid", gap: 6 }}>
              {[
                ["split", "Split", "Texto + foto lado a lado"],
                ["photo", "Foto full", "Foto fullbleed c/ card"],
                ["menu", "Menu-as-hero", "Riscas + logo central"],
              ].map(([k, l, d]) => (
                <label key={k} style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  cursor: "pointer", padding: "8px 10px",
                  border: tweaks.heroVariant === k ? "1px solid #1F5A3F" : "1px solid rgba(31,90,63,0.18)",
                  background: tweaks.heroVariant === k ? "rgba(31,90,63,0.06)" : "transparent",
                }}>
                  <input type="radio" checked={tweaks.heroVariant === k} onChange={() => setTweak("heroVariant", k)} style={{ marginTop: 3, accentColor: "#1F5A3F" }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1F5A3F" }}>{l}</div>
                    <div style={{ fontSize: 10.5, color: "#1F5A3F", opacity: 0.7, marginTop: 2 }}>{d}</div>
                  </div>
                </label>
              ))}
            </div>
          </TweakGroup>

          <TweakGroup label="Hero — Foto">
            <div style={{
              display: "grid", gap: 6,
              gridTemplateColumns: "repeat(3, 1fr)",
            }}>
              {HERO_PHOTOS.map((p) => (
                <button key={p.id} onClick={() => setTweak("heroPhoto", p.id)} title={p.label}
                  style={{
                    position: "relative", aspectRatio: "1",
                    border: tweaks.heroPhoto === p.id ? "2px solid #C8463F" : "1px solid rgba(31,90,63,0.25)",
                    padding: 0, cursor: "pointer", overflow: "hidden", background: "#F7F4E8",
                  }}>
                  <img src={"assets/photos/" + p.id} alt={p.label}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {tweaks.heroPhoto === p.id && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "rgba(200,70,63,0.18)",
                      display: "flex", alignItems: "flex-end", justifyContent: "center",
                      paddingBottom: 4,
                      fontFamily: 'Inter, sans-serif', fontSize: 9,
                      color: "#F7F4E8", fontWeight: 700,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                    }}>✓</div>
                  )}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 10, color: "#1F5A3F", opacity: 0.6, marginTop: 6, lineHeight: 1.4 }}>
              Usado no hero Split e Foto full.
            </div>
          </TweakGroup>

          <TweakGroup label="Menu — Fotos decorativas">
            <div style={{ display: "grid", gap: 6 }}>
              {[
                ["polaroid", "Polaroid", "Fotos com moldura branca, ligeira inclinação"],
                ["stickers", "Stickers", "Círculos com sombra, rotação livre"],
                ["off", "Desligado", "Sem fotos no menu"],
              ].map(([k, l, d]) => (
                <label key={k} style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  cursor: "pointer", padding: "8px 10px",
                  border: (tweaks.menuStickers || "polaroid") === k ? "1px solid #1F5A3F" : "1px solid rgba(31,90,63,0.18)",
                  background: (tweaks.menuStickers || "polaroid") === k ? "rgba(31,90,63,0.06)" : "transparent",
                }}>
                  <input type="radio" checked={(tweaks.menuStickers || "polaroid") === k}
                    onChange={() => setTweak("menuStickers", k)}
                    style={{ marginTop: 3, accentColor: "#1F5A3F" }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1F5A3F" }}>{l}</div>
                    <div style={{ fontSize: 10.5, color: "#1F5A3F", opacity: 0.7, marginTop: 2 }}>{d}</div>
                  </div>
                </label>
              ))}
            </div>
          </TweakGroup>

          <TweakGroup label="Visuais">
            <Toggle checked={tweaks.showStripes !== false}
              onChange={(v) => setTweak("showStripes", v)}
              label="Riscas verticais no fundo" />
            <Toggle checked={tweaks.showPhotos !== false}
              onChange={(v) => setTweak("showPhotos", v)}
              label="Mostrar fotografias do espaço" />
          </TweakGroup>

          <TweakGroup label="Idioma inicial">
            <div style={{ display: "flex", gap: 4 }}>
              {["pt", "en"].map((l) => (
                <button key={l} onClick={() => setTweak("defaultLang", l)} style={{
                  flex: 1, padding: "8px", border: "1px solid #1F5A3F",
                  background: tweaks.defaultLang === l ? "#1F5A3F" : "transparent",
                  color: tweaks.defaultLang === l ? "#F7F4E8" : "#1F5A3F",
                  fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600,
                  letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
                }}>{l}</button>
              ))}
            </div>
          </TweakGroup>
        </>}

        {tab === "content" && <>
          <TweakGroup label="Headline (PT)">
            <textarea
              value={tweaks.heroHeadlinePT || ""}
              onChange={(e) => setTweak("heroHeadlinePT", e.target.value)}
              rows="2"
              style={tweakInputStyle}
              placeholder="Pizza italiana no coração da Ericeira."
            />
          </TweakGroup>
          <TweakGroup label="Headline (EN)">
            <textarea
              value={tweaks.heroHeadlineEN || ""}
              onChange={(e) => setTweak("heroHeadlineEN", e.target.value)}
              rows="2"
              style={tweakInputStyle}
              placeholder="Italian pizza in the heart of Ericeira."
            />
          </TweakGroup>
          <div style={{
            padding: 12, background: "rgba(31,90,63,0.05)",
            border: "1px solid rgba(31,90,63,0.18)",
            fontSize: 11, color: "#1F5A3F", lineHeight: 1.55,
          }}>
            Restantes textos (sobre, descrições de pratos, contactos, horários) editam-se no <a href="#/admin" target="_blank" style={{ color: "#C8463F", fontWeight: 600 }}>Admin</a>.
          </div>
        </>}

        {tab === "sections" && <>
          <TweakGroup label="Mostrar na homepage">
            <Toggle checked={tweaks.showAbout !== false}
              onChange={(v) => setTweak("showAbout", v)}
              label="Secção “A Pepe Verde”" />
            <Toggle checked={tweaks.showFeatured !== false}
              onChange={(v) => setTweak("showFeatured", v)}
              label="Destaques do menu" />
            <Toggle checked={tweaks.showLocation !== false}
              onChange={(v) => setTweak("showLocation", v)}
              label="Onde estamos (mapa)" />
          </TweakGroup>

          <div style={{
            padding: 12, background: "rgba(200,70,63,0.05)",
            border: "1px solid rgba(200,70,63,0.18)",
            fontSize: 11, color: "#1F5A3F", lineHeight: 1.55,
          }}>
            <strong style={{ color: "#C8463F", letterSpacing: "0.04em" }}>Admin:</strong> reservas, menu (CRUD), horário, capacidade, links externos — <a href="#/admin" target="_blank" style={{ color: "#C8463F" }}>abrir</a> (password <code style={{ background: "rgba(0,0,0,0.05)", padding: "1px 4px", fontFamily: 'JetBrains Mono, monospace' }}>pepeverde</code>).
          </div>
        </>}
      </div>
    </div>
  );
}

const tweakInputStyle = {
  width: "100%", padding: "10px 12px",
  fontFamily: 'Inter, sans-serif', fontSize: 13,
  background: "#F7F4E8", color: "#1F5A3F",
  border: "1px solid rgba(31,90,63,0.3)",
  outline: "none", borderRadius: 0,
  resize: "vertical", boxSizing: "border-box",
};

function TweakGroup({ label, children }) {
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 700, color: "#1F5A3F",
        letterSpacing: "0.12em", textTransform: "uppercase",
        marginBottom: 10, opacity: 0.7,
      }}>{label}</div>
      <div style={{ display: "grid", gap: 8 }}>{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 10, cursor: "pointer", fontSize: 13, color: "#1F5A3F",
      padding: "6px 0",
    }}>
      <span>{label}</span>
      <span style={{
        position: "relative", width: 36, height: 20,
        background: checked ? "#1F5A3F" : "rgba(31,90,63,0.2)",
        borderRadius: 10, transition: "background 0.15s",
        flexShrink: 0,
      }}>
        <span style={{
          position: "absolute", top: 2, left: checked ? 18 : 2,
          width: 16, height: 16, background: "#F7F4E8",
          borderRadius: 8, transition: "left 0.15s",
        }} />
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
    </label>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
