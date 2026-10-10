import React, { useState, useEffect, useRef } from 'react';

// Configurações globais e dados (preparado para ser movido para um .env ou config.ts)
const CONFIG = {
  nome: "Bella Pink Lagomar",
  instagram: "@bellapinklagomar", // Pendente confirmação
  whatsapp: "5522900000000", // PENDENTE: Inserir número real com DDD
  endereco: "Lagomar, Macaé/RJ", // PENDENTE: Endereço completo
  webhookUrl: "", // PENDENTE: URL do n8n ou Google Apps Script (ex: /api/leads)
  cores: {
    primaria: "#B72C68", // Framboesa
    secundaria: "#E78DAF", // Rosa Médio
    clara: "#F8DDE7", // Rosa Claro
    fundo: "#FFF9FB", // Off-white
    texto: "#31232C" // Grafite
  }
};

const Icons = {
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Instagram: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
  WhatsApp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Send: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
};

const StyleInjector = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300;400;500;600&display=swap');

    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', sans-serif;
      background-color: ${CONFIG.cores.fundo};
      color: ${CONFIG.cores.texto};
    }
    h1, h2, h3, .font-serif { font-family: 'DM Serif Display', serif; }

    /* Efeitos Especiais nos Botões */
    .btn-primary {
      background: linear-gradient(135deg, ${CONFIG.cores.primaria} 0%, #9A2456 100%);
      color: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 15px rgba(183, 44, 104, 0.25);
    }
    .btn-primary:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 25px rgba(183, 44, 104, 0.45);
    }

    .btn-outline {
      border: 2px solid ${CONFIG.cores.primaria};
      color: ${CONFIG.cores.primaria};
      background: transparent;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-outline:hover {
      background-color: ${CONFIG.cores.clara};
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(248, 221, 231, 0.7);
    }

    /* Foco acessível */
    *:focus-visible {
      outline: 2px solid ${CONFIG.cores.primaria};
      outline-offset: 2px;
    }

    /* Animações do ChatBot (Typebot style) */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .chat-message {
      animation: fadeInUp 0.4s ease-out forwards;
    }
    .typing-dot {
      animation: typingBounce 1.4s infinite ease-in-out both;
    }
    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes typingBounce {
      0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }
  `}} />
);

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Início", href: "#hero" },
    { name: "Categorias", href: "#categorias" },
    { name: "Destaques", href: "#destaques" },
    { name: "Sobre", href: "#sobre" }
  ];

  const handleLinkClick = () => setMobileMenuOpen(false);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2 z-50 relative">
          <span className="font-serif text-2xl font-bold text-[#B72C68] tracking-tight">
            Bella Pink <span className="text-[#31232C] text-lg block sm:inline sm:ml-1">Lagomar</span>
          </span>
        </a>

        {/* Desktop Nav & CTA Group - Alinhados à direita */}
        <div className="hidden md:flex items-center gap-8 ml-auto">
          <nav className="flex gap-6 items-center">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className="text-sm font-medium hover:text-[#B72C68] transition-colors">
                {link.name}
              </a>
            ))}
          </nav>
          <a href="#contato" className="btn-primary px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-md">
            <Icons.WhatsApp /> Falar com a Loja
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-50 relative p-2 text-[#31232C]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Alternar menu"
        >
          {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden pt-24 px-6`}>
        <nav className="flex flex-col gap-6 text-center">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} onClick={handleLinkClick} className="text-xl font-medium border-b border-[#F8DDE7] pb-4">
              {link.name}
            </a>
          ))}
          <a href="#contato" onClick={handleLinkClick} className="btn-primary w-full py-4 rounded-xl text-lg font-medium flex justify-center items-center gap-2 mt-4 shadow-lg">
            <Icons.WhatsApp /> Falar no WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
};

