import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  School,
  GraduationCap,
  Briefcase,
  DollarSign,
  Receipt,
  Award,
  Calendar,
  Clock,
  UserCheck,
  Megaphone,
  FileText,
  BookOpen,
  Bus,
  BarChart3,
  Sparkles,
  Settings,
  ChevronDown,
  Building2,
  ShieldAlert,
  Globe,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  roles?: UserRole[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    currentEstablishment,
    currentUser,
    students,
    payments,
    setViewMode,
    logout,
  } = useApp();

  const navSections: NavSection[] = [
    {
      title: 'Pilotage & Général',
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
        { id: 'reports', label: 'Rapports & Statistiques', icon: BarChart3 },
        { id: 'ai_assistant', label: 'Assistant IA Pédagogique', icon: Sparkles, badge: 'IA' },
      ],
    },
    {
      title: 'Scolarité & Pédagogie',
      items: [
        { id: 'students', label: 'Élèves', icon: Users, badge: students.length },
        { id: 'admissions', label: 'Inscriptions', icon: UserPlus },
        { id: 'classes', label: 'Classes & Niveaux', icon: School },
        { id: 'grades', label: 'Notes & Bulletins', icon: Award },
        { id: 'schedule', label: 'Emplois du temps', icon: Calendar },
        { id: 'attendance', label: 'Présences & Absences', icon: Clock },
      ],
    },
    {
      title: 'Ressources Humaines',
      items: [
        { id: 'teachers', label: 'Enseignants', icon: GraduationCap },
        { id: 'staff', label: 'Personnel & RH', icon: Briefcase },
      ],
    },
    {
      title: 'Finances & Caisse',
      items: [
        { id: 'finances', label: 'Frais & Comptabilité', icon: DollarSign },
        { id: 'payments', label: 'Paiements & Reçus', icon: Receipt, badge: payments.length },
      ],
    },
    {
      title: 'Espaces Dédiés',
      items: [
        { id: 'parent_portal', label: 'Espace Parents', icon: UserCheck },
        { id: 'student_portal', label: 'Espace Élèves', icon: GraduationCap },
      ],
    },
    {
      title: 'Vie Scolaire & Services',
      items: [
        { id: 'communication', label: 'Communication & SMS', icon: Megaphone },
        { id: 'documents', label: 'Documents Officiels', icon: FileText },
        { id: 'library', label: 'Bibliothèque & Stocks', icon: BookOpen },
        { id: 'transport_canteen', label: 'Transport & Cantine', icon: Bus },
      ],
    },
    {
      title: 'Système',
      items: [
        { id: 'settings', label: 'Paramètres & Établissement', icon: Settings },
        { id: 'audit', label: 'Sécurité & Journal d’audit', icon: ShieldAlert },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#142B49] text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-xl shadow-md text-white border border-white/20">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">ScolarCI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CI
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate font-medium">Gestion Scolaire Intégrée</p>
            </div>
          </div>
        </div>

        {/* School info snippet */}
        <div className="px-5 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-1">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-slate-200 truncate">{currentEstablishment.name}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{currentEstablishment.commune}, {currentEstablishment.city}</span>
            <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded font-mono font-medium">
              {currentEstablishment.currentYear}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </p>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-300'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white text-blue-900 font-bold'
                            : 'bg-white/10 text-slate-300 group-hover:bg-white/20'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Active user badge & quick actions at bottom */}
        <div className="p-4 border-t border-white/10 bg-white/5 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/50"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[11px] text-blue-300 truncate">{currentUser.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-white/10">
            <button
              onClick={() => {
                setViewMode('showcase');
                if (onCloseMobile) onCloseMobile();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-blue-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Site Vitrine</span>
            </button>
            <button
              onClick={() => {
                logout();
                if (onCloseMobile) onCloseMobile();
              }}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-red-500/30 hover:text-red-300 text-slate-300 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
