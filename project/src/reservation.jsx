/* global React, Button, Eyebrow, RedTitle, StripeBg, useToast, PV */
// Pepe Verde — Reservation modal (floating, modern, multi-step).
// Opened from anywhere via window.openReservation().
const { useState, useEffect, useMemo, useRef, createContext, useContext } = React;

const ReservationCtx = createContext({ open: () => {}, close: () => {} });
function useReservation() { return useContext(ReservationCtx); }

function ReservationProvider({ children, lang, settings, reservations, setReservations }) {
  const [isOpen, setIsOpen] = useState(false);
  const [seed, setSeed] = useState(null); // optional prefill {people, date}

  const open = (prefill = null) => { setSeed(prefill); setIsOpen(true); };
  const close = () => setIsOpen(false);

  // Expose to window for any non-React caller
  useEffect(() => {
    window.openReservation = open;
    return () => { try { delete window.openReservation; } catch (e) {} };
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen]);

  return (
    <ReservationCtx.Provider value={{ open, close }}>
      {children}
      {isOpen && (
        <BookingModal
          lang={lang} settings={settings}
          reservations={reservations} setReservations={setReservations}
          seed={seed} onClose={close}
        />
      )}
    </ReservationCtx.Provider>
  );
}

// ============================================================
// MODAL
// ============================================================
function BookingModal({ lang, settings, reservations, setReservations, seed, onClose }) {
  const t = window.PV.T[lang];
  const toast = useToast();
  const [step, setStep] = useState(1); // 1: when, 2: who, 3: done
  const [submitted, setSubmitted] = useState(null);

  const [form, setForm] = useState({
    people: seed?.people || 2,
    date: seed?.date || "",
    time: "",
    area: "indiferente",
    name: "", phone: "", email: "", notes: "", rgpd: false,
  });
  const [errors, setErrors] = useState({});

  // Build next 14 days for the date strip
  const dateStrip = useMemo(() => {
    const minMs = Date.now() + settings.minAdvanceHours * 3600 * 1000;
    const days = [];
    for (let i = 0; i < 21; i++) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + i);
      const dayOfWeek = d.getDay();
      const hours = settings.hours.find((h) => h.day === dayOfWeek);
      const blocked = settings.blockedDates.includes(d.toISOString().slice(0, 10));
      const isPast = d.getTime() + 24 * 3600 * 1000 < minMs && i === 0;
      const closed = !hours?.open || blocked;
      days.push({
        date: d.toISOString().slice(0, 10),
        weekday: d.toLocaleDateString(lang === "pt" ? "pt-PT" : "en-GB", { weekday: "short" }).replace(".", ""),
        dayNum: d.getDate(),
        month: d.toLocaleDateString(lang === "pt" ? "pt-PT" : "en-GB", { month: "short" }).replace(".", ""),
        closed,
        disabled: isPast,
      });
    }
    return days;
  }, [settings, lang]);

  // Time slots for chosen date
  const slots = useMemo(() => {
    if (!form.date) return [];
    const d = new Date(form.date + "T00:00:00");
    const day = d.getDay();
    const hours = settings.hours.find((h) => h.day === day);
    if (!hours || !hours.open) return [];
    if (settings.blockedDates.includes(form.date)) return [];
    const minMs = Date.now() + settings.minAdvanceHours * 3600 * 1000;
    const result = [];
    hours.slots.forEach(([from, to]) => {
      const [fh, fm] = from.split(":").map(Number);
      const [th, tm] = to.split(":").map(Number);
      let cur = fh * 60 + fm;
      const end = th * 60 + tm - 60;
      while (cur <= end) {
        const hh = String(Math.floor(cur / 60)).padStart(2, "0");
        const mm = String(cur % 60).padStart(2, "0");
        const timeStr = `${hh}:${mm}`;
        const slotDate = new Date(form.date + "T" + timeStr + ":00");
        const taken = reservations
          .filter((r) => r.date === form.date && r.time === timeStr &&
                         (r.status === "confirmed" || r.status === "pending"))
          .reduce((s, r) => s + r.people, 0);
        const remaining = settings.capacityPerSlot - taken;
        result.push({
          time: timeStr,
          remaining,
          past: slotDate.getTime() < minMs,
        });
        cur += settings.slotMinutes;
      }
    });
    return result;
  }, [form.date, reservations, settings]);

  const validateStep1 = () => form.date && form.time && form.people >= 1;
  const validateStep2 = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.phone.trim()) e.phone = true;
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = true;
    if (!form.rgpd) e.rgpd = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validateStep2()) { toast(lang === "pt" ? "Verifica os campos" : "Check the fields", "err"); return; }
    const slot = slots.find((s) => s.time === form.time);
    const fits = slot && slot.remaining >= Number(form.people);
    const status = settings.autoConfirm && fits ? "confirmed" : "pending";
    const r = {
      id: "r-" + Date.now().toString(36),
      ...form, people: Number(form.people),
      status, createdAt: Date.now(),
    };
    setReservations([r, ...reservations]);
    setSubmitted(r);
    setStep(3);
  };

  // ----------- RENDER -----------
  return (
    <div
      role="dialog" aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(31,90,63,0.55)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
        animation: "pvFade 0.18s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 580,
          maxHeight: "92vh",
          background: "#F7F4E8",
          border: "1px solid #1F5A3F",
          boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          animation: "pvScale 0.22s ease-out",
          position: "relative",
        }}
      >
        {/* Header */}
        <header style={{
          padding: "20px 28px 16px",
          borderBottom: "1px solid rgba(31,90,63,0.18)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16, flexShrink: 0,
          position: "relative",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src="assets/logo.jpg" width="42" height="42" alt=""
              style={{ borderRadius: "50%", objectFit: "cover" }} />
            <div>
              <Eyebrow style={{ fontSize: 10 }}>{t.hero_eyebrow}</Eyebrow>
              <h2 style={{
                fontFamily: 'Bowlby One, sans-serif', color: "#C8463F",
                fontSize: 22, letterSpacing: "0.02em", margin: "2px 0 0",
                textTransform: "uppercase", fontWeight: 400, lineHeight: 1,
              }}>{step === 3 ? (lang === "pt" ? "Pronto!" : "Done!") : (lang === "pt" ? "Reservar" : "Book")}</h2>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: "transparent", border: "1px solid rgba(31,90,63,0.3)",
            width: 36, height: 36, cursor: "pointer", color: "#1F5A3F",
            fontSize: 18, lineHeight: 1, padding: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </header>

        {/* Stepper */}
        {step < 3 && (
          <div style={{
            display: "flex", gap: 8, padding: "14px 28px",
            borderBottom: "1px solid rgba(31,90,63,0.08)", flexShrink: 0,
          }}>
            {[
              { n: 1, l: lang === "pt" ? "Quando" : "When" },
              { n: 2, l: lang === "pt" ? "Detalhes" : "Details" },
            ].map((s) => (
              <button key={s.n} onClick={() => { if (s.n < step) setStep(s.n); }}
                disabled={s.n > step}
                style={{
                  flex: 1, padding: "8px 12px",
                  background: step === s.n ? "#1F5A3F" : "transparent",
                  color: step === s.n ? "#F7F4E8" : (s.n < step ? "#1F5A3F" : "rgba(31,90,63,0.4)"),
                  border: "1px solid " + (step === s.n ? "#1F5A3F" : "rgba(31,90,63,0.2)"),
                  fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  cursor: s.n <= step ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 9,
                  background: step === s.n ? "#C8463F" : "transparent",
                  border: "1px solid " + (step === s.n ? "#C8463F" : "currentColor"),
                  color: step === s.n ? "#F7F4E8" : "currentColor",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
                }}>{s.n}</span>
                {s.l}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div style={{
          padding: "24px 28px", overflowY: "auto", flex: 1,
          display: "flex", flexDirection: "column", gap: 22,
        }}>
          {step === 1 && (
            <StepWhen
              lang={lang} t={t}
              form={form} setForm={setForm}
              dateStrip={dateStrip} slots={slots}
            />
          )}
          {step === 2 && (
            <StepDetails
              lang={lang} t={t}
              form={form} setForm={setForm} errors={errors}
            />
          )}
          {step === 3 && submitted && (
            <StepDone lang={lang} t={t} submitted={submitted} settings={settings} onClose={onClose} />
          )}
        </div>

        {/* Footer / actions */}
        {step < 3 && (
          <footer style={{
            padding: "16px 28px",
            borderTop: "1px solid rgba(31,90,63,0.18)",
            background: "#F7F4E8",
            display: "flex", gap: 10, alignItems: "center", flexShrink: 0,
          }}>
            <div style={{ flex: 1, fontFamily: 'Inter, sans-serif', fontSize: 12, color: "#1F5A3F", opacity: 0.7, lineHeight: 1.4 }}>
              {form.date && form.time
                ? <>
                    <strong style={{ fontFamily: 'JetBrains Mono, monospace', color: "#1F5A3F", opacity: 1 }}>{form.date} · {form.time}</strong><br/>
                    {form.people} {lang === "pt" ? (form.people === 1 ? "pessoa" : "pessoas") : (form.people === 1 ? "guest" : "guests")} · {labelArea(form.area, t)}
                  </>
                : (lang === "pt" ? "Escolhe data e hora para continuar" : "Pick date and time to continue")}
            </div>
            {step === 2 && <Button variant="outline" size="sm" onClick={() => setStep(1)}>← {lang === "pt" ? "Voltar" : "Back"}</Button>}
            {step === 1 && (
              <Button size="md" onClick={() => validateStep1() && setStep(2)}
                style={{ opacity: validateStep1() ? 1 : 0.4, pointerEvents: validateStep1() ? "auto" : "none" }}>
                {lang === "pt" ? "Continuar" : "Continue"} →
              </Button>
            )}
            {step === 2 && (
              <Button size="md" variant="red" onClick={submit}>
                {lang === "pt" ? "Confirmar" : "Confirm"}
              </Button>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}

function labelArea(a, t) {
  return ({ interior: t.area_inside, exterior: t.area_outside, indiferente: t.area_either })[a] || t.area_either;
}

// ============================================================
// STEP 1 — When (people, date strip, time slots, area)
// ============================================================
function StepWhen({ lang, t, form, setForm, dateStrip, slots }) {
  const stripRef = useRef(null);

  return (
    <>
      {/* People */}
      <section>
        <FieldLabel>{lang === "pt" ? "Pessoas" : "Guests"}</FieldLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <button key={n} onClick={() => setForm({ ...form, people: n })} style={{
              width: 44, height: 44,
              background: form.people === n ? "#1F5A3F" : "transparent",
              color: form.people === n ? "#F7F4E8" : "#1F5A3F",
              border: "1px solid #1F5A3F",
              fontFamily: 'Bowlby One, sans-serif', fontSize: 15,
              cursor: "pointer", letterSpacing: "0.02em",
            }}>{n}</button>
          ))}
          <input type="number" min="9" max="20" placeholder="9+"
            value={form.people > 8 ? form.people : ""}
            onChange={(e) => setForm({ ...form, people: Number(e.target.value) || 9 })}
            style={{
              width: 64, height: 44, textAlign: "center",
              background: form.people > 8 ? "#1F5A3F" : "transparent",
              color: form.people > 8 ? "#F7F4E8" : "#1F5A3F",
              border: "1px solid #1F5A3F",
              fontFamily: 'Bowlby One, sans-serif', fontSize: 15,
              outline: "none", borderRadius: 0,
            }} />
        </div>
      </section>

      {/* Date strip */}
      <section>
        <FieldLabel>{lang === "pt" ? "Data" : "Date"}</FieldLabel>
        <div ref={stripRef} style={{
          display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6,
          scrollbarWidth: "thin", margin: "0 -28px", padding: "0 28px 6px",
        }} className="pv-date-strip">
          {dateStrip.map((d) => {
            const sel = form.date === d.date;
            return (
              <button key={d.date}
                disabled={d.closed || d.disabled}
                onClick={() => setForm({ ...form, date: d.date, time: "" })}
                style={{
                  flex: "0 0 auto",
                  width: 64, padding: "10px 6px",
                  background: sel ? "#C8463F" : "transparent",
                  color: sel ? "#F7F4E8" : (d.closed || d.disabled ? "rgba(31,90,63,0.3)" : "#1F5A3F"),
                  border: "1px solid " + (sel ? "#C8463F" : (d.closed || d.disabled ? "rgba(31,90,63,0.15)" : "rgba(31,90,63,0.3)")),
                  cursor: (d.closed || d.disabled) ? "not-allowed" : "pointer",
                  textAlign: "center",
                  fontFamily: 'Inter, sans-serif',
                  position: "relative",
                }}>
                <div style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{d.weekday}</div>
                <div style={{ fontFamily: 'Bowlby One, sans-serif', fontSize: 22, lineHeight: 1.1, margin: "4px 0 2px" }}>{d.dayNum}</div>
                <div style={{ fontSize: 10, opacity: 0.7, textTransform: "uppercase" }}>{d.month}</div>
                {d.closed && !d.disabled && (
                  <div style={{ fontSize: 8, opacity: 0.5, marginTop: 2, letterSpacing: "0.04em", textTransform: "uppercase" }}>{t.closed}</div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Time slots */}
      {form.date && (
        <section>
          <FieldLabel>{lang === "pt" ? "Hora" : "Time"}</FieldLabel>
          {slots.length === 0 ? (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: "#1F5A3F", opacity: 0.6 }}>
              {lang === "pt" ? "Sem horários neste dia." : "No slots on this date."}
            </p>
          ) : (
            <div style={{
              display: "grid", gap: 6,
              gridTemplateColumns: "repeat(auto-fill, minmax(78px, 1fr))",
            }}>
              {slots.map((s) => {
                const sel = form.time === s.time;
                const full = s.remaining < form.people;
                const disabled = full || s.past;
                return (
                  <button key={s.time}
                    onClick={() => !disabled && setForm({ ...form, time: s.time })}
                    disabled={disabled}
                    style={{
                      padding: "10px 8px",
                      background: sel ? "#1F5A3F" : "transparent",
                      color: sel ? "#F7F4E8" : (disabled ? "rgba(31,90,63,0.3)" : "#1F5A3F"),
                      border: "1px solid " + (sel ? "#1F5A3F" : (disabled ? "rgba(31,90,63,0.12)" : "rgba(31,90,63,0.3)")),
                      cursor: disabled ? "not-allowed" : "pointer",
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 500,
                      letterSpacing: "0.02em",
                      textDecoration: disabled && !s.past ? "line-through" : "none",
                    }}>{s.time}</button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Area */}
      <section>
        <FieldLabel>{lang === "pt" ? "Preferência" : "Seating"}</FieldLabel>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            ["interior", t.area_inside],
            ["exterior", t.area_outside],
            ["indiferente", t.area_either],
          ].map(([k, l]) => (
            <button key={k} onClick={() => setForm({ ...form, area: k })} style={{
              flex: 1, padding: "12px 8px",
              background: form.area === k ? "#1F5A3F" : "transparent",
              color: form.area === k ? "#F7F4E8" : "#1F5A3F",
              border: "1px solid #1F5A3F",
              fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600,
              letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer",
            }}>{l}</button>
          ))}
        </div>
      </section>
    </>
  );
}

// ============================================================
// STEP 2 — Details
// ============================================================
function StepDetails({ lang, t, form, setForm, errors }) {
  return (
    <>
      <ModernField label={t.field_name + " *"} value={form.name} err={errors.name}
        onChange={(v) => setForm({ ...form, name: v })} autoFocus />
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }} className="pv-modal-2col">
        <ModernField label={t.field_phone + " *"} value={form.phone} err={errors.phone}
          onChange={(v) => setForm({ ...form, phone: v })} type="tel" />
        <ModernField label={t.field_email + " *"} value={form.email} err={errors.email}
          onChange={(v) => setForm({ ...form, email: v })} type="email" />
      </div>
      <ModernField label={t.field_notes} value={form.notes} textarea
        onChange={(v) => setForm({ ...form, notes: v })}
        placeholder={lang === "pt" ? "Aniversário, alergias, cadeira de bebé..." : "Birthday, allergies, baby chair..."} />
      <label style={{
        display: "flex", gap: 12, alignItems: "flex-start",
        fontFamily: 'Inter, sans-serif', fontSize: 13, color: "#1F5A3F",
        cursor: "pointer", lineHeight: 1.5,
        padding: 12, background: errors.rgpd ? "rgba(200,70,63,0.08)" : "rgba(31,90,63,0.04)",
        border: "1px solid " + (errors.rgpd ? "#C8463F" : "rgba(31,90,63,0.15)"),
      }}>
        <input type="checkbox" checked={form.rgpd}
          onChange={(e) => setForm({ ...form, rgpd: e.target.checked })}
          style={{ marginTop: 3, accentColor: "#1F5A3F", width: 16, height: 16 }} />
        <span>
          {t.rgpd}{" "}
          <a href="#/privacidade" style={{ color: "#C8463F", textDecoration: "underline" }}>{t.rgpd_link}</a>
        </span>
      </label>
    </>
  );
}

// ============================================================
// STEP 3 — Done
// ============================================================
function StepDone({ lang, t, submitted, settings, onClose }) {
  const confirmed = submitted.status === "confirmed";
  return (
    <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
      <div style={{
        width: 64, height: 64, margin: "0 auto 18px",
        borderRadius: 32, border: "2px solid " + (confirmed ? "#1F5A3F" : "#C8463F"),
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: 'Bowlby One, sans-serif', color: confirmed ? "#1F5A3F" : "#C8463F",
        fontSize: 30,
      }}>{confirmed ? "✓" : "·"}</div>
      <Eyebrow color={confirmed ? "#1F5A3F" : "#C8463F"}>
        {confirmed ? (lang === "pt" ? "Confirmada" : "Confirmed") : (lang === "pt" ? "Pendente" : "Pending")}
      </Eyebrow>
      <h3 style={{
        fontFamily: 'Bowlby One, sans-serif', color: "#C8463F",
        fontSize: 32, letterSpacing: "0.02em", margin: "10px 0 0",
        textTransform: "uppercase", fontWeight: 400, lineHeight: 1,
      }}>{lang === "pt" ? "Obrigado!" : "Thank you!"}</h3>
      <div style={{
        margin: "22px auto 0", maxWidth: 360,
        padding: "18px 22px",
        border: "1px solid rgba(31,90,63,0.25)",
        background: "rgba(31,90,63,0.04)",
        fontFamily: 'Inter, sans-serif', fontSize: 14, color: "#1F5A3F",
        textAlign: "left",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed rgba(31,90,63,0.2)" }}>
          <span style={{ opacity: 0.7, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.field_date}</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{submitted.date}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed rgba(31,90,63,0.2)" }}>
          <span style={{ opacity: 0.7, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.field_time}</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{submitted.time}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed rgba(31,90,63,0.2)" }}>
          <span style={{ opacity: 0.7, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.field_people}</span>
          <span style={{ fontFamily: 'Bowlby One, sans-serif' }}>{submitted.people}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
          <span style={{ opacity: 0.7, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.field_area}</span>
          <span style={{ textTransform: "capitalize" }}>{submitted.area}</span>
        </div>
      </div>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: 13, color: "#1F5A3F",
        marginTop: 18, opacity: 0.8, lineHeight: 1.5,
      }}>
        {confirmed
          ? (lang === "pt"
              ? `Confirmação enviada para ${submitted.email}. Vemo-nos em breve.`
              : `Confirmation sent to ${submitted.email}. See you soon.`)
          : (lang === "pt"
              ? "A tua reserva está pendente. Vamos confirmar em breve por email."
              : "Your booking is pending. We'll confirm by email shortly.")}
      </p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
        <Button variant="outline" onClick={onClose}>{lang === "pt" ? "Fechar" : "Close"}</Button>
        <Button as="a" href={"https://wa.me/" + settings.whatsapp} target="_blank" rel="noopener">WhatsApp</Button>
      </div>
    </div>
  );
}

// ============================================================
// Small primitives reused inside modal
// ============================================================
function FieldLabel({ children }) {
  return (
    <label style={{
      fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
      color: "#1F5A3F", letterSpacing: "0.1em", textTransform: "uppercase",
      marginBottom: 10, display: "block",
    }}>{children}</label>
  );
}

function ModernField({ label, value, onChange, err, type = "text", textarea = false, placeholder = "", autoFocus = false }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {textarea ? (
        <textarea rows="2" value={value || ""} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={modernInputStyle(err, true)} />
      ) : (
        <input type={type} value={value || ""} placeholder={placeholder} autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          style={modernInputStyle(err)} />
      )}
    </div>
  );
}

function modernInputStyle(err, textarea = false) {
  return {
    width: "100%",
    padding: "12px 14px",
    fontFamily: 'Inter, sans-serif', fontSize: 14,
    background: "rgba(31,90,63,0.04)",
    color: "#1F5A3F",
    border: "1px solid " + (err ? "#C8463F" : "rgba(31,90,63,0.25)"),
    outline: "none", borderRadius: 0,
    boxSizing: "border-box",
    resize: textarea ? "vertical" : "none",
  };
}

Object.assign(window, { ReservationProvider, useReservation });