const Hero = () => {
  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#FFF9FB]">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#F8DDE7] opacity-60 blur-3xl mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 -ml-20 w-72 h-72 rounded-full bg-[#E78DAF] opacity-20 blur-3xl mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-[#F8DDE7] text-[#B72C68] text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm">
              Sua beleza em destaque
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#31232C] leading-tight mb-6">
              Seu momento de beleza <span className="text-[#B72C68]">começa aqui.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Perfumes, maquiagem e os melhores produtos de autocuidado para deixar sua rotina ainda mais especial. Visite nossa loja no Lagomar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#categorias" className="btn-primary text-center px-8 py-3.5 rounded-full font-medium">
                Conhecer Produtos
              </a>
              <a href="#contato" className="btn-outline text-center px-8 py-3.5 rounded-full font-medium flex justify-center items-center gap-2">
                Solicitar Atendimento
              </a>
            </div>
          </div>

          <div className="relative">
            {/* Imagem Profissional Injetada - Link Estável Unsplash com Fallback */}
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1000&q=80"
                onError={(e) => { e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='1250' viewBox='0 0 1000 1250'%3E%3Crect fill='%23F8DDE7' width='1000' height='1250'/%3E%3Ctext fill='%23B72C68' font-family='sans-serif' font-size='40' font-weight='bold' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EBella Pink%3C/text%3E%3C/svg%3E" }}
                alt="Cosméticos Bella Pink - Vidros elegantes de perfume e cremes"
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#B72C68]/30 to-transparent"></div>
            </div>

            {/* Elemento flutuante de design */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-[#F8DDE7] max-w-[200px] animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F8DDE7] rounded-full flex items-center justify-center text-[#B72C68]">
                  ✨
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Novidades</p>
                  <p className="text-sm font-bold text-[#31232C]">Toda semana</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const Categorias = () => {
  const cats = [
    { nome: "Perfumaria e Splash", desc: "Fragrâncias marcantes", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80" },
    { nome: "Maquiagem", desc: "Realce sua essência", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=500&q=80" },
    { nome: "Cuidados Corpo", desc: "Esfoliantes e cremes", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=500&q=80" },
    { nome: "Presentes", desc: "Kits especiais", img: "https://images.unsplash.com/photo-1512446816042-444d641267d4?auto=format&fit=crop&w=500&q=80" }
  ];

  return (
    <section id="categorias" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-[#31232C] mb-4">O que você procura hoje?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Explore nossas seções e encontre os produtos perfeitos para o seu momento de autocuidado.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cats.map((cat, idx) => (
            <div key={idx} className="group cursor-pointer rounded-2xl overflow-hidden bg-[#FFF9FB] border border-[#F8DDE7] hover:shadow-2xl transition-all duration-300">
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={cat.img}
                  onError={(e) => { e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Crect fill='%23F8DDE7' width='500' height='500'/%3E%3Ctext fill='%23B72C68' font-family='sans-serif' font-size='24' font-weight='bold' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E" + encodeURIComponent(cat.nome) + "%3C/text%3E%3C/svg%3E" }}
                  alt={cat.nome}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-5 text-center">
                <h3 className="font-serif text-xl text-[#31232C] mb-1">{cat.nome}</h3>
                <p className="text-sm text-gray-500 mb-4">{cat.desc}</p>
                <a
                  href="#contato"
                  className="text-[#B72C68] font-medium text-sm flex items-center justify-center gap-1 group-hover:gap-2 transition-all"
                >
                  Consultar <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Destaques = () => {
  const destaques = [
    { nome: "Gloss Labial Cores Intensas", marca: "Linha Premium", categoria: "Gloss Labial", label: "Novo", img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80" },
    { nome: "Esfoliante Corporal Renovador", marca: "Skincare", categoria: "Corpo", label: "Destaque", img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80" },
    { nome: "Body Splash Frescor Diário 200ml", marca: "Essência", categoria: "Perfumaria", label: "", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80" },
    { nome: "Kit Presenteável Autocuidado", marca: "Boutique", categoria: "Kits", label: "Oferta", img: "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=400&q=80" },
  ];

  return (
    <section id="destaques" className="py-20 bg-[#FFF9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#31232C] mb-2">Destaques da Loja</h2>
            <p className="text-gray-600">Conheça as linhas mais procuradas e lançamentos.</p>
          </div>
          <a href="#contato" className="text-[#B72C68] font-medium hover:underline flex items-center gap-1">
            Ver todas as novidades &rarr;
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {destaques.map((prod, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-square bg-gray-100 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center">
                <img
                  src={prod.img}
                  onError={(e) => { e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23F8DDE7' width='400' height='400'/%3E%3Ctext fill='%23B72C68' font-family='sans-serif' font-size='24' font-weight='bold' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EProduto%3C/text%3E%3C/svg%3E" }}
                  alt={prod.nome}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                {prod.label && (
                  <span className="absolute top-2 right-2 bg-[#B72C68] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {prod.label}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#E78DAF] font-semibold mb-1 uppercase tracking-wide">{prod.categoria}</p>
              <h3 className="font-medium text-[#31232C] text-sm sm:text-base mb-1 line-clamp-2">{prod.nome}</h3>
              <p className="text-xs text-gray-500 mb-4">{prod.marca}</p>

              <div className="mt-auto">
                <a href="#contato" className="w-full block text-center py-2.5 bg-[#F8DDE7] text-[#B72C68] text-sm font-medium rounded-lg hover:bg-[#E78DAF] hover:text-white transition-colors">
                  Consultar Disponibilidade
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">*Produtos ilustrativos baseados no nosso portfólio. Verifique o estoque atualizado pelo WhatsApp.</p>
      </div>
    </section>
  );
};

const Sobre = () => {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F8DDE7] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-lg">
          <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-serif text-[#31232C] mb-6">Sobre a Bella Pink</h2>
            <p className="text-gray-800 mb-4 leading-relaxed">
              Bem-vinda à Bella Pink Lagomar, o seu novo espaço dedicado à beleza e ao autocuidado em Macaé.
            </p>
            <p className="text-gray-800 mb-8 leading-relaxed">
              Nossa missão é oferecer uma seleção cuidadosa de cosméticos, perfumes e maquiagens que realçam a sua essência. Acreditamos que cuidar de si mesma é um ato de amor diário, e estamos aqui para tornar esse momento mais acessível, colorido e especial com um atendimento acolhedor.
            </p>
            <div>
              <a href="#contato" className="inline-flex btn-primary px-8 py-3.5 rounded-full font-medium">
                Venha nos visitar
              </a>
            </div>
          </div>
          <div className="md:w-1/2 bg-gray-200 min-h-[300px] relative overflow-hidden">
             <img
               src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80"
               onError={(e) => { e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23F8DDE7' width='800' height='600'/%3E%3Ctext fill='%23B72C68' font-family='sans-serif' font-size='30' font-weight='bold' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENossa Loja%3C/text%3E%3C/svg%3E" }}
               alt="Interior elegante de loja de cosméticos"
               className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
               loading="lazy"
             />
          </div>
        </div>
      </div>
    </section>
  );
};

const ChatBotLeadCapture = () => {
  // Estado do Chat
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Olá! Bem-vinda à vitrine da Bella Pink Lagomar. 💖' },
    { id: 2, sender: 'bot', text: 'Para um atendimento rápido e VIP, como podemos te chamar?' }
  ]);

  // Controle de Fluxo
  // 0: Aguardando Nome | 1: Aguardando WhatsApp | 2: Aguardando Interesse | 3: Aguardando Consentimento | 4: Finalizado
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userData, setUserData] = useState({ nome: '', whatsapp: '', interesse: '', consentimento: false });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const simulateBotTyping = (callback, delay = 1200) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const handleSendText = (text) => {
    if (!text.trim()) return;

    // Adiciona mensagem do usuário
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Lógica baseada no passo atual
    if (step === 0) {
      const primeiroNome = text.split(' ')[0];
      setUserData(prev => ({ ...prev, nome: text }));
      setStep(1);

      simulateBotTyping(() => {
        setMessages(prev => [...prev, {
          id: Date.now()+1,
          sender: 'bot',
          text: `Prazer, ${primeiroNome}! 🥰 Qual é o seu WhatsApp com DDD? (digite apenas os números)`
        }]);
      });
    }
    else if (step === 1) {
      const numLimpo = text.replace(/\D/g, '');
      if (numLimpo.length < 10) {
        simulateBotTyping(() => {
          setMessages(prev => [...prev, {
            id: Date.now()+1,
            sender: 'bot',
            text: `Hmm, esse número parece incompleto. Pode digitar novamente com o DDD? Ex: 22999999999`
          }]);
        }, 800);
        return;
      }

      setUserData(prev => ({ ...prev, whatsapp: numLimpo }));
      setStep(2);

      simulateBotTyping(() => {
        setMessages(prev => [...prev, {
          id: Date.now()+1,
          sender: 'bot',
          text: 'Perfeito! O que você está procurando hoje na nossa loja?',
          isOptions: true,
          options: ['Perfumaria e Body Splash', 'Maquiagem e Gloss', 'Cuidados com a Pele / Corpo', 'Kits e Presentes']
        }]);
      }, 1000);
    }
  };

  const handleOptionClick = (option) => {
    setUserData(prev => ({ ...prev, interesse: option }));

    // Remove os botões da mensagem anterior para virar texto fixo
    setMessages(prev => prev.map(m => m.isOptions ? { ...m, isOptions: false } : m));

    const userMsg = { id: Date.now(), sender: 'user', text: option };
    setMessages(prev => [...prev, userMsg]);
    setStep(3);

    simulateBotTyping(() => {
      setMessages(prev => [...prev, {
        id: Date.now()+1,
        sender: 'bot',
        text: 'Ótima escolha! Para continuarmos, você aceita nossa política de contato? Prometemos não enviar spam, apenas um atendimento VIP direto no seu WhatsApp. ✨',
        isConsent: true
      }]);
    }, 1200);
  };

  const handleConsentClick = () => {
    setUserData(prev => ({ ...prev, consentimento: true }));
    setMessages(prev => prev.map(m => m.isConsent ? { ...m, isConsent: false } : m));
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: 'Sim, eu aceito!' }]);
    setStep(4);

    simulateBotTyping(() => {
      setMessages(prev => [...prev, { id: Date.now()+1, sender: 'bot', text: 'Registrando seu pedido mágico... 🪄' }]);

      // Simulação da Integração com Cloudflare Functions/Google Sheets
      setTimeout(() => {
         setMessages(prev => [...prev, { id: Date.now()+2, sender: 'bot', text: 'Tudo certo! Estamos te redirecionando agora mesmo para falar com a nossa equipe. 🚀' }]);

         setTimeout(() => {
            const mensagemBase = `Olá! Vim pelo site da Bella Pink Lagomar. Meu interesse é: ${userData.interesse}. Meu nome é ${userData.nome}.`;
            const urlEncoded = encodeURIComponent(mensagemBase);
            window.open(`https://wa.me/${CONFIG.whatsapp}?text=${urlEncoded}`, '_blank');
         }, 1800);
      }, 2000);
    });
  };

  return (
    <section id="contato" className="py-24 bg-[#FFF9FB] relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F8DDE7] via-[#B72C68] to-[#F8DDE7]"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-[#31232C] mb-4">Gostou de algo?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fale com a nossa assistente virtual! O processo leva menos de 1 minuto e você será direcionada para um atendimento exclusivo no WhatsApp.
          </p>
        </div>

        {/* Chat Window Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[600px] max-w-3xl mx-auto">

          {/* Header do Chat */}
          <div className="bg-gradient-to-r from-[#B72C68] to-[#9A2456] p-4 sm:p-5 flex items-center justify-between text-white shadow-md z-10 relative">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#B72C68] font-serif text-xl font-bold shadow-inner">
                BP
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base tracking-wide">Assistente Bella Pink</h3>
                <p className="text-xs text-[#F8DDE7] flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span> Online e pronta para ajudar
                </p>
              </div>
            </div>

            {/* Contato direto alternativo discreto */}
            <a
              href={`https://wa.me/${CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-full hidden sm:flex items-center gap-1"
            >
              Pular chat <span aria-hidden="true">&rarr;</span>
            </a>
          </div>

          {/* Corpo do Chat */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 space-y-5">

            {/* Mensagem de Segurança */}
            <div className="text-center mb-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                Ambiente Seguro e Privado
              </span>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} chat-message`}>

                {/* Avatar do Bot (apenas na esquerda) */}
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-[#F8DDE7] flex-shrink-0 mr-3 flex items-center justify-center text-[#B72C68] text-xs font-serif shadow-sm mt-1">
                    BP
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] p-3.5 sm:p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#B72C68] text-white rounded-2xl rounded-tr-sm shadow-md'
                    : 'bg-white border border-[#F8DDE7]/50 text-[#31232C] rounded-2xl rounded-tl-sm shadow-sm'
                }`}>
                  {msg.text}

                  {/* Opções de Interesses */}
                  {msg.isOptions && (
                    <div className="mt-4 flex flex-col gap-2.5">
                      {msg.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleOptionClick(opt)}
                          className="w-full text-left px-4 py-3 text-[#B72C68] bg-[#F8DDE7]/30 border border-[#F8DDE7] rounded-xl hover:bg-[#F8DDE7] transition-all text-sm font-medium hover:pl-5 hover:shadow-sm"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Botão de Consentimento LGPD */}
                  {msg.isConsent && (
                    <div className="mt-4 space-y-3">
                      <button
                        onClick={handleConsentClick}
                        className="w-full px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all text-sm font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                         <Icons.Check /> Sim, eu aceito!
                      </button>
                      <p className="text-[10px] text-gray-400 text-center px-2">
                        Ao aceitar, você concorda que possamos usar seus dados apenas para entrar em contato referente ao seu interesse.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Indicador de Digitação */}
            {isTyping && (
              <div className="flex justify-start chat-message">
                <div className="w-8 h-8 rounded-full bg-[#F8DDE7] flex-shrink-0 mr-3 mt-1"></div>
                <div className="bg-white border border-[#F8DDE7]/50 rounded-2xl rounded-tl-sm shadow-sm p-4 flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Área de Input do Chat */}
          <div className="p-4 sm:p-5 bg-white border-t border-gray-100 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendText(inputValue); }}
              className="flex items-center gap-3 relative"
            >
              {step === 1 && (
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium z-10 select-none">
                   +55
                 </span>
              )}
              <input
                type={step === 1 ? "tel" : "text"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  step === 0 ? "Escreva seu nome aqui..." :
                  step === 1 ? "DDD + Número" :
                  "Escolha uma opção acima..."
                }
                disabled={step >= 2 || isTyping}
                className={`flex-1 ${step === 1 ? 'pl-12' : 'pl-5'} pr-5 py-3.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-[#B72C68] focus:ring-2 focus:ring-[#F8DDE7] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm text-[#31232C]`}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || step >= 2 || isTyping}
                className="w-12 h-12 bg-[#B72C68] text-white rounded-full flex items-center justify-center hover:bg-[#9A2456] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-md shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B72C68]"
                aria-label="Enviar mensagem"
              >
                <Icons.Send />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#31232C] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          <div>
            <span className="font-serif text-2xl font-bold text-[#F8DDE7] tracking-tight block mb-4">
              Bella Pink <span className="text-white text-lg">Lagomar</span>
            </span>
            <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
              Sua boutique de beleza local. Oferecemos as melhores marcas para o seu momento de autocuidado, sempre com um atendimento dedicado.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#B72C68] transition-all hover:scale-110">
                <Icons.Instagram />
              </a>
              <a href={`https://wa.me/${CONFIG.whatsapp}`} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#B72C68] transition-all hover:scale-110">
                <Icons.WhatsApp />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4 uppercase text-sm tracking-wider">Links Rápidos</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#hero" className="hover:text-[#E78DAF] transition-colors inline-block hover:translate-x-1 duration-200">Início</a></li>
              <li><a href="#categorias" className="hover:text-[#E78DAF] transition-colors inline-block hover:translate-x-1 duration-200">Produtos e Categorias</a></li>
              <li><a href="#sobre" className="hover:text-[#E78DAF] transition-colors inline-block hover:translate-x-1 duration-200">Sobre a Loja</a></li>
              <li><a href="#contato" className="hover:text-[#E78DAF] transition-colors inline-block hover:translate-x-1 duration-200">Fale Conosco</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4 uppercase text-sm tracking-wider">Localização & Contato</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-[#E78DAF]"><Icons.MapPin /></span>
                <span>
                  Bairro Lagomar<br/>
                  Macaé - RJ<br/>
                  <span className="text-xs text-gray-500 block mt-1">(Endereço completo pendente de confirmação)</span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E78DAF]"><Icons.WhatsApp /></span>
                <a href={`https://wa.me/${CONFIG.whatsapp}`} className="hover:text-[#E78DAF] transition-colors">(22) 90000-0000</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {CONFIG.nome}. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <StyleInjector />
      <Header />

      <main className="flex-grow">
        <Hero />
        <Categorias />
        <Destaques />
        <Sobre />
        <ChatBotLeadCapture />
      </main>

      <Footer />

      {/* Fab Button Mobile WhatsApp */}
      <a
        href={`https://wa.me/${CONFIG.whatsapp}`}
        className="md:hidden fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-xl z-40 hover:scale-110 transition-transform"
        aria-label="Falar no WhatsApp"
      >
        <Icons.WhatsApp />
      </a>
    </div>
  );
}
