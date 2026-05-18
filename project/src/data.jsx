/* global window */
// Pepe Verde — initial menu data, translations, default settings.
// Everything that the admin can edit (menu, settings) is persisted to
// localStorage on first mutation. This file is the seed.

const SEED_CATEGORIES = [
  { id: "antipasti", order: 1, name_pt: "Antipasti", name_en: "Antipasti" },
  { id: "insalate", order: 2, name_pt: "Insalate", name_en: "Insalate" },
  { id: "verdure", order: 3, name_pt: "Verdure", name_en: "Verdure" },
  { id: "piadine", order: 4, name_pt: "Piadine", name_en: "Piadine" },
  { id: "pizza-classica", order: 5, name_pt: "Pizza Clássica", name_en: "Pizze Classiche" },
  { id: "pizza-rossa", order: 6, name_pt: "Pizza Rossa", name_en: "Pizze Rosse" },
  { id: "pizza-bianche", order: 7, name_pt: "Pizza Bianche", name_en: "Pizze Bianche" },
  { id: "pizza-gialle", order: 8, name_pt: "Pizza Gialle", name_en: "Pizze Gialle" },
  { id: "extras", order: 9, name_pt: "Extras", name_en: "Extras" },
];

// Tag set: v = vegetariano, vg = vegano, gf = sem glúten
const M = (id, cat, name, price, pt, en, tags = [], featured = false, photo = null) => ({
  id, category: cat, name, price, desc_pt: pt, desc_en: en, tags,
  featured, active: true, order: 0, photo,
});

