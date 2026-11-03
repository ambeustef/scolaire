import React, { useState } from 'react';
import {
  School,
  LogIn,
  UserPlus,
  ShieldCheck,
  Award,
  Users,
  GraduationCap,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Bus,
  Utensils,
  Laptop,
  HeartHandshake,
  FileCheck,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Moon,
  Sun,
  Lock,
  Menu,
  X,
  TreePine,
  Plus,
  Minus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LoginModal } from './LoginModal';
import { PreRegisterModal } from './PreRegisterModal';
import { UserRole } from '../../types';

export const ShowcaseView: React.FC = () => {
  const {
    currentEstablishment,
    isAuthenticated,
    currentUser,
    setViewMode,
    darkMode,
    toggleDarkMode,
    classes,
    students,
    teachers,
    login,
  } = useApp();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPreRegisterModal, setShowPreRegisterModal] = useState(false);
  const [defaultLoginRole, setDefaultLoginRole] = useState<UserRole | undefined>(undefined);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const navLinks = [
    { href: '#presentation', label: 'Présentation' },
    { href: '#portails', label: 'Portails Numériques', dot: true },
    { href: '#formations', label: 'Formations' },
    { href: '#viescolaire', label: 'Vie Scolaire' },
    { href: '#actualites', label: 'Actualités' },
    { href: '#contact', label: 'Contact' },
  ];

  // Quick contact form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Hero quick pre-registration form state
  const [heroName, setHeroName] = useState('');
  const [heroPhone, setHeroPhone] = useState('');
  const [heroLevel, setHeroLevel] = useState('');

  const handleHeroPreRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreRegisterModal(true);
  };

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const faqItems = [
    {
      q: "Comment inscrire mon enfant au Collège Moderne Bagohouo ?",
      a: "Cliquez sur « Demande de Pré-inscription », remplissez le formulaire en ligne (identité, classe souhaitée, contact). Le secrétariat vous recontacte sous 48h pour finaliser le dossier et le paiement.",
    },
    {
      q: "Comment consulter les notes et le bulletin de mon enfant ?",
      a: "Connectez-vous à l'Espace Parents avec les identifiants transmis par l'établissement. Les notes, moyennes et bulletins trimestriels y sont disponibles en temps réel, dès leur validation par le conseil de classe.",
    },
    {
      q: "Quels moyens de paiement sont acceptés pour la scolarité ?",
      a: "La scolarité peut être réglée en espèces au bureau de la comptabilité, ou via Mobile Money (Wave, Orange Money, MTN MoMo). Un reçu officiel numérique est émis instantanément après chaque versement.",
    },
    {
      q: "Que faire en cas d'absence ou de retard de mon enfant ?",
      a: "La Vie Scolaire enregistre chaque absence et retard dans la journée. Un parent reçoit automatiquement une notification, et peut déposer un justificatif directement depuis son espace.",
    },
  ];

  const handleOpenLoginWithRole = (role: UserRole) => {
    setDefaultLoginRole(role);
    setShowLoginModal(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone || !contactMessage) return;
    setContactSent(true);
    setTimeout(() => {
      setContactName('');
      setContactPhone('');
      setContactMessage('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white transition-colors">
      {/* 1. Official National Banner */}
      <div className="bg-[#0f1f35] text-white text-[11px] py-1.5 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-bold text-amber-400">RÉPUBLIQUE DE CÔTE D’IVOIRE</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Ministère de l’Éducation Nationale et de l’Alphabétisation</span>
            <span>·</span>
            <span className="text-white font-semibold">DRENA Duékoué</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-[10px]">
            <span>Année Scolaire {currentEstablishment.currentYear}</span>
            <span>·</span>
            <span>Tél: {currentEstablishment.phone}</span>
          </div>
        </div>
      </div>

      {/* Decorative strip — motif inspired by the Guémon region's woven pagne patterns,
          the forest canopy and the red laterite earth around Duékoué */}
      <div
        className="h-[5px] w-full shrink-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, #16A34A 0px, #16A34A 9px, #D97706 9px, #D97706 18px, #9A3412 18px, #9A3412 27px)',
        }}
        aria-hidden="true"
      />

      {/* 2. Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          {/* Logo & School Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 shrink">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#142B49] to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-900/20 ring-2 ring-blue-500/20 shrink-0">
              <School className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg xl:text-xl font-black text-slate-900 dark:text-white tracking-tight whitespace-nowrap truncate">
                {currentEstablishment.name}
              </h1>
              <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap truncate">
                {currentEstablishment.motto} · {currentEstablishment.city}
              </p>
            </div>
          </div>

          {/* Center Links (Desktop — shown once there is real room, so nothing ever wraps) */}
          <nav className="hidden xl:flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0 whitespace-nowrap">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <span>{link.label}</span>
                {link.dot && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Dark mode button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Mode sombre"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Pre-inscription button — icon only until there's room for the full label */}
            <button
              onClick={() => setShowPreRegisterModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shrink-0 whitespace-nowrap"
              title="Pré-inscription"
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="hidden xl:inline">Pré-inscription</span>
            </button>

            {/* Login / Access App button */}
            {isAuthenticated ? (
              <button
                onClick={() => setViewMode('app')}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <span className="hidden sm:inline">Accéder à l’Espace Gestion</span>
                <span className="sm:hidden">Espace</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setDefaultLoginRole(undefined);
                  setShowLoginModal(true);
                }}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#142B49] hover:bg-blue-900 active:scale-[0.98] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <LogIn className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Se Connecter</span>
              </button>
            )}

            {/* Mobile / tablet nav toggle — covers the range where the inline nav is hidden */}
            <button
              onClick={() => setShowMobileNav((v) => !v)}
              className="xl:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Ouvrir le menu"
            >
              {showMobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / tablet dropdown nav panel */}
        {showMobileNav && (
          <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex flex-col gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setShowMobileNav(false)}
                  className="flex items-center gap-2 px-2 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>{link.label}</span>
                  {link.dot && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                </a>
              ))}
              <button
                onClick={() => {
                  setShowMobileNav(false);
                  setShowPreRegisterModal(true);
                }}
                className="sm:hidden flex items-center gap-2 px-2 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Pré-inscription</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* 3. Hero Section — soft diagonal pastel gradient, text left / signup-style card right (à la Zoho) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-blue-50 to-indigo-100 py-16 sm:py-24">
        {/* Decorative Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#142B49_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Forested hills of the Guémon — Duékoué sits among green, cocoa-growing hills */}
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-28 sm:h-40 pointer-events-none"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,160 C180,100 320,190 520,130 C720,70 860,180 1060,120 C1240,65 1340,140 1440,110 L1440,220 L0,220 Z" fill="#16A34A" opacity="0.10" />
          <path d="M0,190 C220,140 380,210 600,160 C800,115 980,205 1200,150 C1320,120 1380,160 1440,150 L1440,220 L0,220 Z" fill="#15803D" opacity="0.15" />
          <path d="M0,210 C260,180 460,220 700,195 C920,172 1140,218 1440,190 L1440,220 L0,220 Z" fill="#064E3B" opacity="0.22" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-blue-200 text-xs font-semibold text-blue-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Portail Numérique Officiel · Année Scolaire {currentEstablishment.currentYear}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-emerald-200 text-xs font-semibold text-emerald-700">
                  <TreePine className="w-3.5 h-3.5" />
                  <span>Terre du Guémon</span>
                </div>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                La plateforme scolaire qui simplifie votre{' '}
                <span className="text-amber-600 underline decoration-amber-400/60 decoration-4">
                  quotidien
                </span>
                .
              </h2>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Bienvenue sur la plateforme officielle du <strong className="text-slate-900">{currentEstablishment.name}</strong>.
                Notes, assiduité, finances et communication réunis au même endroit,
                pour la direction, les enseignants, les parents et les élèves.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="#portails"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>Accéder aux Portails Scolaires</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <button
                  onClick={() => setShowPreRegisterModal(true)}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-300 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>Demande de Pré-inscription</span>
                </button>
              </div>

              {/* Reassurance bullet list */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Bulletins Officiels Numérisés</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Suivi d’assiduité en temps réel</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Paiements & Reçus sécurisés</span>
                </div>
              </div>
            </div>

            {/* Right Column: Quick pre-registration card (à la Zoho signup card) */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleHeroPreRegisterSubmit}
                className="relative rounded-3xl bg-white p-6 sm:p-7 border border-slate-200 shadow-2xl shadow-slate-900/10"
              >
                <p className="text-base font-black text-slate-900">Pré-inscription rapide</p>
                <p className="text-xs text-slate-500 mt-1">Démarrez votre dossier en moins d'une minute.</p>

                <div className="mt-5 space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Nom complet de l'élève</label>
                    <input
                      type="text"
                      required
                      value={heroName}
                      onChange={(e) => setHeroName(e.target.value)}
                      placeholder="Ex: Koffi Aya Marie"
                      className="mt-1 w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Numéro de téléphone du parent</label>
                    <input
                      type="tel"
                      required
                      value={heroPhone}
                      onChange={(e) => setHeroPhone(e.target.value)}
                      placeholder="+225 07 00 00 00 00"
                      className="mt-1 w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Classe souhaitée</label>
                    <select
                      value={heroLevel}
                      onChange={(e) => setHeroLevel(e.target.value)}
                      className="mt-1 w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden text-slate-700 bg-white"
                    >
                      <option value="">Sélectionner une classe</option>
                      <option>6ème</option>
                      <option>5ème</option>
                      <option>4ème</option>
                      <option>3ème</option>
                      <option>2nde</option>
                      <option>1ère</option>
                      <option>Terminale</option>
                    </select>
                  </div>
                </div>

                <p className="mt-3 text-[10px] text-slate-400 leading-relaxed">
                  En soumettant ce formulaire, vous acceptez d'être contacté par le secrétariat
                  du {currentEstablishment.name} pour finaliser votre dossier.
                </p>

                <button
                  type="submit"
                  className="mt-4 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  COMMENCER
                </button>

                <div className="mt-5 flex items-center gap-3">
                  <span className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">ou accès rapide démo</span>
                  <span className="flex-1 h-px bg-slate-100" />
                </div>

                <div className="mt-3 grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenLoginWithRole('directeur')}
                    title="Démo Direction"
                    className="flex items-center justify-center py-2.5 rounded-xl border border-slate-200 text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenLoginWithRole('enseignant')}
                    title="Démo Enseignant"
                    className="flex items-center justify-center py-2.5 rounded-xl border border-slate-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <GraduationCap className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenLoginWithRole('parent')}
                    title="Démo Parent"
                    className="flex items-center justify-center py-2.5 rounded-xl border border-slate-200 text-teal-600 hover:bg-teal-50 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenLoginWithRole('eleve')}
                    title="Démo Élève"
                    className="flex items-center justify-center py-2.5 rounded-xl border border-slate-200 text-sky-600 hover:bg-sky-50 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Key Stats Counter — floating card bridging the hero and the content below */}
      <section className="relative z-10 -mt-14 sm:-mt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-100 dark:border-slate-800 p-5 sm:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center lg:text-left lg:divide-x lg:divide-slate-100 dark:lg:divide-slate-800">
              <div className="lg:pr-6">
                <p className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">850+</p>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">Élèves Inscrits</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Premier cycle secondaire complet</p>
              </div>
              <div className="lg:px-6">
                <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">96.4%</p>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">Réussite au BEPC</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Parmi les meilleurs taux de la DRENA</p>
              </div>
              <div className="lg:px-6">
                <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">38</p>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">Enseignants & Éducateurs</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Professeurs certifiés de l'ENS</p>
              </div>
              <div className="lg:pl-6">
                <p className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400">100%</p>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">Suivi Numérique</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Notes, assiduité, cartes et reçus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4ter. Trust strip */}
      <section className="pt-12 pb-4 sm:pt-16 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500">
            Reconnu par les institutions et familles de Duékoué
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 grayscale opacity-60 dark:opacity-40">
            <span className="text-sm font-black text-slate-500 tracking-tight">Ministère de l'Éducation</span>
            <span className="text-sm font-black text-slate-500 tracking-tight">DRENA Duékoué</span>
            <span className="text-sm font-black text-slate-500 tracking-tight">COGES Bagohouo</span>
            <span className="text-sm font-black text-slate-500 tracking-tight">Sous-Préfecture</span>
            <span className="text-sm font-black text-slate-500 tracking-tight">APE Bagohouo</span>
          </div>
        </div>
      </section>

      {/* 6. Section Présentation & Mot du Directeur */}
      <section id="presentation" className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Photo du Directeur */}
            <div className="lg:col-span-5 text-center">
              <div className="relative inline-block">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&h=600&q=80"
                  alt="M. Kouadio Laurent, Directeur du Collège Moderne Bagohouo"
                  className="w-72 h-88 sm:w-80 sm:h-96 object-cover rounded-3xl shadow-2xl ring-8 ring-blue-500/10 mx-auto"
                />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#142B49] text-white py-2 px-5 rounded-2xl shadow-xl text-center whitespace-nowrap border border-blue-400/30">
                  <p className="text-xs font-black">M. Kouadio Laurent</p>
                  <p className="text-[10px] text-amber-300">Directeur du Collège Moderne Bagohouo</p>
                </div>
              </div>
            </div>

            {/* Texte et Valeurs Républicaines */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4" />
                <span>Le Mot du Chef d'Établissement</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                « L'éducation de qualité est le plus beau cadeau que nous puissions offrir aux enfants de Bagohouo. »
              </h3>

              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
                <p>
                  Chers parents, chers élèves, chers collègues enseignants,
                </p>
                <p>
                  Au <strong>{currentEstablishment.name}</strong>, notre engagement quotidien repose sur
                  trois piliers fondamentaux : la <em>discipline</em>, le <em>travail acharné</em> et la <em>recherche de l'excellence</em>.
                  Implanté au cœur de la belle région du Guémon, notre collège a pour vocation d'offrir
                  à chaque jeune fille et chaque jeune garçon un environnement d’apprentissage moderne,
                  sécurisé et propice à son épanouissement intellectuel et civique.
                </p>
                <p>
                  Grâce à cette plateforme numérique de gestion, nous franchissons un nouveau cap vers
                  la transparence totale et la proximité avec les familles. Vous pouvez désormais suivre
                  les résultats scolaires, les présences et la vie quotidienne de vos enfants en toute sérénité.
                </p>
              </div>

              {/* Three Value Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400">DISCIPLINE</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Respect des règles de la République et ponctualité exemplaire.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400">TRAVAIL</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Rigueur pédagogique, devoirs réguliers et encadrement attentif.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400">SUCCÈS</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Obtention du BEPC et orientation réussie vers le second cycle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PORTAILS D'ACCÈS NUMÉRIQUE (Main Requirement) */}
      <section id="portails" className="py-16 sm:py-20 bg-slate-100/70 dark:bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Espaces Utilisateurs Sécurisés</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Choisissez votre espace pour vous connecter
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Chaque membre de la communauté éducative accède à son espace personnalisé avec ses identifiants
              ou en un clic via nos comptes de démonstration pré-configurés.
            </p>
          </div>

          {/* Grid of Portals */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Espace Direction & Administration */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Direction & Administration
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  M. Kouadio Laurent (Directeur) et Mme Brou (Directrice des Études)
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Tableau de bord stratégique & effectifs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Délibérations de conseils de classe</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Gestion des enseignants et emplois du temps</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenLoginWithRole('directeur')}
                className="mt-6 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Connexion Espace Direction</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Espace Enseignants & Pédagogie */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Corps Enseignant & Pédagogie
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  M. Koné Ibrahim (Mathématiques) & Équipe pédagogique
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Saisie des notes (Devoirs & Compositions)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Appel numérique des présences du jour</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Cahier de texte et appréciations d'élèves</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenLoginWithRole('enseignant')}
                className="mt-6 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Connexion Espace Enseignant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3. Espace Parents d'Élèves */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Portail Familles & Parents
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  M. Koffi Jérôme (Parent d'élève) et Association COGES
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Consultation instantanée des notes et moyennes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Téléchargement des bulletins trimestriels officiels</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Suivi des paiements et solde de scolarité</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenLoginWithRole('parent')}
                className="mt-6 w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Connexion Espace Parents</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4. Espace Élèves */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Espace Apprenants & Élèves
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Koffi Aya Marie (Tle D) & Élèves du collège
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Emploi du temps de la semaine et salles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Devoirs à la maison et calendrier des examens</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Carte scolaire numérique avec QR Code</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenLoginWithRole('eleve')}
                className="mt-6 w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Connexion Espace Élève</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 5. Espace Comptabilité & Trésorerie */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Comptabilité & Intendance
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  M. Silué Yacouba (Chef Comptable)
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Encaissement scolarité (Espèces, Wave, MoMo)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Émission instantanée des reçus officiels REC</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Journal de caisse, dépenses et suivi des impayés</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenLoginWithRole('comptable')}
                className="mt-6 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Connexion Comptabilité</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 6. Vie Scolaire & Surveillance Générale */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Vie Scolaire & Discipline
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  M. Dago Marcellin (Surveillant Général)
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Contrôle des retards et justificatifs d’absence</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Délivrance des billets d’entrée en classe</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Notification immédiate aux parents d’élèves</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenLoginWithRole('surveillant')}
                className="mt-6 w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Connexion Vie Scolaire</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section Formations & Niveaux */}
      <section id="formations" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              Cursus Pédagogique Conforme au Programme National
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Cycles d'Enseignement Secondaire à Bagohouo
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Un encadrement complet de la classe de 6ème jusqu'aux classes de 3ème et second cycle,
              avec des coefficients officiels et un suivi personnalisé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">6ème</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                Accueil & Fondamentaux
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Transition fluide depuis le primaire (CM2), renforcement du français, des mathématiques
                et initiation aux sciences physiques et d'observation.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                Effectif moyen : 45 élèves / classe
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">5ème</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                Approfondissement
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Consolidation des compétences scientifiques et littéraires, éveil à l'anglais
                et aux technologies de l'information et de la communication.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                Salles spécialisées disponibles
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">4ème</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                Langues & Esprit Critique
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Introduction de la seconde langue vivante (Espagnol / Allemand), travaux dirigés
                en physique-chimie et SVT.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                Professeurs principaux dédiés
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-md relative overflow-hidden">
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[9px] font-bold text-blue-700 dark:text-blue-300">
                Examen BEPC
              </div>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">3ème</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                Préparation Intensive
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Devoirs communs hebdomadaires, examens blancs régionaux (DRENA Duékoué)
                et préparation complète aux épreuves orales et écrites.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Taux de réussite record
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Section Vie Scolaire & Infrastructures */}
      <section id="viescolaire" className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              Cadre de Vie & Épanouissement
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Infrastructures et Services Dédiés aux Élèves
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Des équipements modernes conçus pour offrir aux enfants les meilleures conditions de travail.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                <Utensils className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Cantine Scolaire</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Repas chauds, sains et équilibrés servis à midi du lundi au vendredi
                pour préserver la santé et l'énergie des élèves.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                <Bus className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Transport Scolaire</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Ramassage sécurisé desservant les localités du canton de Bagohouo
                et les axes principaux vers Duékoué.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Bibliothèque & CDI</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Plus de 1 200 manuels scolaires, romans africains, dictionnaires et annales
                pour la recherche et la lecture.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <Laptop className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Salle Informatique</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Postes informatiques connectés avec initiation aux logiciels de bureautique
                et aux compétences du XXIe siècle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Actualités & Annonces Officielles */}
      <section id="actualites" className="py-16 sm:py-20 bg-slate-100/70 dark:bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Vie de l'Établissement
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Dernières Actualités & Avis Officiels
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Année 2024-2025 · Bagohouo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Calendrier Pédagogique
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Arrêt des notes du 1er Trimestre et Délibérations
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Les conseils de classe se tiendront du 18 au 22 novembre. Les bulletins seront téléchargeables
                  sur l'Espace Parents dès le 25 novembre.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Direction des Études</span>
                <span>Novembre 2024</span>
              </div>
            </article>

            <article className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Vie Scolaire & COGES
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Assemblée Générale de Rentrée avec les Parents
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Rencontre avec le Comité de Gestion des Établissements Scolaires (COGES) dans la cour d'honneur
                  pour faire le bilan des investissements et de la cantine.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Secrétariat Général</span>
                <span>Octobre 2024</span>
              </div>
            </article>

            <article className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Excellence Républicaine
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Cérémonie de Salut aux Couleurs Nationales
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tous les lundis matin à 07h15 précises : montée des couleurs et hymne national l'Abidjanaise,
                  en présence de l'ensemble des élèves et du corps enseignant.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Surveillance Générale</span>
                <span>Hebdomadaire</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 10. Section Contact & Localisation */}
      <section id="contact" className="py-16 sm:py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact details */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Localisation & Renseignements
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Nous Contacter & Nous Rendre Visite
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Le secrétariat du <strong>{currentEstablishment.name}</strong> vous accueille
                pour toute démarche administrative, inscription ou demande d'attestation.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Adresse Physique</p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {currentEstablishment.address}, Bagohouo (Sous-préfecture de Duékoué, Région du Guémon)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Ligne Téléphonique</p>
                    <p className="text-slate-500 dark:text-slate-400">{currentEstablishment.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Courrier Électronique</p>
                    <p className="text-slate-500 dark:text-slate-400">{currentEstablishment.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick message form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Laisser un message au secrétariat
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                  Posez vos questions sur les inscriptions, les bourses scolaires ou le calendrier académique.
                </p>

                {contactSent ? (
                  <div className="p-6 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                      Votre message a été transmis avec succès au secrétariat du collège.
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      Notre équipe vous recontactera dans les plus brefs délais au {contactPhone}.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Nom & Prénoms *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: M. KOUADIO Jean"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Numéro de Téléphone *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="+225 07 00 00 00 00"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Votre Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Écrivez votre demande ici..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Transmettre mon message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10bis. CTA Banner — big rounded gradient card, à la Zoho "Faites-nous confiance !" */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-100 via-indigo-100 to-amber-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-amber-900/20 px-6 sm:px-14 py-14 sm:py-20 text-center">
            <div
              className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#142B49_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-blue-200 text-xs font-semibold text-blue-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Rentrée {currentEstablishment.currentYear}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-blue-900 dark:text-white tracking-tight leading-tight">
                Faites-nous confiance !
              </h3>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-xl mx-auto">
                Déposez une demande de pré-inscription en ligne ou accédez directement à votre
                espace si vous faites déjà partie du {currentEstablishment.name}.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowPreRegisterModal(true)}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Demande de Pré-inscription</span>
                </button>
                <a
                  href="#portails"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-300 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>Accéder aux Portails Scolaires</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10ter. FAQ */}
      <section className="pb-16 sm:pb-24 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Questions fréquentes
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Vous ne trouvez pas de réponse ? Contactez le secrétariat ci-dessous.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={item.q}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                  >
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.q}</span>
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="bg-[#0f1f35] text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <School className="w-5 h-5 text-amber-300" />
                <span className="font-extrabold text-sm">{currentEstablishment.name}</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Établissement public d'enseignement secondaire général.
                Sous la tutelle de la DRENA Duékoué et du Ministère de l'Éducation Nationale.
              </p>
              <p className="text-amber-300 font-serif italic text-[11px]">{currentEstablishment.motto}</p>
            </div>

            <div>
              <p className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Accès Portails</p>
              <ul className="space-y-2 text-slate-400 text-[11px]">
                <li>
                  <button onClick={() => handleOpenLoginWithRole('directeur')} className="hover:text-white">
                    Espace Direction
                  </button>
                </li>
                <li>
                  <button onClick={() => handleOpenLoginWithRole('enseignant')} className="hover:text-white">
                    Espace Enseignants
                  </button>
                </li>
                <li>
                  <button onClick={() => handleOpenLoginWithRole('parent')} className="hover:text-white">
                    Portail Parents d'Élèves
                  </button>
                </li>
                <li>
                  <button onClick={() => handleOpenLoginWithRole('eleve')} className="hover:text-white">
                    Espace Élèves
                  </button>
                </li>
                <li>
                  <button onClick={() => handleOpenLoginWithRole('comptable')} className="hover:text-white">
                    Espace Comptable
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Informations Pratiques</p>
              <ul className="space-y-2 text-slate-400 text-[11px]">
                <li>Horaires : 07h30 - 17h30</li>
                <li>Code Établissement : {currentEstablishment.code}</li>
                <li>Région : Guémon · DRENA Duékoué</li>
                <li>Cantine & Transport disponibles</li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Connexion Rapide</p>
              <p className="text-slate-400 text-[11px] mb-3">
                Accédez à l’environnement de gestion scolaire en un clic.
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Ouvrir la session</span>
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} {currentEstablishment.name}. Tous droits réservés.</p>
            <p>Conçu pour l'enseignement en République de Côte d'Ivoire · ScolarCI v2.4</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          defaultRole={defaultLoginRole}
        />
      )}

      {/* Pre-registration Modal */}
      {showPreRegisterModal && (
        <PreRegisterModal onClose={() => setShowPreRegisterModal(false)} />
      )}
    </div>
  );
};
