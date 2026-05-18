/* global React, StripeBg, Logo, Button, RedTitle, GreenTitle, Eyebrow, useToast */
// Pepe Verde — admin (login + dashboard + reservas + menu CRUD + settings).
// Demo credentials shown on login screen. State persists to localStorage.
const { useState, useMemo, useEffect } = React;

const ADMIN_PASS = "pepeverde"; // demo

// ============================================================
// ADMIN ROOT — handles login + sub-routes
// ============================================================
function AdminApp({ lang, settings, setSettings, items, setItems, categories, setCategories, reservations, setReservations }) {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem("pv_admin") === "1"; } catch (e) { return false; }
  });
  const [tab, setTab] = useState("dashboard");

  if (!authed) return <AdminLogin onAuth={() => {
    try { sessionStorage.setItem("pv_admin", "1"); } catch (e) {}
    setAuthed(true);
  }} />;

  return (
    <div style={{ minHeight: "100vh", background: "#F2EFE2", display: "flex" }} className="pv-admin-shell">
      {/* Sidebar */}
      <aside style={{
        width: 240, background: "#1F5A3F", color: "#F2EFE2",
        padding: "24px 0", flexShrink: 0,
        display: "flex", flexDirection: "column",
      }} className="pv-admin-sidebar">
        <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(242,239,226,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="assets/logo.jpg" width="40" height="40" alt="Pepe Verde"
              style={{ borderRadius: "50%", objectFit: "cover" }} />
            <div>
              <div style={{ fontFamily: 'Bowlby One, sans-serif', fontSize: 14, letterSpacing: "0.04em" }}>PEPE VERDE</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, opacity: 0.7, letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin</div>
            </div>
          </div>
        </div>
        <nav style={{ padding: "16px 0", display: "flex", flexDirection: "column", flex: 1 }}>
          {[
            ["dashboard", "Dashboard"],
            ["reservas", "Reservas"],
            ["menu", "Menu"],
            ["settings", "Configurações"],
          ].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: tab === k ? "rgba(242,239,226,0.1)" : "transparent",
              color: "#F2EFE2",
              borderLeft: tab === k ? "3px solid #C8463F" : "3px solid transparent",
              padding: "12px 24px", fontFamily: 'Inter, sans-serif',
              fontSize: 13, fontWeight: 500, textAlign: "left",
              border: "none", cursor: "pointer",
              letterSpacing: "0.04em",
            }}>{l}</button>
          ))}
        </nav>
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(242,239,226,0.2)", display: "flex", flexDirection: "column", gap: 8 }}>
          <a href="#/" style={{ color: "#F2EFE2", fontFamily: 'Inter, sans-serif', fontSize: 12, textDecoration: "underline", opacity: 0.8 }}>← Ver site</a>
          <button onClick={() => { try { sessionStorage.removeItem("pv_admin"); } catch (e) {} setAuthed(false); }} style={{
            background: "transparent", color: "#F2EFE2", border: "1px solid #F2EFE2",
            padding: "8px 12px", fontFamily: 'Inter, sans-serif', fontSize: 11,
            letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
          }}>Sair</button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }} className="pv-admin-main">
        {tab === "dashboard" && <AdminDashboard reservations={reservations} settings={settings} setTab={setTab} />}
        {tab === "reservas" && <AdminReservas reservations={reservations} setReservations={setReservations} settings={settings} />}
        {tab === "menu" && <AdminMenu items={items} setItems={setItems} categories={categories} setCategories={setCategories} />}
        {tab === "settings" && <AdminSettings settings={settings} setSettings={setSettings} />}
      </div>
    </div>
  );
}