const SEED_ITEMS = [
  // ANTIPASTI
  M("pao-alho", "antipasti", "Pão de Alho", "5,5",
    "pão de alho", "garlic bread", ["v"], false, "assets/photos/pao_alho.png"),
  M("pao-alho-formaggio", "antipasti", "Pão de Alho al Formaggio", "6,5",
    "pão de alho com queijo", "garlic bread with cheese", ["v"]),
  M("burrata", "antipasti", "Burrata", "9",
    "queijo burrata, cebola caramelizada, tomate cereja, manjericão, creme balsâmico",
    "burrata cheese, caramelised onion, cherry tomato, basil, balsamic glaze", ["v", "gf"], true),
  M("bufala", "antipasti", "Bufala", "8,5",
    "mussarela de búfala, azeitonas taggiasche, tomate seco, orégano",
    "bufalo mozzarella, olive taggiasche, sundry tomato, oregano", ["v", "gf"]),
  M("carpaccio-bresaola", "antipasti", "Carpaccio di Bresaola", "9,5",
    "bresaola, salada de rúcula, tomate cereja, parmesão, raspas de limão, vinagrete de limão",
    "bresaola, rocket salad, cherry tomatoes, parmesan, lemon zest, lemon vinaigrette", ["gf"]),
  M("taglieri-salumi", "antipasti", "Taglieri di Salumi", "10",
    "tábua de carnes curadas", "cured meat board", ["gf"]),
  M("tagliere-formaggi", "antipasti", "Tagliere di Formaggi", "10",
    "tábua de queijos", "cheese board", ["v", "gf"]),
  M("tagliere-misto", "antipasti", "Tagliere Misto", "19",
    "tábua de carnes curadas e queijos", "cured meat and cheese board", ["gf"]),

  // INSALATE
  M("rucula", "insalate", "Rúcula", "8",
    "salada de rúcula, tomate cereja, nozes, parmesão, creme balsâmico",
    "rocket salad, cherry tomato, walnuts, parmesan, balsamic glaze", ["v", "gf"]),
  M("salmone", "insalate", "Salmone", "9",
    "alface de cordeiro, salmão defumado, cebola caramelizada, tomates seco",
    "lamb's lettuce, smoked salmon, caramelised onion, sundry tomatoes", ["gf"]),
  M("carciofi", "insalate", "Carciofi", "9,5",
    "alface de cordeiro e rúcula, alcachofras, cubos de presunto Parma, tomate cereja, azeitonas taggiasche",
    "mix salad, artichokes, Parma ham cubes, cherry tomato, olive taggiasche", ["gf"]),
  M("rubino", "insalate", "Rubino", "9",
    "rúcula, beterraba, nozes, cebola caramelizada, queijo de cabra, hortelã",
    "rocket, beetroot, walnut, caramelised onion, goat cheese, mint", ["gf"]),

  // VERDURE
  M("viareggio", "verdure", "Viareggio", "8",
    "mix de legumes grelhados", "mix grilled vegetables", ["v", "gf"]),
  M("siena", "verdure", "Siena", "10",
    "mix de legumes grelhados, mussarela, bacon, gorgonzola",
    "mix grilled vegetables, mozzarella, bacon, gorgonzola", ["gf"]),
  M("pisa", "verdure", "Pisa", "11",
    "mix de legumes grelhados, mussarela, salsicha, brie",
    "mix grilled vegetables, mozzarella, sausage, brie", ["gf"]),

  // PIADINE (small/large prices)
  M("rimini", "piadine", "Rimini", "9 / 16",
    "presunto Parma, mussarela de búfala, alface de cordeiro, tomate cereja",
    "Parma ham, bufalo mozzarella, lamb's lettuce, tomate cherry", ["gf"]),
  M("riccione", "piadine", "Riccione", "8 / 15",
    "mussarela de búfala, tomate cereja, molho pesto, azeitonas taggiasche",
    "bufalo mozzarella, cherry tomato, pesto sauce, olive taggiasche", ["v", "gf"]),
  M("ravenna", "piadine", "Ravenna", "9 / 16",
    "bresaola, rúcula, parmesão", "bresaola, rocket, parmesan", ["gf"]),
  M("cervia", "piadine", "Cervia", "8 / 15",
    "mortadella, burrata, pistachio", "mortadella, burrata, pistachio", ["gf"]),

  // PIZZA CLASSICA
  M("margherita", "pizza-classica", "Margherita", "9",
    "molho de tomate, mussarela, manjericão",
    "tomato sauce, mozzarella, basil", ["v"], true),
  M("margherita-bufala", "pizza-classica", "Margherita e Bufala", "11",
    "molho de tomate, mussarela de búfala, manjericão",
    "tomato sauce, bufalo mozzarella, basil", ["v"], true, "assets/photos/pizza_margherita_bufala.png"),
  M("boscaiola", "pizza-classica", "Boscaiola", "11",
    "molho de tomate, mussarela, cogumelos, salsichas caseiras",
    "tomato sauce, mozzarella, mushrooms, homemade sausages"),
  M("capricciosa", "pizza-classica", "Capricciosa", "13",
    "molho de tomate, mussarela, cogumelos, fiambre, azeitonas, alcachofras grelhadas",
    "tomato sauce, mozzarella, mushrooms, ham, olives, grilled artichokes", [], false, "assets/photos/pizza_capricciosa.png"),
  M("napoli", "pizza-classica", "Napoli", "9,5",
    "molho de tomate, anchovas, alcaparras, salsa",
    "tomato sauce, anchovies, capers, parsley", [], false, "assets/photos/pizza_napoli.png"),
  M("diavola", "pizza-classica", "Diavola", "11",
    "molho de tomate, mussarela, salame pepperoni",
    "tomato sauce, mozzarella, salame pepperoni"),
  M("tonno", "pizza-classica", "Tonno", "11,5",
    "molho de tomate, mussarela, atum, cebolas, azeitonas, salsa",
    "tomato sauce, mozzarella, tuna, onion, olives, parsley"),
  M("4-formaggi", "pizza-classica", "4 Formaggi", "13",
    "(4 queijos) mussarela, brie, gorgonzola, parmesão",
    "(4 cheese) mozzarella, brie, gorgonzola, parmesan", ["v"]),

  // PIZZA ROSSA
  M("palermo", "pizza-rossa", "Palermo", "12,5",
    "molho de tomate, berinjela, queijo burrata, alecrim, flocos de pimenta",
    "tomato sauce, eggplant, burrata cheese, rosemary, chilli flakes", ["v"]),
  M("amalfi", "pizza-rossa", "Amalfi", "12",
    "molho de tomate, tomate cereja, burrata, manjericão",
    "tomato sauce, tomato cherry, burrata, basil", ["v"]),
  M("genova", "pizza-rossa", "Genova", "11,5",
    "molho de tomate, mussarela, molho pesto, berinjela, parmesão",
    "tomato sauce, mozzarella, pesto, eggplant, parmesan", ["v"]),
  M("ferrara", "pizza-rossa", "Ferrara", "14",
    "molho de tomate, mussarela de búfala, presunto de Parma, azeitonas taggiasche, orégano",
    "tomato sauce, bufalo mozzarella, Parma ham, olive taggiasche, oregano", [], true),
  M("lampedusa", "pizza-rossa", "Lampedusa", "11",
    "molho de tomate, mussarela, fiambre, ananás",
    "tomato sauce, mozzarella, ham, ananas"),
  M("imola", "pizza-rossa", "Imola", "11",
    "molho de tomate, mussarela, fiambre, cogumelos",
    "tomato sauce, mozzarella, ham, mushroom"),
  M("calzone", "pizza-rossa", "Calzone", "13,5",
    "molho de tomate, mussarela, fiambre, brie",
    "tomato sauce, mozzarella, ham, brie"),
  M("verona", "pizza-rossa", "Verona", "14",
    "molho de tomate, guanciale (bacon), mussarela de búfala, cebola",
    "tomato sauce, guanciale (bacon), bufalo mozzarella, onion"),
  M("vegana", "pizza-rossa", "Vegana", "10,5",
    "legumes sazonais grelhados mistos (queijo vegano 2 €)",
    "mix grilled seasonal vegetables (vegan cheese 2 €)", ["vg"], true, "assets/photos/pizza_vegana.png"),

  // PIZZA BIANCHE
  M("capri", "pizza-bianche", "Capri", "12",
    "mussarela, anchovas, rúcula, burrata, raspas de limão",
    "mozzarella, anchovies, rocket, burrata, lemon zest"),
  M("sassari", "pizza-bianche", "Sassari", "12",
    "mussarela, molho pesto, queijo gorgonzola, nozes, creme de tomate seco",
    "mozzarella, pesto, gorgonzola cheese, walnuts, sundry tomato cream", ["v"], false, "assets/photos/pizza_sassari.png"),
  M("chianti", "pizza-bianche", "Chianti", "13,5",
    "mussarela, bresaola, pasta de trufas, queijo cremoso",
    "mozzarella, bresaola, truffle paste, creamy cheese"),
  M("bologna", "pizza-bianche", "Bologna", "13",
    "mussarela, mortadela, burrata, pistachio",
    "mozzarella, mortadella, burrata, pistachio"),
  M("modena", "pizza-bianche", "Modena", "11,5",
    "mussarela, salsichas caseiras, abobrinhas, parmesão",
    "mozzarella, homemade sausages, courgettes, parmesan"),
  M("venezia", "pizza-bianche", "Venezia", "14",
    "abobrinha, rúcula, salmão defumado, creme de tomate seco, burrata, raspas de limão",
    "courgette, rocket, smoked salmon, sundry tomato cream, burrata, lemon zest", [], true),
  M("fano", "pizza-bianche", "Fano", "12,5",
    "mussarela, cebola caramelizada, presunto de Parma, queijo cremoso",
    "mozzarella, caramelised onion, parma ham, creamy cheese"),
  M("parma", "pizza-bianche", "Parma", "12",
    "mussarela, presunto Parma, rúcula, tomate cereja, parmesão",
    "mozzarella, parma ham, rocket, cherry tomato, parmesan", [], true, "assets/photos/pizza_parma.png"),
  M("carbonara", "pizza-bianche", "Carbonara", "12,5",
    "mussarela, guanciale (bacon), ovos, queijo pecorino, pimenta preta",
    "mozzarella, guanciale (bacon), eggs, pecorino cheese, black pepper"),

  // PIZZA GIALLE
  M("tavullia", "pizza-gialle", "Tavullia", "11,5",
    "creme de abóbora, mussarela, salame peperoni, cebola caramelizada, queijo defumado",
    "pumpkin cream, mozzarella, salame pepperoni, caramelised onion, smoked cheese"),
  M("lecce", "pizza-gialle", "Lecce", "12",
    "creme de abóbora, berinjela, cogumelo, pasta de trufas (queijo vegano 2 €)",
    "pumpkin cream, eggplant, mushroom, truffle paste (vegan cheese 2 €)", ["vg"], true, "assets/photos/pizza_lecce.png"),
  M("portofino", "pizza-gialle", "Portofino", "12,5",
    "creme de abóbora, pasta de trufas, alecrim, parmesão",
    "pumpkin cream, truffle paste, rosemary, parmesan", ["v"]),

  // EXTRAS — single line item
  M("extras-list", "extras", "Extras", "",
    "vegetais 1€, mix de vegetais 3€, carne curada 2€, burrata 3,5€, mussarela de búfala 2,5€, outros queijos 2,5€, mussarela 1,5€, creme de trufas 3,5€, salsicha 2€, azeitonas taggiasche 2€, salmão 3€, base GF 3€",
    "veggie 1€, mix veggies 3€, cured meat 2€, burrata 3.5€, bufalo mozzarella 2.5€, other cheese 2.5€, mozzarella 1.5€, truffle cream 3.5€, sausage 2€, olive taggiasche 2€, salmon 3€, GF base 3€"),
];

