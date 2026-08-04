import { useState } from "react";
import {
  BookOpen,
  Feather,
  GraduationCap,
  PenLine,
  BookMarked,
  Globe2,
  Star,
  ChevronRight,
  Menu,
  X,
  ScrollText,
  Sparkles,
  Trophy,
  Clock,
  ArrowRight,
  Quote,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Início", href: "#" },
  { label: "Gramática", href: "#" },
  { label: "Literatura", href: "#" },
  { label: "Exercícios", href: "#" },
  { label: "Sobre", href: "#" },
];

const CARDS = [
  {
    icon: BookOpen,
    title: "Gramática",
    description: "Morfologia, sintaxe, pontuação e norma culta da língua.",
    color: "from-[#8b1a1a] to-[#a52a2a]",
    badge: "48 lições",
    progress: 62,
  },
  {
    icon: ScrollText,
    title: "Literatura",
    description: "Do Romantismo ao Modernismo, autores e obras essenciais.",
    color: "from-[#1a3a2a] to-[#1e4d35]",
    badge: "35 módulos",
    progress: 38,
  },
  {
    icon: BookMarked,
    title: "Interpretação",
    description: "Leitura crítica, inferência e análise de textos variados.",
    color: "from-[#1a2a4a] to-[#1e3668]",
    badge: "52 textos",
    progress: 20,
  },
  {
    icon: PenLine,
    title: "Escrita",
    description: "Redação dissertativa, narrativa e técnicas de argumentação.",
    color: "from-[#4a2a1a] to-[#6b3a22]",
    badge: "24 práticas",
    progress: 45,
  },
  {
    icon: Globe2,
    title: "Vocabulário",
    description: "Palavras, expressões idiomáticas e ampliação lexical.",
    color: "from-[#2a1a4a] to-[#3d2673]",
    badge: "500+ termos",
    progress: 71,
  },
  {
    icon: GraduationCap,
    title: "Ortografia",
    description: "Regras de acentuação, hífen e nova ortografia lusófona.",
    color: "from-[#1a3a3a] to-[#1a4f4f]",
    badge: "30 regras",
    progress: 15,
  },
];

const DESTAQUES = [
  { icon: Trophy, value: "12.400+", label: "Estudantes ativos" },
  { icon: BookOpen, value: "2.100+", label: "Questões disponíveis" },
  { icon: Star, value: "4,9 / 5", label: "Avaliação média" },
  { icon: Clock, value: "Diário", label: "Conteúdo novo" },
];

const QUOTE = {
  text: "A língua é o único instrumento de que o homem não pode abrir mão sem se reduzir ao silêncio.",
  author: "Eça de Queirós",
};

const PALAVRA_DO_DIA = {
  palavra: "Saudade",
  classe: "substantivo feminino",
  definicao:
    "Sentimento melancólico causado pela lembrança de alguém ou algo que se estima e de que se está afastado.",
  exemplo: "\"A saudade é a presença da ausência.\" — Teixeira de Pascoaes",
  origem: "Do latim solitate, solidão",
};

function AzulejoPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="azulejo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="none" stroke="#1a2a4a" strokeWidth="0.5" />
          <rect x="10" y="10" width="60" height="60" fill="none" stroke="#1a2a4a" strokeWidth="0.5" />
          <circle cx="40" cy="40" r="15" fill="none" stroke="#1a2a4a" strokeWidth="0.5" />
          <path d="M10,10 L40,25 L70,10 L70,70 L40,55 L10,70 Z" fill="none" stroke="#1a2a4a" strokeWidth="0.3" />
          <path d="M40,10 L55,40 L40,70 L25,40 Z" fill="none" stroke="#1a2a4a" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#azulejo)" />
    </svg>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden mt-4">
      <div
        className="h-full rounded-full bg-white/60 transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [progresso, setProgresso] = useState(42);

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Lora', Georgia, serif" }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#1a2a4a] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#c9a84c] flex items-center justify-center shadow">
              <Feather className="w-5 h-5 text-[#1a2a4a]" strokeWidth={1.8} />
            </div>
            <div>
              <span
                className="text-white text-lg font-bold leading-none tracking-wide"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Língua Viva
              </span>
              <p className="text-[#c9a84c] text-[10px] leading-none tracking-widest uppercase mt-0.5">
                Português
              </p>
            </div>
          </div>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-4 py-2 text-sm text-white/80 hover:text-[#c9a84c] hover:bg-white/5 rounded transition-all duration-200"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              className="text-sm text-white/70 hover:text-white transition px-3 py-1.5"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Entrar
            </button>
            <button
              className="bg-[#8b1a1a] hover:bg-[#a52a2a] text-white text-sm px-4 py-2 rounded transition-all duration-200 shadow"
              style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 600 }}
            >
              Criar conta
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#12213a] border-t border-white/10 px-4 py-3 space-y-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="block text-sm text-white/80 hover:text-[#c9a84c] py-2"
                style={{ fontFamily: "'Raleway', sans-serif" }}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative bg-[#1a2a4a] overflow-hidden min-h-[540px] flex items-center">
        <AzulejoPattern />

        {/* Decorative side stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#c9a84c] via-[#8b1a1a] to-[#1a3a2a]" />

        <div className="relative max-w-7xl mx-auto px-8 sm:px-12 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <div
              className="inline-flex items-center gap-2 text-[#c9a84c] text-xs uppercase tracking-widest mb-6 border border-[#c9a84c]/30 px-3 py-1.5 rounded-full"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Plataforma educacional lusófona
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.15] mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Explore a{" "}
              <span className="italic text-[#c9a84c]">Língua</span>
              <br />
              Portuguesa
            </h1>
            <p
              className="text-white/70 text-lg leading-relaxed mb-8 max-w-md"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Gramática, literatura e interpretação em um único lugar. Aprenda com profundidade e
              descubra a riqueza da língua que nos une.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className="group inline-flex items-center gap-2 bg-[#8b1a1a] hover:bg-[#a52a2a] text-white px-7 py-3.5 rounded font-semibold shadow-lg transition-all duration-200 hover:shadow-[#8b1a1a]/40 hover:shadow-xl"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                Começar agora
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="inline-flex items-center gap-2 text-white/80 hover:text-[#c9a84c] px-6 py-3.5 border border-white/20 hover:border-[#c9a84c]/50 rounded transition-all duration-200"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                <BookOpen className="w-4 h-4" />
                Ver currículo
              </button>
            </div>
          </div>

          {/* Quote card */}
          <div className="hidden md:block">
            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <Quote className="w-10 h-10 text-[#c9a84c]/40 mb-4" strokeWidth={1} />
              <p
                className="text-white/80 text-lg leading-relaxed italic mb-5"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                "{QUOTE.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-[#c9a84c]" />
                <span
                  className="text-[#c9a84c] text-sm font-medium"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  {QUOTE.author}
                </span>
              </div>

              {/* Stats strip */}
              <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 gap-4">
                {DESTAQUES.slice(0, 2).map((d) => (
                  <div key={d.label} className="flex items-center gap-3">
                    <d.icon className="w-5 h-5 text-[#c9a84c]" strokeWidth={1.5} />
                    <div>
                      <p
                        className="text-white font-bold text-base leading-none"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {d.value}
                      </p>
                      <p className="text-white/50 text-xs mt-0.5">{d.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────── */}
      <section className="bg-[#8b1a1a]">
        <div className="max-w-7xl mx-auto px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
          {DESTAQUES.map((d) => (
            <div key={d.label} className="flex items-center gap-3">
              <d.icon className="w-5 h-5 text-[#f5dfa0]" strokeWidth={1.5} />
              <div>
                <p
                  className="text-white font-bold text-lg leading-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {d.value}
                </p>
                <p className="text-white/60 text-xs mt-0.5">{d.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Seções principais ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <div className="text-center mb-14">
          <p
            className="text-[#8b1a1a] text-xs uppercase tracking-widest mb-3"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            Áreas de estudo
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#1a2a4a] leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Onde você quer começar?
          </h2>
          <div className="w-16 h-0.5 bg-[#c9a84c] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARDS.map((card, i) => (
            <div
              key={card.title}
              className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                activeCard === i ? "ring-2 ring-[#c9a84c] ring-offset-2" : ""
              }`}
              onMouseEnter={() => setActiveCard(i)}
              onMouseLeave={() => setActiveCard(null)}
              onClick={() => {}}
            >
              {/* Gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-95`} />

              {/* Azulejo overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <AzulejoPattern />
              </div>

              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-all duration-300">
                    <card.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-wider text-white/60 bg-black/20 px-2.5 py-1 rounded-full"
                    style={{ fontFamily: "'Raleway', sans-serif" }}
                  >
                    {card.badge}
                  </span>
                </div>

                <h3
                  className="text-xl font-bold text-white mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {card.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">{card.description}</p>

                <ProgressBar value={card.progress} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-white/50 text-[11px]">{card.progress}% concluído</span>
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Palavra do dia + Progresso ───────────────────────────── */}
      <section className="bg-[#ede7d9] border-y border-[#c9a84c]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid md:grid-cols-5 gap-10 items-start">
          {/* Palavra do dia */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full bg-[#c9a84c] flex items-center justify-center">
                <Star className="w-3 h-3 text-white" fill="white" />
              </div>
              <p
                className="text-[#8b1a1a] text-xs uppercase tracking-widest font-semibold"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                Palavra do Dia
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-[#c9a84c]/30 overflow-hidden shadow-md">
              {/* Header strip */}
              <div className="h-1.5 bg-gradient-to-r from-[#8b1a1a] via-[#c9a84c] to-[#1a2a4a]" />
              <div className="p-7">
                <div className="flex flex-wrap items-end gap-4 mb-4">
                  <h3
                    className="text-4xl font-bold text-[#1a2a4a]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {PALAVRA_DO_DIA.palavra}
                  </h3>
                  <span
                    className="text-sm text-[#8b1a1a] italic mb-1"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    {PALAVRA_DO_DIA.classe}
                  </span>
                </div>
                <p className="text-foreground/80 leading-relaxed mb-4">{PALAVRA_DO_DIA.definicao}</p>
                <div className="bg-[#f0ead8] border-l-4 border-[#8b1a1a] pl-4 py-3 rounded-r mb-4">
                  <p
                    className="text-sm text-foreground/70 italic"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    {PALAVRA_DO_DIA.exemplo}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Etimologia: {PALAVRA_DO_DIA.origem}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progresso do estudante */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full bg-[#1a3a2a] flex items-center justify-center">
                <Trophy className="w-3 h-3 text-white" />
              </div>
              <p
                className="text-[#1a3a2a] text-xs uppercase tracking-widest font-semibold"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                Seu Progresso
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-[#c9a84c]/30 p-6 shadow-md space-y-5">
              <div className="text-center py-3">
                <div
                  className="text-5xl font-black text-[#1a2a4a] leading-none mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {progresso}%
                </div>
                <p className="text-muted-foreground text-sm">do curso completo</p>
              </div>

              {/* Circular indicator */}
              <div className="flex justify-center">
                <svg className="w-28 h-28 -rotate-90">
                  <circle cx="56" cy="56" r="48" fill="none" stroke="#ede7d9" strokeWidth="8" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke="#8b1a1a"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 48}`}
                    strokeDashoffset={`${2 * Math.PI * 48 * (1 - progresso / 100)}`}
                    className="transition-all duration-700"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="36"
                    fill="none"
                    stroke="#c9a84c"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - (progresso + 15) / 100)}`}
                    className="transition-all duration-700"
                  />
                </svg>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: "Gramática", v: 62, c: "#8b1a1a" },
                  { label: "Literatura", v: 38, c: "#1a3a2a" },
                  { label: "Vocabulário", v: 71, c: "#1a2a4a" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span
                        className="text-muted-foreground"
                        style={{ fontFamily: "'Raleway', sans-serif" }}
                      >
                        {item.label}
                      </span>
                      <span className="font-semibold" style={{ color: item.c }}>
                        {item.v}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#ede7d9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${item.v}%`, backgroundColor: item.c }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setProgresso((p) => Math.min(100, p + 5))}
                className="w-full bg-[#8b1a1a] hover:bg-[#a52a2a] text-white py-2.5 rounded text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                <BookOpen className="w-4 h-4" />
                Continuar estudando
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Chamada Lusofonia ────────────────────────────────────── */}
      <section className="relative bg-[#1a3a2a] overflow-hidden py-20">
        <AzulejoPattern />
        <div className="relative max-w-7xl mx-auto px-8 text-center">
          <Globe2 className="w-10 h-10 text-[#c9a84c] mx-auto mb-5" strokeWidth={1} />
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Uma língua,{" "}
            <span className="italic text-[#c9a84c]">muitos mundos</span>
          </h2>
          <p
            className="text-white/60 max-w-xl mx-auto mb-8 leading-relaxed"
            style={{ fontFamily: "'Lora', serif" }}
          >
            O português é falado por mais de 260 milhões de pessoas em quatro continentes. Aprenda
            com a riqueza de toda a lusofonia — Brasil, Portugal, Angola, Moçambique e muito mais.
          </p>
          <button
            className="group inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#e0bc60] text-[#1a2a4a] font-bold px-8 py-3.5 rounded transition-all duration-200 shadow-lg"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            Explorar a lusofonia
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-[#12213a] text-white/60">
        <div className="max-w-7xl mx-auto px-8 py-12 grid sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#c9a84c] flex items-center justify-center">
                <Feather className="w-4 h-4 text-[#1a2a4a]" strokeWidth={1.8} />
              </div>
              <span
                className="text-white font-bold text-base"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Língua Viva
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Plataforma educacional dedicada ao ensino e valorização da Língua Portuguesa em toda
              a sua riqueza e diversidade.
            </p>
          </div>

          {/* Links */}
          <div>
            <p
              className="text-white text-xs uppercase tracking-widest mb-4"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Navegação
            </p>
            <ul className="space-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-[#c9a84c] transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional */}
          <div>
            <p
              className="text-white text-xs uppercase tracking-widest mb-4"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Institucional
            </p>
            <ul className="space-y-2 text-sm">
              {["Sobre nós", "Política de privacidade", "Termos de uso", "Contato", "Acessibilidade"].map(
                (t) => (
                  <li key={t}>
                    <a href="#" className="hover:text-[#c9a84c] transition-colors">
                      {t}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 max-w-7xl mx-auto px-8 py-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <p>© 2025 Língua Viva — Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-[#c9a84c]" />
            Feito com amor à língua portuguesa
          </p>
        </div>
      </footer>
    </div>
  );
}