// ============================================================
// LOGIN
// ============================================================
function AdminLogin({ onAuth }) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASS) onAuth();
    else setErr(true);
  };
  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, background: "#F7F4E8", position: "relative", overflow: "hidden",
    }}>
      <StripeBg opacity={0.5} />
      <form onSubmit={submit} style={{
        position: "relative", background: "#F7F4E8", border: "1px solid #1F5A3F",
        padding: "40px 36px", maxWidth: 420, width: "100%",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logo size={70} flat />
          <Eyebrow style={{ marginTop: 18 }}>admin</Eyebrow>
          <RedTitle size={32} style={{ marginTop: 8 }}>Entrar</RedTitle>
        </div>
        <label style={{
          fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
          color: "#1F5A3F", letterSpacing: "0.08em", textTransform: "uppercase",
          marginBottom: 6, display: "block",
        }}>Password</label>
        <input
          type="password" autoFocus
          value={pass} onChange={(e) => { setPass(e.target.value); setErr(false); }}
          style={{
            width: "100%", padding: "12px 14px",
            fontFamily: 'Inter, sans-serif', fontSize: 14,
            background: "#F7F4E8", color: "#1F5A3F",
            border: err ? "1px solid #C8463F" : "1px solid rgba(31,90,63,0.4)",
            outline: "none", borderRadius: 0, boxSizing: "border-box",
          }}
        />
        {err && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: "#C8463F", marginTop: 6 }}>Password incorreta</p>}
        <Button type="submit" size="lg" full style={{ marginTop: 20 }}>Entrar</Button>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: "#1F5A3F", opacity: 0.6, marginTop: 16, textAlign: "center", lineHeight: 1.5 }}>
          Demo: password é <code style={{ fontFamily: 'JetBrains Mono, monospace', background: "rgba(31,90,63,0.1)", padding: "2px 6px" }}>pepeverde</code>
        </p>
        <p style={{ textAlign: "center", marginTop: 16 }}>
          <a href="#/" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: "#1F5A3F" }}>← Voltar ao site</a>
        </p>
      </form>
    </main>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function AdminDashboard({ reservations, settings, setTab }) {
  const today = new Date().toISOString().slice(0, 10);
  const todayRes = reservations.filter((r) => r.date === today && r.status !== "cancelled" && r.status !== "declined");
  const pending = reservations.filter((r) => r.status === "pending");
  const upcoming = reservations
    .filter((r) => r.date >= today && (r.status === "confirmed" || r.status === "pending"))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 8);

  // by-day for next 7 days
  const byDay = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const list = reservations.filter((r) => r.date === key && (r.status === "confirmed" || r.status === "pending"));
      days.push({
        key,
        label: d.toLocaleDateString("pt-PT", { weekday: "short", day: "2-digit", month: "short" }),
        count: list.length,
        people: list.reduce((s, r) => s + r.people, 0),
      });
    }
    return days;
  }, [reservations]);

  const maxPeople = Math.max(1, ...byDay.map((d) => d.people));

  return (
    <div>
      <AdminHeader title="Dashboard" subtitle="Visão geral das reservas" />

      <div style={{
        display: "grid", gap: 16, marginTop: 28,
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      }}>
        <StatCard label="Reservas hoje" value={todayRes.length} sub={`${todayRes.reduce((s, r) => s + r.people, 0)} pessoas`} />
        <StatCard label="Pendentes" value={pending.length} accent="#C8463F" />
        <StatCard label="Total esta semana" value={byDay.reduce((s, d) => s + d.count, 0)} sub={`${byDay.reduce((s, d) => s + d.people, 0)} pessoas`} />
        <StatCard label="Capacidade / slot" value={settings.capacityPerSlot} sub="pessoas" />
      </div>

      <section style={{ marginTop: 36 }}>
        <h3 style={{ fontFamily: 'Bowlby One, sans-serif', color: "#1F5A3F", fontSize: 18, letterSpacing: "0.04em", textTransform: "uppercase", margin: 0, marginBottom: 16, fontWeight: 400 }}>Próximos 7 dias</h3>
        <div style={{
          background: "#F7F4E8", border: "1px solid #1F5A3F", padding: 24,
          display: "flex", gap: 14, alignItems: "flex-end", overflowX: "auto",
        }}>
          {byDay.map((d) => (
            <div key={d.key} style={{ flex: 1, minWidth: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: "#1F5A3F", opacity: 0.7 }}>{d.people}p</div>
              <div style={{
                width: "100%", background: "#B7C6B0",
                height: 160, position: "relative", border: "1px solid #1F5A3F",
              }}>
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "#1F5A3F",
                  height: `${(d.people / maxPeople) * 100}%`,
                  transition: "height 0.3s",
                }} />
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: "#1F5A3F", letterSpacing: "0.04em", textTransform: "uppercase" }}>{d.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'Bowlby One, sans-serif', color: "#1F5A3F", fontSize: 18, letterSpacing: "0.04em", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>Próximas reservas</h3>
          <button onClick={() => setTab("reservas")} style={{ background: "transparent", border: "none", fontFamily: 'Inter, sans-serif', fontSize: 12, color: "#1F5A3F", textDecoration: "underline", cursor: "pointer" }}>Ver todas →</button>
        </div>
        <ReservationTable reservations={upcoming} compact />
      </section>
    </div>
  );
}