// Default operational settings — admin editable.
const SEED_SETTINGS = {
  phone: "932 129 506",
  whatsapp: "351932129506",
  email: "reservas@pepeverde.pt",
  instagram: "pepeverdeericeira",
  ubereats: "https://www.ubereats.com/pt/store/pepe-verde-ericeira/RU8gPOfdVP-UlyQCRUrMQQ",
  address_line1: "R. Mendes Leal nº 22",
  address_line2: "2655-319 Ericeira",
  hours: [
    // 0 = Sun … 6 = Sat
    { day: 1, label_pt: "Segunda", label_en: "Monday", open: true, slots: [["18:00", "22:30"]] },
    { day: 2, label_pt: "Terça",   label_en: "Tuesday", open: true, slots: [["18:00", "22:30"]] },
    { day: 3, label_pt: "Quarta",  label_en: "Wednesday", open: true, slots: [["18:00", "22:30"]] },
    { day: 4, label_pt: "Quinta",  label_en: "Thursday", open: true, slots: [["18:00", "22:30"]] },
    { day: 5, label_pt: "Sexta",   label_en: "Friday", open: true, slots: [["18:00", "23:00"]] },
    { day: 6, label_pt: "Sábado",  label_en: "Saturday", open: true, slots: [["12:30", "15:00"], ["18:00", "23:00"]] },
    { day: 0, label_pt: "Domingo", label_en: "Sunday", open: true, slots: [["12:30", "15:00"], ["18:00", "23:00"]] },
  ],
  // reservations
  capacityPerSlot: 30,
  slotMinutes: 30,        // booking slots every 30min
  reservationDuration: 90, // minutes
  minAdvanceHours: 24,
  autoConfirm: true,
  blockedDates: [],       // ['2026-12-25', ...]
  notifyEmail: "reservas@pepeverde.pt",
};

