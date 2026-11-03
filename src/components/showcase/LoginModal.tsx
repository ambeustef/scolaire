import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Users,
  CreditCard,
  Clock,
  School,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS, ROLE_CONFIGS } from '../../data/initialData';
import { UserRole } from '../../types';

interface LoginModalProps {
  onClose: () => void;
  defaultRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, defaultRole }) => {
  const { login, currentEstablishment } = useApp();

  const [activeTab, setActiveTab] = useState<'credentials' | 'demo'>(defaultRole ? 'demo' : 'credentials');
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole || 'directeur');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill credential fields when selecting a role in credentials tab
  const handleSelectDemoUser = (userRole: UserRole) => {
    setSelectedRole(userRole);
    const u = DEMO_USERS.find((user) => user.role === userRole);
    if (u) {
      setEmail(u.email);
      setPassword('••••••••••');
    }
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Veuillez saisir votre adresse email ou votre matricule.');
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      // Find matching demo user or use typed credentials
      const matched = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (matched) {
        login(matched.role);
      } else {
        login(undefined, { email, name: email.split('@')[0] });
      }
      setLoading(false);
      onClose();
    }, 400);
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    setLoading(true);
    setTimeout(() => {
      login(role);
      setLoading(false);
      onClose();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-[#142B49] text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner">
                <School className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 block">
                  Portail Numérique Officiel
                </span>
                <h2 className="text-xl font-black text-white">{currentEstablishment.name}</h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Accès sécurisé aux espaces pédagogiques et administratifs
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab selector */}
          <div className="flex items-center gap-2 mt-6 p-1 bg-white/10 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('credentials')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all text-center ${
                activeTab === 'credentials'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Connexion avec identifiants
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === 'demo'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Accès rapide par rôle (Démo)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Standard Credentials Form */}
        {activeTab === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Identifiant ou Email institutionnel *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="ex: directeur@cm-bagohouo.ci ou matricule élève"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mot de passe *
                </label>
                <button
                  type="button"
                  onClick={() => alert("Pour la version de démonstration, utilisez n'importe quel mot de passe ou cliquez sur 'Accès rapide par rôle'.")}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Mémoriser ma session</span>
              </label>

              <span className="text-slate-400 text-[11px]">Connexion chiffrée SSL/TLS</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ouvrir ma session</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Helper Badges */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Pré-remplir avec un profil de test :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { role: 'directeur' as UserRole, label: 'Directeur' },
                  { role: 'enseignant' as UserRole, label: 'Enseignant' },
                  { role: 'parent' as UserRole, label: 'Parent d’élève' },
                  { role: 'eleve' as UserRole, label: 'Élève' },
                  { role: 'comptable' as UserRole, label: 'Comptable' },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleSelectDemoUser(item.role)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 text-slate-600 dark:text-slate-300 font-semibold transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Fast 1-Click Role Login */}
        {activeTab === 'demo' && (
          <div className="p-6 sm:p-7 max-h-[60vh] overflow-y-auto space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Cliquez directement sur l’un des 9 profils officiels pour vous connecter instantanément et tester l’espace correspondant :
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_USERS.map((user) => {
                const config = ROLE_CONFIGS.find((r) => r.id === user.role);
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleQuickRoleLogin(user.role)}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-blue-500 hover:shadow-md transition-all text-left flex items-center gap-3 group cursor-pointer"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-500 transition-all shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 truncate">
                          {config?.label}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Plateforme ScolarCI v2.4</span>
          <span>DRENA Duékoué · IEP Bagohouo</span>
        </div>
      </div>
    </div>
  );
};