function StatCard({ label, value, sub, accent = "#1F5A3F" }) {
  return (
    <div style={{
      background: "#F7F4E8", border: "1px solid #1F5A3F", padding: "22px 24px",
    }}>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: "#1F5A3F", opacity: 0.7, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: 'Bowlby One, sans-serif', fontSize: 40, color: accent, marginTop: 8, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: "#1F5A3F", opacity: 0.7, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

// ============================================================
// RESERVAS
// ============================================================
function AdminReservas({ reservations, setReservations, settings }) {
  const toast = useToast();
  const [filter, setFilter] = useState("all");
  const [period, setPeriod] = useState("all"); // all, today, week, month
  const [editing, setEditing] = useState(null); // reservation or 'new'
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...reservations].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    if (filter !== "all") list = list.filter((r) => r.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.phone.includes(q));
    }
    const today = new Date().toISOString().slice(0, 10);
    if (period === "today") list = list.filter((r) => r.date === today);
    if (period === "week") {
      const w = new Date(); w.setDate(w.getDate() + 7);
      const wk = w.toISOString().slice(0, 10);
      list = list.filter((r) => r.date >= today && r.date <= wk);
    }
    if (period === "month") {
      const m = new Date(); m.setMonth(m.getMonth() + 1);
      const mk = m.toISOString().slice(0, 10);
      list = list.filter((r) => r.date >= today && r.date <= mk);
    }
    return list;
  }, [reservations, filter, period, search]);

  const update = (id, patch) => {
    setReservations(reservations.map((r) => r.id === id ? { ...r, ...patch } : r));
    toast("Reserva actualizada");
  };
  const remove = (id) => {
    if (!confirm("Apagar reserva?")) return;
    setReservations(reservations.filter((r) => r.id !== id));
    toast("Reserva apagada");
  };
  const exportCsv = () => {
    const rows = [
      ["ID", "Nome", "Telefone", "Email", "Data", "Hora", "Pessoas", "Zona", "Estado", "Notas"],
      ...filtered.map((r) => [r.id, r.name, r.phone, r.email, r.date, r.time, r.people, r.area, r.status, r.notes]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "reservas-" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
    URL.revokeObjectURL(url);
    toast("CSV exportado");
  };

  return (
    <div>
      <AdminHeader title="Reservas" subtitle={`${filtered.length} reservas`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportCsv}>Exportar CSV</Button>
            <Button size="sm" onClick={() => setEditing("new")}>+ Nova reserva</Button>
          </>
        }
      />

      <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap", alignItems: "center" }}>
        <input
          placeholder="Procurar nome, email, telefone..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 240, padding: "10px 14px",
            fontFamily: 'Inter, sans-serif', fontSize: 13,
            background: "#F7F4E8", color: "#1F5A3F",
            border: "1px solid rgba(31,90,63,0.4)", outline: "none", borderRadius: 0,
          }}
        />
        <Pills options={[
          ["all", "Todos"], ["today", "Hoje"], ["week", "7 dias"], ["month", "30 dias"],
        ]} value={period} onChange={setPeriod} />
        <Pills options={[
          ["all", "Todos"], ["pending", "Pendente"], ["confirmed", "Confirmada"],
          ["declined", "Recusada"], ["cancelled", "Cancelada"], ["completed", "Concluída"], ["noshow", "No-show"],
        ]} value={filter} onChange={setFilter} accent="#C8463F" />
      </div>

      <div style={{ marginTop: 20 }}>
        <ReservationTable
          reservations={filtered}
          onEdit={setEditing}
          onUpdate={update}
          onRemove={remove}
        />
      </div>

      {editing && (
        <ReservationModal
          reservation={editing === "new" ? null : editing}
          settings={settings}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing === "new") {
              setReservations([{ id: "r-" + Date.now().toString(36), createdAt: Date.now(), ...data }, ...reservations]);
              toast("Reserva criada");
            } else {
              update(editing.id, data);
            }
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function Pills({ options, value, onChange, accent = "#1F5A3F" }) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {options.map(([k, l]) => (
        <button key={k} onClick={() => onChange(k)} style={{
          background: value === k ? accent : "transparent",
          color: value === k ? "#F7F4E8" : accent,
          border: "1px solid " + accent,
          padding: "6px 12px", fontFamily: 'Inter, sans-serif',
          fontSize: 11, fontWeight: 600, letterSpacing: "0.05em",
          textTransform: "uppercase", cursor: "pointer",
        }}>{l}</button>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: { bg: "#fff5d6", color: "#8a6d00", label: "Pendente" },
    confirmed: { bg: "#dceadf", color: "#1F5A3F", label: "Confirmada" },
    declined: { bg: "#f5dad7", color: "#7a1d18", label: "Recusada" },
    cancelled: { bg: "#e8e3d6", color: "#5a5040", label: "Cancelada" },
    completed: { bg: "#cde5d8", color: "#1F5A3F", label: "Concluída" },
    noshow: { bg: "#f5dad7", color: "#7a1d18", label: "No-show" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      background: s.bg, color: s.color, padding: "3px 10px",
      fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700,
      letterSpacing: "0.08em", textTransform: "uppercase",
      border: "1px solid " + s.color, borderRadius: 0,
    }}>{s.label}</span>
  );
}

function ReservationTable({ reservations, onEdit, onUpdate, onRemove, compact = false }) {
  if (reservations.length === 0) {
    return (
      <div style={{
        background: "#F7F4E8", border: "1px solid #1F5A3F", padding: "60px 24px",
        textAlign: "center", fontFamily: 'Inter, sans-serif', color: "#1F5A3F", opacity: 0.6,
      }}>Sem reservas para mostrar</div>
    );
  }
  return (
    <div style={{ background: "#F7F4E8", border: "1px solid #1F5A3F", overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: 'Inter, sans-serif', fontSize: 13, minWidth: 720 }}>
        <thead>
          <tr style={{ background: "#1F5A3F", color: "#F2EFE2", textAlign: "left" }}>
            <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>Data / Hora</th>
            <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>Nome</th>
            <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center" }}>Pax</th>
            <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>Contacto</th>
            <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>Estado</th>
            {!compact && <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "right" }}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {reservations.map((r, i) => (
            <tr key={r.id} style={{ borderTop: "1px solid rgba(31,90,63,0.15)", color: "#1F5A3F" }}>
              <td style={{ padding: "12px 16px", verticalAlign: "top" }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600 }}>{r.date}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, opacity: 0.7 }}>{r.time}</div>
              </td>
              <td style={{ padding: "12px 16px", verticalAlign: "top" }}>
                <div style={{ fontWeight: 600 }}>{r.name}</div>
                {r.notes && <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2, maxWidth: 200 }}>“{r.notes}”</div>}
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2, textTransform: "capitalize" }}>{r.area}</div>
              </td>
              <td style={{ padding: "12px 16px", verticalAlign: "top", textAlign: "center", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{r.people}</td>
              <td style={{ padding: "12px 16px", verticalAlign: "top", fontSize: 12 }}>
                <div>{r.phone}</div>
                <div style={{ opacity: 0.7 }}>{r.email}</div>
              </td>
              <td style={{ padding: "12px 16px", verticalAlign: "top" }}>
                <StatusBadge status={r.status} />
              </td>
              {!compact && (
                <td style={{ padding: "12px 16px", verticalAlign: "top", textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {r.status === "pending" && (
                      <>
                        <ActionBtn onClick={() => onUpdate(r.id, { status: "confirmed" })}>✓ Aceitar</ActionBtn>
                        <ActionBtn variant="red" onClick={() => onUpdate(r.id, { status: "declined" })}>✕ Recusar</ActionBtn>
                      </>
                    )}
                    {r.status === "confirmed" && (
                      <>
                        <ActionBtn onClick={() => onUpdate(r.id, { status: "completed" })}>Concluir</ActionBtn>
                        <ActionBtn variant="red" onClick={() => onUpdate(r.id, { status: "noshow" })}>No-show</ActionBtn>
                      </>
                    )}
                    <ActionBtn variant="outline" onClick={() => onEdit(r)}>Editar</ActionBtn>
                    <ActionBtn variant="ghost" onClick={() => onRemove(r.id)}>Apagar</ActionBtn>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActionBtn({ children, onClick, variant = "primary" }) {
  const styles = {
    primary: { background: "#1F5A3F", color: "#F7F4E8", border: "1px solid #1F5A3F" },
    red: { background: "transparent", color: "#C8463F", border: "1px solid #C8463F" },
    outline: { background: "transparent", color: "#1F5A3F", border: "1px solid #1F5A3F" },
    ghost: { background: "transparent", color: "#1F5A3F", border: "1px solid transparent", opacity: 0.5 },
  };
  return (
    <button onClick={onClick} style={{
      ...styles[variant],
      padding: "5px 10px", fontFamily: 'Inter, sans-serif', fontSize: 11,
      fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
      cursor: "pointer", borderRadius: 0,
    }}>{children}</button>
  );
}

// ============================================================
// RESERVATION MODAL (new + edit)
// ============================================================
function ReservationModal({ reservation, onClose, onSave, settings }) {
  const [form, setForm] = useState(reservation || {
    name: "", phone: "", email: "", date: "", time: "",
    people: 2, area: "indiferente", notes: "", status: "confirmed",
  });

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(31,90,63,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#F7F4E8", border: "1px solid #1F5A3F",
        padding: "36px 32px", maxWidth: 520, width: "100%",
        maxHeight: "90vh", overflow: "auto",
      }}>
        <Eyebrow>{reservation ? "editar" : "nova"}</Eyebrow>
        <RedTitle size={28} align="left" style={{ marginTop: 6 }}>Reserva</RedTitle>
        <div style={{ display: "grid", gap: 14, marginTop: 22 }}>
          <Field label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Telefone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          </div>
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr 1fr" }}>
            <Field label="Data" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
            <Field label="Hora" type="time" value={form.time} onChange={(v) => setForm({ ...form, time: v })} />
            <Field label="Pessoas" type="number" value={form.people} onChange={(v) => setForm({ ...form, people: Number(v) })} />
          </div>
          <Field label="Notas" textarea value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
          <div>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: "#1F5A3F", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Estado</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{
              width: "100%", padding: "10px 12px",
              fontFamily: 'Inter, sans-serif', fontSize: 13,
              background: "#F7F4E8", color: "#1F5A3F",
              border: "1px solid rgba(31,90,63,0.4)", outline: "none", borderRadius: 0,
            }}>
              <option value="pending">Pendente</option>
              <option value="confirmed">Confirmada</option>
              <option value="declined">Recusada</option>
              <option value="cancelled">Cancelada</option>
              <option value="completed">Concluída</option>
              <option value="noshow">No-show</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => onSave(form)}>Guardar</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", textarea = false }) {
  return (
    <div>
      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: "#1F5A3F", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>{label}</label>
      {textarea ? (
        <textarea rows="2" value={value || ""} onChange={(e) => onChange(e.target.value)} style={{
          width: "100%", padding: "10px 12px",
          fontFamily: 'Inter, sans-serif', fontSize: 13,
          background: "#F7F4E8", color: "#1F5A3F",
          border: "1px solid rgba(31,90,63,0.4)", outline: "none", borderRadius: 0,
          resize: "vertical", boxSizing: "border-box",
        }} />
      ) : (
        <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} style={{
          width: "100%", padding: "10px 12px",
          fontFamily: 'Inter, sans-serif', fontSize: 13,
          background: "#F7F4E8", color: "#1F5A3F",
          border: "1px solid rgba(31,90,63,0.4)", outline: "none", borderRadius: 0,
          boxSizing: "border-box",
        }} />
      )}
    </div>
  );
}

// ============================================================
// MENU CRUD
// ============================================================
function AdminMenu({ items, setItems, categories, setCategories }) {
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [tabCat, setTabCat] = useState(categories[0]?.id);

  const inCat = items.filter((i) => i.category === tabCat);

  const updateItem = (id, patch) => setItems(items.map((i) => i.id === id ? { ...i, ...patch } : i));
  const removeItem = (id) => {
    if (!confirm("Apagar prato?")) return;
    setItems(items.filter((i) => i.id !== id));
    toast("Prato apagado");
  };
  const addItem = () => setEditing({
    id: "i-" + Date.now().toString(36),
    category: tabCat,
    name: "", price: "", desc_pt: "", desc_en: "",
    tags: [], featured: false, active: true, order: 0,
  });
  const saveItem = (data) => {
    if (items.find((i) => i.id === data.id)) {
      setItems(items.map((i) => i.id === data.id ? data : i));
      toast("Prato actualizado");
    } else {
      setItems([...items, data]);
      toast("Prato adicionado");
    }
    setEditing(null);
  };

  return (
    <div>
      <AdminHeader title="Menu" subtitle={`${items.length} pratos em ${categories.length} categorias`}
        actions={<Button size="sm" onClick={addItem}>+ Novo prato</Button>}
      />

      <div style={{ display: "flex", gap: 4, marginTop: 24, flexWrap: "wrap" }}>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setTabCat(c.id)} style={{
            background: tabCat === c.id ? "#1F5A3F" : "transparent",
            color: tabCat === c.id ? "#F7F4E8" : "#1F5A3F",
            border: "1px solid #1F5A3F",
            padding: "8px 14px", fontFamily: 'Inter, sans-serif',
            fontSize: 12, fontWeight: 600, letterSpacing: "0.05em",
            textTransform: "uppercase", cursor: "pointer",
          }}>{c.name_pt} <span style={{ opacity: 0.6 }}>·{items.filter((i) => i.category === c.id).length}</span></button>
        ))}
      </div>

      <div style={{ marginTop: 20, background: "#F7F4E8", border: "1px solid #1F5A3F", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: 'Inter, sans-serif', fontSize: 13, minWidth: 720 }}>
          <thead>
            <tr style={{ background: "#1F5A3F", color: "#F2EFE2", textAlign: "left" }}>
              <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>Nome</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>Descrição</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>Preço</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>Tags</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center" }}>Ativo</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center" }}>Destaque</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {inCat.map((i) => (
              <tr key={i.id} style={{ borderTop: "1px solid rgba(31,90,63,0.15)", color: "#1F5A3F" }}>
                <td style={{ padding: "10px 16px", fontFamily: 'Bowlby One, sans-serif', fontSize: 13, letterSpacing: "0.03em" }}>{i.name}</td>
                <td style={{ padding: "10px 16px", maxWidth: 320, fontSize: 12, opacity: 0.8 }}>{i.desc_pt}</td>
                <td style={{ padding: "10px 16px", fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{i.price}{i.price && !i.price.includes("/") ? " €" : ""}</td>
                <td style={{ padding: "10px 16px", fontSize: 11 }}>{i.tags?.join(", ")}</td>
                <td style={{ padding: "10px 16px", textAlign: "center" }}>
                  <input type="checkbox" checked={i.active} onChange={(e) => updateItem(i.id, { active: e.target.checked })} style={{ accentColor: "#1F5A3F" }} />
                </td>
                <td style={{ padding: "10px 16px", textAlign: "center" }}>
                  <input type="checkbox" checked={i.featured} onChange={(e) => updateItem(i.id, { featured: e.target.checked })} style={{ accentColor: "#C8463F" }} />
                </td>
                <td style={{ padding: "10px 16px", textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <ActionBtn variant="outline" onClick={() => setEditing(i)}>Editar</ActionBtn>
                    <ActionBtn variant="ghost" onClick={() => removeItem(i.id)}>Apagar</ActionBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <MenuItemModal
          item={editing} categories={categories}
          onClose={() => setEditing(null)}
          onSave={saveItem}
        />
      )}
    </div>
  );
}

function MenuItemModal({ item, categories, onClose, onSave }) {
  const [form, setForm] = useState(item);
  const toggleTag = (t) => setForm({ ...form, tags: form.tags.includes(t) ? form.tags.filter((x) => x !== t) : [...form.tags, t] });
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(31,90,63,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#F7F4E8", border: "1px solid #1F5A3F",
        padding: "36px 32px", maxWidth: 580, width: "100%",
        maxHeight: "90vh", overflow: "auto",
      }}>
        <Eyebrow>{items_has(item) ? "editar" : "novo"}</Eyebrow>
        <RedTitle size={28} align="left" style={{ marginTop: 6 }}>Prato</RedTitle>
        <div style={{ display: "grid", gap: 14, marginTop: 22 }}>
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "2fr 1fr" }}>
            <Field label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Preço" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
          </div>
          <div>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: "#1F5A3F", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Categoria</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{
              width: "100%", padding: "10px 12px",
              fontFamily: 'Inter, sans-serif', fontSize: 13,
              background: "#F7F4E8", color: "#1F5A3F",
              border: "1px solid rgba(31,90,63,0.4)", outline: "none", borderRadius: 0,
            }}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name_pt}</option>)}
            </select>
          </div>
          <Field label="Descrição (PT)" textarea value={form.desc_pt} onChange={(v) => setForm({ ...form, desc_pt: v })} />
          <Field label="Descrição (EN)" textarea value={form.desc_en} onChange={(v) => setForm({ ...form, desc_en: v })} />
          <div>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: "#1F5A3F", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Tags</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[["v", "Vegetariano"], ["vg", "Vegano"], ["gf", "Sem glúten"]].map(([k, l]) => (
                <button key={k} type="button" onClick={() => toggleTag(k)} style={{
                  background: form.tags.includes(k) ? "#1F5A3F" : "transparent",
                  color: form.tags.includes(k) ? "#F7F4E8" : "#1F5A3F",
                  border: "1px solid #1F5A3F", padding: "6px 12px",
                  fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
                  letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer",
                }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: "#1F5A3F", display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} style={{ accentColor: "#1F5A3F" }} />
              Ativo
            </label>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: "#1F5A3F", display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ accentColor: "#C8463F" }} />
              Destaque (homepage)
            </label>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => onSave(form)}>Guardar</Button>
        </div>
      </div>
    </div>
  );
}