// Initial demo reservations so the admin dashboard isn't empty on first load.
const today = new Date();
const fmt = (d) => d.toISOString().slice(0, 10);
const plus = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return fmt(d); };
const SEED_RESERVATIONS = [
  { id: "r-1", name: "Sofia Marques", phone: "912 345 678", email: "sofia@example.com",
    date: plus(1), time: "20:00", people: 4, area: "interior",
    notes: "Aniversário — possível bolo?", status: "confirmed", createdAt: Date.now() - 86400000 },
  { id: "r-2", name: "João Pereira", phone: "934 111 222", email: "joao@example.com",
    date: plus(2), time: "20:30", people: 2, area: "exterior",
    notes: "", status: "confirmed", createdAt: Date.now() - 3600000 },
  { id: "r-3", name: "Anna Schmidt", phone: "+49 170 5551234", email: "anna@example.com",
    date: plus(3), time: "19:30", people: 6, area: "indiferente",
    notes: "Uma pessoa vegana", status: "pending", createdAt: Date.now() - 1800000 },
  { id: "r-4", name: "Pedro Costa", phone: "967 888 999", email: "pedro@example.com",
    date: plus(0), time: "19:00", people: 3, area: "interior",
    notes: "", status: "confirmed", createdAt: Date.now() - 7200000 },
];

// ---------- Storage helpers ----------
const KEYS = {
  cats: "pv_categories",
  items: "pv_items",
  settings: "pv_settings",
  reservations: "pv_reservations",
  lang: "pv_lang",
  admin: "pv_admin_session",
};

function loadOrSeed(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(seed));
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
}
function resetAll() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}

