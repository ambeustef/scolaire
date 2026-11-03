import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Lock,
  Clock,
  User,
  Activity,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuditView: React.FC = () => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(
    (l) =>
      !search ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-600" />
            Sécurité, Traçabilité & Journal d’Audit
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Traçabilité inaltérable des opérations sensibles : encaissements FCFA, saisies de notes et modifications administratives.
          </p>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
            <span>CONTRÔLE D’ACCÈS RBAC</span>
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-2 block">
            9 Profils Métiers
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Permissions granulaires cloisonnées</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
            <Lock className="w-4 h-4" />
            <span>PROTECTION DES DONNÉES</span>
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-2 block">
            Conformité ARTCI (Côte d’Ivoire)
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Données personnelles et scolarité</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600">
            <Activity className="w-4 h-4" />
            <span>JOURNAL DES TRANSACTIONS</span>
          </div>
          <span className="text-xl font-extrabold text-purple-600 mt-2 block">
            {auditLogs.length} Événements
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Horodatage précis à la seconde</p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrer les journaux d'audit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Horodatage</th>
                <th className="py-3 px-4">Utilisateur / Profil</th>
                <th className="py-3 px-4">Opération Effectuée</th>
                <th className="py-3 px-4">Détails de l’Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {log.userName}
                    </span>
                    <span className="text-[10px] text-slate-400">{log.role}</span>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span className="font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700 dark:text-slate-300 text-xs">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