// helper: not great but lets us reuse modal for new+edit without separate flag
const items_has = (i) => i && i.name && i.name.length > 0;

// ============================================================
// SETTINGS
// ============================================================
function AdminSettings({ settings, setSettings }) {
  const toast = useToast();
  const [form, setForm] = useState(settings);
  const save = () => { setSettings(form); toast("Configurações guardadas"); };
  const reset = () => {
    if (!confirm("Repor tudo (menu, reservas, configurações)?")) return;
    window.PV.resetAll();
    location.reload();
  };

  const setHourSlot = (day, slotIdx, idx, val) => {
    setForm({
      ...form,
      hours: form.hours.map((h) => {
        if (h.day !== day) return h;
        return { ...h, slots: h.slots.map((s, i) => i === slotIdx ? (idx === 0 ? [val, s[1]] : [s[0], val]) : s) };
      })
    });
  };
  const toggleDay = (day) => setForm({
    ...form, hours: form.hours.map((h) => h.day === day ? { ...h, open: !h.open } : h)
  });

  return (
    <div>
      <AdminHeader title="Configurações" subtitle="Horário, capacidade, links e contactos"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={reset} style={{ borderColor: "#C8463F", color: "#C8463F" }}>↺ Repor demo</Button>
            <Button size="sm" onClick={save}>Guardar</Button>
          </>
        }
      />

      <div style={{ display: "grid", gap: 28, marginTop: 28, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        <Card title="Contactos">
          <Field label="Telefone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="WhatsApp (intl.)" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} />
          <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Email notificações" value={form.notifyEmail} onChange={(v) => setForm({ ...form, notifyEmail: v })} />
          <Field label="Instagram (sem @)" value={form.instagram} onChange={(v) => setForm({ ...form, instagram: v })} />
          <Field label="Uber Eats URL" value={form.ubereats} onChange={(v) => setForm({ ...form, ubereats: v })} />
          <Field label="Morada — linha 1" value={form.address_line1} onChange={(v) => setForm({ ...form, address_line1: v })} />
          <Field label="Morada — linha 2" value={form.address_line2} onChange={(v) => setForm({ ...form, address_line2: v })} />
        </Card>

        <Card title="Reservas">
          <Field label="Capacidade máxima por slot" type="number" value={form.capacityPerSlot} onChange={(v) => setForm({ ...form, capacityPerSlot: Number(v) })} />
          <Field label="Slot de reserva (min)" type="number" value={form.slotMinutes} onChange={(v) => setForm({ ...form, slotMinutes: Number(v) })} />
          <Field label="Duração média (min)" type="number" value={form.reservationDuration} onChange={(v) => setForm({ ...form, reservationDuration: Number(v) })} />
          <Field label="Antecedência mínima (horas)" type="number" value={form.minAdvanceHours} onChange={(v) => setForm({ ...form, minAdvanceHours: Number(v) })} />
          <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: "#1F5A3F", display: "flex", gap: 8, alignItems: "center", cursor: "pointer", marginTop: 8 }}>
            <input type="checkbox" checked={form.autoConfirm} onChange={(e) => setForm({ ...form, autoConfirm: e.target.checked })} style={{ accentColor: "#1F5A3F" }} />
            Auto-confirmar se houver disponibilidade
          </label>
          <div style={{ marginTop: 12, padding: 12, background: "rgba(200,70,63,0.05)", border: "1px solid rgba(200,70,63,0.2)", fontFamily: 'Inter, sans-serif', fontSize: 11, color: "#1F5A3F", lineHeight: 1.5 }}>
            <strong style={{ color: "#C8463F" }}>SMTP / notificações:</strong> Configurar endpoint em Resend/SendGrid e ligar via webhook. Email destino: <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>{form.notifyEmail}</code>
          </div>
        </Card>
      </div>

      <Card title="Horário" style={{ marginTop: 28 }}>
        <div style={{ display: "grid", gap: 8 }}>
          {[1, 2, 3, 4, 5, 6, 0].map((day) => {
            const h = form.hours.find((x) => x.day === day);
            return (
              <div key={day} style={{
                display: "grid", gap: 12, alignItems: "center",
                gridTemplateColumns: "120px 80px 1fr",
                padding: "8px 0", borderBottom: "1px dashed rgba(31,90,63,0.2)",
              }}>
                <div style={{ fontFamily: 'Bowlby One, sans-serif', fontSize: 13, letterSpacing: "0.04em", color: "#1F5A3F" }}>{h.label_pt}</div>
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: "#1F5A3F", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                  <input type="checkbox" checked={h.open} onChange={() => toggleDay(day)} style={{ accentColor: "#1F5A3F" }} />
                  {h.open ? "Aberto" : "Fechado"}
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", opacity: h.open ? 1 : 0.3 }}>
                  {h.slots.map((s, si) => (
                    <div key={si} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input type="time" value={s[0]} disabled={!h.open}
                             onChange={(e) => setHourSlot(day, si, 0, e.target.value)}
                             style={{ padding: "6px 8px", background: "#F7F4E8", color: "#1F5A3F", border: "1px solid rgba(31,90,63,0.4)", fontFamily: 'JetBrains Mono, monospace', fontSize: 12, borderRadius: 0 }} />
                      <span style={{ color: "#1F5A3F", opacity: 0.5 }}>–</span>
                      <input type="time" value={s[1]} disabled={!h.open}
                             onChange={(e) => setHourSlot(day, si, 1, e.target.value)}
                             style={{ padding: "6px 8px", background: "#F7F4E8", color: "#1F5A3F", border: "1px solid rgba(31,90,63,0.4)", fontFamily: 'JetBrains Mono, monospace', fontSize: 12, borderRadius: 0 }} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// Admin Header + Card primitives
// ============================================================
function AdminHeader({ title, subtitle, actions }) {
  return (
    <header style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      flexWrap: "wrap", gap: 16, paddingBottom: 20, borderBottom: "1px solid rgba(31,90,63,0.2)",
    }}>
      <div>
        <Eyebrow>{subtitle || "admin"}</Eyebrow>
        <h2 style={{ fontFamily: 'Bowlby One, sans-serif', color: "#1F5A3F", fontSize: 36, letterSpacing: "0.02em", textTransform: "uppercase", margin: 0, marginTop: 4, fontWeight: 400 }}>{title}</h2>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div>
    </header>
  );
}

function Card({ title, children, style = {} }) {
  return (
    <div style={{
      background: "#F7F4E8", border: "1px solid #1F5A3F",
      padding: "24px 28px", ...style,
    }}>
      <h3 style={{ fontFamily: 'Bowlby One, sans-serif', color: "#1F5A3F", fontSize: 16, letterSpacing: "0.04em", textTransform: "uppercase", margin: 0, marginBottom: 16, fontWeight: 400 }}>{title}</h3>
      <div style={{ display: "grid", gap: 14 }}>{children}</div>
    </div>
  );
}

Object.assign(window, { AdminApp });