// ---------- i18n ----------
const T = {
  pt: {
    nav_home: "Início", nav_menu: "Menu", nav_reservas: "Reservas",
    nav_sobre: "Sobre", nav_contactos: "Contactos",
    cta_reserve: "Reservar Mesa", cta_uber: "Uber Eats",
    hero_eyebrow: "A Slice of Italy",
    hero_title: "Pizza italiana no coração da Ericeira.",
    hero_sub: "Pizzas, antipasti, saladas e piadine num espaço simples, quente e feito para partilhar.",
    cta_see_menu: "Ver Menu", cta_order_uber: "Pedir no Uber Eats",
    about_title: "A Pepe Verde",
    about_body: "A Pepe Verde é uma pizzaria italiana na Ericeira, criada para quem gosta de comida simples, ingredientes honestos e uma mesa sem complicações. Do pão de alho às pizzas, das saladas às piadine, tudo é próximo, fresco e feito para ser partilhado.",
    highlights_title: "Destaques da casa",
    highlights_sub: "Pratos da equipa, escolhidos a dedo.",
    quick_reserve_title: "Reserva a tua mesa",
    quick_reserve_sub: "Disponível para o próximo serviço. Confirmação imediata se houver slot.",
    also_uber_title: "Também podes pedir em casa",
    also_uber_sub: "A Slice of Italy, entregue à tua porta.",
    location_title: "Onde estamos",
    menu_title: "Menu", menu_sub: "Preço com IVA incluído à taxa legal em vigor.",
    filter_all: "Todos", filter_v: "Vegetariano", filter_vg: "Vegano", filter_gf: "Sem glúten",
    reservas_title: "Reservas",
    reservas_sub: "Reserva a tua mesa. Confirmação imediata.",
    field_name: "Nome", field_phone: "Telefone", field_email: "Email",
    field_date: "Data", field_time: "Hora", field_people: "Pessoas",
    field_area: "Preferência", field_notes: "Notas especiais",
    area_inside: "Interior", area_outside: "Exterior", area_either: "Indiferente",
    rgpd: "Aceito que os meus dados sejam usados para gerir esta reserva.",
    rgpd_link: "Política de Privacidade",
    submit_reserve: "Confirmar Reserva",
    sobre_title: "Sobre nós",
    contactos_title: "Contactos",
    hours_title: "Horário",
    closed: "Fechado",
    footer_legal: "Pepe Verde — Pizzaria Italiana, Ericeira",
    admin: "Admin",
    come_hungry: "Come hungry. Leave happy.",
    made_fresh: "Made fresh. Served warm.",
    allergens_note: "Pizzas e piadine sem glúten são feitas com bases sem glúten; no entanto, são cozinhadas no mesmo forno que as pizzas comuns, podendo existir contaminação cruzada. Não são adequadas para pessoas com doença celíaca. Alguns pratos podem conter nozes. Por favor, informe-nos sobre alergias ou necessidades alimentares. Qualquer alteração pode resultar numa cobrança adicional.",
  },
  en: {
    nav_home: "Home", nav_menu: "Menu", nav_reservas: "Reservations",
    nav_sobre: "About", nav_contactos: "Contact",
    cta_reserve: "Book a Table", cta_uber: "Uber Eats",
    hero_eyebrow: "A Slice of Italy",
    hero_title: "Italian pizza in the heart of Ericeira.",
    hero_sub: "Pizzas, antipasti, salads and piadine in a simple, warm space made for sharing.",
    cta_see_menu: "See Menu", cta_order_uber: "Order on Uber Eats",
    about_title: "About Pepe Verde",
    about_body: "Pepe Verde is an Italian pizzeria in Ericeira, built for people who like simple food, honest ingredients and a no-fuss table. From garlic bread to pizzas, salads to piadine — everything is close, fresh and made to be shared.",
    highlights_title: "House picks",
    highlights_sub: "Hand-picked by the kitchen team.",
    quick_reserve_title: "Book your table",
    quick_reserve_sub: "Available for the next service. Instant confirmation if a slot is open.",
    also_uber_title: "Or order in",
    also_uber_sub: "A Slice of Italy, delivered to your door.",
    location_title: "Where we are",
    menu_title: "Menu", menu_sub: "Price includes VAT at the legal rate in force.",
    filter_all: "All", filter_v: "Vegetarian", filter_vg: "Vegan", filter_gf: "Gluten-free",
    reservas_title: "Reservations",
    reservas_sub: "Book your table. Instant confirmation.",
    field_name: "Name", field_phone: "Phone", field_email: "Email",
    field_date: "Date", field_time: "Time", field_people: "Guests",
    field_area: "Seating", field_notes: "Special notes",
    area_inside: "Inside", area_outside: "Outside", area_either: "Either",
    rgpd: "I agree that my data may be used to manage this reservation.",
    rgpd_link: "Privacy Policy",
    submit_reserve: "Confirm Reservation",
    sobre_title: "About",
    contactos_title: "Contact",
    hours_title: "Opening hours",
    closed: "Closed",
    footer_legal: "Pepe Verde — Italian Pizzeria, Ericeira",
    admin: "Admin",
    come_hungry: "Come hungry. Leave happy.",
    made_fresh: "Made fresh. Served warm.",
    allergens_note: "Our gluten-free pizza and piadina are made with gluten-free bases; however, they are cooked in the same oven as regular pizzas, so they may be contaminated with gluten and are not suitable for individuals with celiac disease. Some dishes may contain nuts; please let us know if you have a food allergy or special dietary requirements. Any changes will result in an additional charge.",
  },
};

window.PV = {
  KEYS,
  SEED_CATEGORIES, SEED_ITEMS, SEED_SETTINGS, SEED_RESERVATIONS,
  T,
  load: (k, seed) => loadOrSeed(k, seed),
  save,
  resetAll,
};
