import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  School,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  PlusCircle,
  Receipt,
  UserPlus,
  Clock,
  Sparkles,
  Globe,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ROLE_CONFIGS } from '../../data/initialData';
import { UserRole } from '../../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenQuickPayment?: () => void;
  onOpenQuickRegister?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenQuickPayment,
  onOpenQuickRegister,
}) => {
  const {
    currentUser,
    switchRole,
    currentEstablishment,
    establishments,
    setEstablishmentId,
    searchQuery,
    setSearchQuery,
    darkMode,
    toggleDarkMode,
    notifications,
    markNotificationRead,
    setActiveTab,
    setViewMode,
    logout,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showSchoolMenu, setShowSchoolMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const schoolMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setShowRoleMenu(false);
      }
      if (schoolMenuRef.current && !schoolMenuRef.current.contains(event.target as Node)) {
        setShowSchoolMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un élève, matricule, classe, reçu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border-none focus:outline-hidden focus:ring-2 focus:ring-blue-500 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action Button for Cashier / Inscription */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => {
                if (onOpenQuickPayment) onOpenQuickPayment();
                else setActiveTab('payments');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg text-xs font-semibold transition-all border border-blue-200 dark:border-blue-800 shadow-2xs"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Nouveau Reçu</span>
            </button>
            <button
              onClick={() => {
                if (onOpenQuickRegister) onOpenQuickRegister();
                else setActiveTab('admissions');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg text-xs font-semibold transition-all border border-emerald-200 dark:border-emerald-800 shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Inscrire</span>
            </button>
          </div>

          {/* School Switcher */}
          <div className="relative" ref={schoolMenuRef}>
            <button
              onClick={() => setShowSchoolMenu(!showSchoolMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
            >
              <School className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden md:inline font-semibold max-w-[180px] truncate">
                {currentEstablishment.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showSchoolMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in zoom-in-95">
                <p className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Établissement actif
                </p>
                {establishments.map((est) => (
                  <button
                    key={est.id}
                    onClick={() => {
                      setEstablishmentId(est.id);
                      setShowSchoolMenu(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition-colors flex items-start gap-2.5 ${
                      est.id === currentEstablishment.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <School className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
                    <div>
                      <div className="font-semibold">{est.name}</div>
                      <div className="text-[11px] text-slate-400">{est.commune}, {est.city} • {est.currentYear}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Switcher (Crucial for testing all 9 user roles in demo mode!) */}
          <div className="relative" ref={roleMenuRef}>
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-105 rounded-lg text-xs font-semibold shadow-xs transition-all"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Rôle :</span>
              <span className="max-w-[110px] truncate">{currentUser.title.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-white/80" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Simulateur de Profils</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                      Mode Démo
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Testez les permissions et les vues spécifiques à chaque métier scolaire.
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto py-1 space-y-1">
                  {ROLE_CONFIGS.map((rc) => {
                    const isSelected = currentUser.role === rc.id;
                    return (
                      <button
                        key={rc.id}
                        onClick={() => {
                          switchRole(rc.id);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isSelected ? (
                            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold flex items-center justify-between">
                            <span>{rc.label}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {rc.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications ({unreadNotifs})</span>
                  <button
                    onClick={() => notifications.forEach((n) => markNotificationRead(n.id))}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    Tout marquer comme lu
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-100 dark:divide-slate-700/50">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-lg text-xs transition-colors cursor-pointer flex gap-2.5 ${
                        !n.read ? 'bg-blue-50/60 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {n.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        ) : n.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Info className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                          <span className="truncate">{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal shrink-0">{n.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Site Vitrine Public Portal Button */}
          <button
            onClick={() => setViewMode('showcase')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Consulter le site vitrine officiel du Collège"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Site Vitrine</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Basculer le mode sombre"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title="Se déconnecter et retourner au portail vitrine"
            aria-label="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
