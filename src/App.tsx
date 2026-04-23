/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, 
  Instagram, 
  MapPin, 
  Clock, 
  Mail, 
  Menu, 
  X, 
  ChevronUp, 
  Scale, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Users,
  Car
} from "lucide-react";
import { NOTARY_DATA, SERVICES } from "./constants";

// --- Components ---

const Reveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = async () => {
    if (!formData.name || !formData.phone) {
      alert("Будь ласка, заповніть обов'язкові поля.");
      return;
    }

    setFormStatus("loading");
    try {
      const response = await fetch("https://formsubmit.co/ajax/officenotarius@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          _subject: "Новий запис з сайту — нотаріус Бєльтюкова",
          _captcha: "false"
        }),
      });

      if (response.ok) {
        setFormStatus("success");
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      console.error(error);
      setFormStatus("error");
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen selection:bg-gold selection:text-dark">
      {/* --- Header --- */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
          isScrolled 
            ? "bg-dark h-[64px] border-gold/30 shadow-2xl" 
            : "bg-transparent h-[72px] border-gold/10"
        }`}
      >
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div 
            className="flex flex-col cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="font-serif font-semibold text-lg text-white leading-none uppercase tracking-tight group-hover:text-gold transition-colors">
              ЄВГЕНІЯ БЄЛЬТЮКОВА
            </span>
            <span className="font-sans text-[10px] text-gold tracking-[0.2em] uppercase mt-1">
              Приватний нотаріус · Одеса
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-10">
            {["Послуги", "Про мене", "Запис", "Контакти"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item === "Послуги" ? "services" : item === "Про мене" ? "about" : item === "Запис" ? "booking" : "contacts")}
                className="text-white/70 text-[11px] uppercase tracking-[0.2em] hover:text-gold transition-all"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-6">
            <div className="hidden xl:block text-right">
              <p className="text-white text-[13px] font-medium leading-none">{NOTARY_DATA.phones.primary}</p>
              <p className="text-gold text-[9px] uppercase tracking-widest mt-1">Viber / Telegram</p>
            </div>
            <button 
              onClick={() => scrollToSection("booking")}
              className="hidden sm:block border border-gold text-gold text-[11px] px-6 py-2 tracking-[0.1em] hover:bg-gold hover:text-dark transition-all duration-300 uppercase"
            >
              Записатись
            </button>
            
            <button 
              className="lg:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* --- Mobile Overlay Menu --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-dark flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16">
              <div className="flex flex-col">
                <span className="font-serif text-white uppercase text-lg leading-none font-semibold">Бєльтюкова Є.М.</span>
                <span className="text-gold text-[9px] uppercase tracking-widest mt-1">Приватний нотаріус</span>
              </div>
              <button 
                className="text-white p-2 border border-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col items-start space-y-8 mb-auto">
              {[
                { id: "services", label: "Послуги" },
                { id: "about", label: "Про мене" },
                { id: "booking", label: "Запис" },
                { id: "contacts", label: "Контакти" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white text-4xl font-serif hover:text-gold transition-colors text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-12 border-t border-white/10">
              <p className="text-gold text-[10px] uppercase tracking-widest mb-4">Контакти</p>
              <a 
                href={`tel:${NOTARY_DATA.phones.raw_primary}`}
                className="text-white text-2xl font-sans font-medium block mb-2"
              >
                {NOTARY_DATA.phones.primary}
              </a>
              <p className="text-white/40 text-sm font-light leading-relaxed">
                {NOTARY_DATA.address.short} <br /> м. Одеса
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <section className="relative min-h-screen bg-dark flex items-center pt-[72px] overflow-hidden">
        {/* Background Monogram */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.04] select-none">
          <span className="text-[500px] font-serif font-bold -rotate-12 text-gold">⚖</span>
        </div>
        
        <div className="container mx-auto px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center relative z-10">
          <div className="max-w-[720px]">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="font-sans text-[11px] text-gold tracking-[0.3em] uppercase mb-6"
            >
              Свідоцтво {NOTARY_DATA.license} · {NOTARY_DATA.experience.toUpperCase()}
            </motion.p>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif font-bold text-5xl md:text-8xl text-white mb-8 leading-[1.05]"
            >
              Нотаріальні послуги <br />
              <span className="italic font-normal opacity-90">в Одесі</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-sans font-light text-lg md:text-xl text-white/70 mb-10 max-w-[560px] leading-relaxed"
            >
              Бєльтюкова Євгенія Михайлівна — ваш надійний правовий партнер. 
              Професійне посвідчення угод, оформлення спадщини та реєстрація бізнесу.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center gap-8"
            >
              <button 
                onClick={() => scrollToSection("booking")}
                className="bg-gold text-dark text-[12px] font-bold uppercase px-10 py-5 tracking-[0.15em] hover:bg-gold/90 transition-all shadow-xl"
              >
                Онлайн-запис
              </button>
              
              <div className="hidden sm:flex flex-col">
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1">Пріоритетні дії</p>
                <p className="text-[13px] text-gold font-medium">Реєстрація юр. осіб / Спадщина</p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:flex justify-end"
          >
            <div className="border border-gold/20 p-12 bg-white/5 backdrop-blur-md rounded-[2px] w-full max-w-[400px]">
              <div className="w-12 h-0.5 bg-gold mb-8"></div>
              <p className="font-serif text-3xl text-gold mb-6 leading-tight">Професійність. Довіра. Закон.</p>
              <div className="space-y-6">
                {[
                  { icon: ShieldCheck, text: "Повна конфіденційність" },
                  { icon: Clock, text: "Дотримання термінів" },
                  { icon: Scale, text: "Правова чистота" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-white/60 text-sm font-light">
                    <item.icon size={18} className="text-gold/50" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Services Section --- */}
      <section id="services" className="py-24 bg-bg">
        <div className="container mx-auto px-6">
          <Reveal className="mb-16">
            <h2 className="text-dark text-4xl md:text-[52px] font-bold mb-4 font-serif">Наші послуги</h2>
            <div className="w-12 h-1 bg-gold"></div>
          </Reveal>

          <div className="grid lg:grid-cols-[1fr_1fr] gap-x-16 gap-y-8 items-start">
            {/* Featured list-style services */}
            <div className="space-y-4">
              {SERVICES.map((service, index) => (
                <Reveal 
                  key={service.id} 
                  className={`p-6 flex items-start space-x-6 border transition-all ${
                    service.featured 
                      ? "bg-dark border-dark text-white" 
                      : "bg-surface border-border hover:border-gold"
                  }`}
                >
                  <span className={`text-2xl ${service.featured ? "text-gold" : "text-gold"}`}>
                    {service.id === 4 ? "⚖" : service.id === 2 ? "✦" : "◆"}
                  </span>
                  <div>
                    <h3 className={`font-serif text-xl font-semibold mb-2 ${service.featured ? "text-gold" : "text-dark"}`}>
                      {service.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${service.featured ? "text-white/60" : "text-muted"}`}>
                      {service.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="space-y-8 lg:sticky lg:top-32">
              <Reveal className="p-10 border border-gold/30 bg-dark-soft text-white rounded-[2px] relative overflow-hidden group">
                <div className="relative z-10">
                  <span className="text-gold text-2xl mb-4 block">✦</span>
                  <h3 className="font-serif text-2xl font-bold text-gold mb-4">Виїзд до клієнта</h3>
                  <p className="text-white/70 text-sm leading-relaxed font-light mb-8">
                    Вчинення нотаріальних дій за межами офісу для вашої зручності. 
                    Виїзд за місцем проживання, в лікарні або до офісу компанії по всій Одесі.
                  </p>
                  <button onClick={() => scrollToSection("booking")} className="text-[11px] uppercase tracking-widest text-gold font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                    Домовитись про виїзд <ArrowRight size={14} />
                  </button>
                </div>
              </Reveal>
              
              <Reveal className="grid grid-cols-2 gap-8 py-10 border-t border-border">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gold mb-3">Локація</p>
                  <p className="text-sm font-medium text-dark leading-tight">{NOTARY_DATA.address.short}</p>
                  <p className="text-xs text-muted mt-1">{NOTARY_DATA.address.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-gold mb-3">Робочі години</p>
                  <p className="text-sm font-medium text-dark leading-tight">Пн – Пт: 10:00 – 17:00</p>
                  <p className="text-xs text-muted mt-1">Одеса, Україна</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="about" className="py-24 bg-surface relative">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <Reveal className="order-2 lg:order-1">
            <p className="text-gold text-[11px] uppercase tracking-[0.3em] mb-4">Про нотаріуса</p>
            <h2 className="text-dark text-4xl md:text-6xl font-bold mb-8 font-serif">Бєльтюкова <br /> Євгенія Михайлівна</h2>
            <div className="w-16 h-1 bg-gold mb-12"></div>
            <p className="text-muted text-lg font-light leading-relaxed mb-8">
              Маючи понад 17 років професійної практики, я забезпечую високий стандарт нотаріального обслуговування. Моя мета — не просто засвідчити документ, а стати вашим надійним правовим провідником.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {["Досвід з 2007 року", "Округ: Одеський міський", "Свідоцтво: № 6248", "Прийом без черг"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-dark/70">
                  <div className="w-1.5 h-1.5 bg-gold rotate-45"></div>
                  {item}
                </div>
              ))}
            </div>
            <button 
              onClick={() => scrollToSection("booking")}
              className="bg-dark text-white px-10 py-5 text-[11px] uppercase tracking-widest font-bold hover:bg-gold hover:text-dark transition-all rounded-[2px]"
            >
              Консультація
            </button>
          </Reveal>

          <Reveal className="order-1 lg:order-2">
            <div className="aspect-square bg-bg border border-border p-3 rounded-[2px] relative group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 -m-4 -z-10 group-hover:m-0 transition-all duration-700"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/10 -m-4 -z-10 group-hover:m-0 transition-all duration-700"></div>
              <div className="w-full h-full bg-dark flex items-center justify-center relative overflow-hidden">
                <span className="text-gold opacity-[0.05] text-[200px] font-serif absolute -bottom-10 -right-10">⚖</span>
                <div className="text-center p-12">
                   <p className="font-serif text-white text-3xl mb-4 italic opacity-80">«Закон — це не лише слова, а впевненість у завтрашньому дні»</p>
                   <div className="w-10 h-0.5 bg-gold mx-auto mb-4"></div>
                   <p className="text-gold text-[10px] uppercase tracking-widest">Бєльтюкова Є.М.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- Booking Section --- */}
      <section id="booking" className="py-24 bg-bg border-y border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-[1000px] mx-auto grid lg:grid-cols-[1fr_1fr] gap-16 bg-surface border border-border p-8 md:p-16 shadow-sm">
            <Reveal>
              <h2 className="text-dark text-4xl font-bold font-serif mb-6 leading-tight">Записатись <br className="hidden md:block" /> на прийом</h2>
              <p className="text-muted text-sm font-light mb-10 max-w-sm">
                Залиште заявку, і я зателефоную вам протягом 15 хвилин для уточнення деталей та часу.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-dark text-sm border-b border-border py-4">
                  <Phone size={16} className="text-gold" />
                  <span>{NOTARY_DATA.phones.primary}</span>
                </div>
                <div className="flex items-center gap-4 text-dark text-sm border-b border-border py-4">
                  <Mail size={16} className="text-gold" />
                  <span>{NOTARY_DATA.email}</span>
                </div>
                <div className="flex items-center gap-4 text-dark text-sm border-b border-border py-4">
                  <Instagram size={16} className="text-gold" />
                  <span>{NOTARY_DATA.instagram}</span>
                </div>
              </div>
            </Reveal>

            <Reveal>
              {formStatus === "success" ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-6">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-dark font-serif text-2xl mb-4">Дякую!</h3>
                  <p className="text-muted text-sm italic">Я зв'яжусь з вами найближчим часом.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <input 
                    type="text" 
                    placeholder="Ім'я"
                    className="w-full bg-white border-b border-border focus:border-gold py-4 outline-none text-sm transition-all placeholder:text-muted/40"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    type="tel" 
                    placeholder="Телефон"
                    className="w-full bg-white border-b border-border focus:border-gold py-4 outline-none text-sm transition-all placeholder:text-muted/40"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <select 
                    className="w-full bg-white border-b border-border focus:border-gold py-4 outline-none text-sm transition-all text-muted/60"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                  >
                    <option value="">Оберіть послугу</option>
                    {SERVICES.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                  </select>
                  <button 
                    onClick={handleFormSubmit}
                    disabled={formStatus === "loading"}
                    className="w-full bg-dark text-white py-5 font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-gold hover:text-dark transition-all mt-6 shadow-lg"
                  >
                    {formStatus === "loading" ? "ВІДПРАВКА..." : "НАДІСЛАТИ ЗАЯВКУ"}
                  </button>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- Footer / Status Bar Area --- */}
      <footer className="h-12 bg-[#0E1A10] px-12 flex items-center justify-between shrink-0 overflow-hidden border-t border-gold/10">
        <div className="flex items-center space-x-6 text-[10px] text-white/40 uppercase tracking-widest whitespace-nowrap">
          <span>© 2025 Бєльтюкова Є.М.</span>
          <span className="hidden sm:inline w-1 h-1 bg-gold rounded-full"></span>
          <span className="hidden md:inline shrink-0">Одеський міський нотаріальний округ</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <a 
            href={NOTARY_DATA.instagramUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/40 hover:text-gold text-[10px] uppercase tracking-widest flex items-center transition-colors px-2 py-1"
          >
            instagram
          </a>
          <a 
            href={NOTARY_DATA.address.mapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/40 hover:text-gold text-[10px] uppercase tracking-widest flex items-center transition-colors px-2 py-1"
          >
            <span className="mr-2">📍</span> google maps
          </a>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-dark border-t border-gold/20 flex shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        <a 
          href={`tel:${NOTARY_DATA.phones.raw_primary}`}
          className="flex-1 text-gold py-5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <Phone size={12} /> Дзвінок
        </a>
        <button 
          onClick={() => scrollToSection("booking")}
          className="flex-1 bg-gold text-dark py-5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <Calendar size={12} /> Запис
        </button>
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-20 right-6 z-40 bg-gold text-dark w-10 h-10 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
