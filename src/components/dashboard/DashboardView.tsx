import React from 'react';
import {
  Users,
  GraduationCap,
  School,
  Briefcase,
  DollarSign,
  TrendingUp,
  Clock,
  UserCheck,
  UserX,
  AlertCircle,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DashboardViewProps {
  onSelectStudent?: (studentId: string) => void;
  onOpenReceipt?: (paymentId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectStudent,
  onOpenReceipt,
}) => {
  const {
    students,
    teachers,
    classes,
    staff,
    payments,
    expenses,
    feePlans,
    attendance,
    formatFCFA,
    currentEstablishment,
    setActiveTab,
  } = useApp();

  // Calculations
  const totalStudents = students.length;
  const boysCount = students.filter((s) => s.gender === 'M').length;
  const girlsCount = students.filter((s) => s.gender === 'F').length;
  const boysPercent = totalStudents > 0 ? Math.round((boysCount / totalStudents) * 100) : 0;
  const girlsPercent = totalStudents > 0 ? Math.round((girlsCount / totalStudents) * 100) : 0;

  const totalTeachers = teachers.length;
  const totalClasses = classes.length;
  const totalStaff = staff.length;

  // Financial totals
  const totalEncaisse = payments.reduce((acc, p) => acc + p.amount, 0);

  // Total theoretical fees based on all active students and their class cycle fee plan
  const totalTheorique = students.reduce((acc, st) => {
    const cls = classes.find((c) => c.id === st.classId);
    const plan = feePlans.find((p) => p.cycle === cls?.cycle) || feePlans[0];
    const base = plan ? plan.total : 450000;
    const discount = (base * (st.scholarshipPercent || 0)) / 100;
    return acc + (base - discount);
  }, 0);

  const totalImpayes = Math.max(0, totalTheorique - totalEncaisse);
  const tauxRecouvrement = totalTheorique > 0 ? Math.round((totalEncaisse / totalTheorique) * 100) : 0;

  // Total expenses
  const totalDepenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const soldeNetCaisse = totalEncaisse - totalDepenses;

  // Today's attendance
  const todayAttendance = attendance.filter((a) => a.date === '2024-11-04');
  const presentCount = todayAttendance.filter((a) => a.status === 'present').length;
  const absentCount = todayAttendance.filter((a) => a.status === 'absent').length;
  const lateCount = todayAttendance.filter((a) => a.status === 'retard').length;

  // Payment methods breakdown
  const methodTotals: Record<string, number> = {
    wave: 0,
    orange_money: 0,
    mtn_momo: 0,
    especes: 0,
    cheque: 0,
    virement: 0,
  };
  payments.forEach((p) => {
    if (methodTotals[p.paymentMethod] !== undefined) {
      methodTotals[p.paymentMethod] += p.amount;
    }
  });

  const recentPayments = payments.slice(0, 5);
  const recentStudents = students.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#142B49] via-blue-900 to-indigo-900 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Année Scolaire {currentEstablishment.currentYear} • Trimestre 1 en cours
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tableau de Bord Général
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Bienvenue sur le portail de gestion de <span className="text-white font-semibold">{currentEstablishment.name}</span>. Vue synthétique des effectifs, finances FCFA et de l’assiduité.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('ai_assistant')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-xs shadow-lg hover:shadow-cyan-500/25 hover:brightness-110 transition-all border border-white/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Diagnostic IA de l’École</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all border border-white/20"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Rapports Complets</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 translate-y-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Élèves Total */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Élèves
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalStudents}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +100% Démo
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Filles : <strong className="text-slate-700 dark:text-slate-200">{girlsCount} ({girlsPercent}%)</strong></span>
            <span>Garçons : <strong className="text-slate-700 dark:text-slate-200">{boysCount} ({boysPercent}%)</strong></span>
          </div>
        </div>

        {/* Recouvrement Financier */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Frais Encaissés
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white block truncate">
              {formatFCFA(totalEncaisse)}
            </span>
            <div className="mt-2 w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, tauxRecouvrement)}%` }}
              />
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Taux : <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{tauxRecouvrement}%</strong></span>
            <span>Reste : <strong className="text-red-500 font-medium">{formatFCFA(totalImpayes)}</strong></span>
          </div>
        </div>

        {/* Corps Professoral & Classes */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Enseignants & Pédagogie
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalTeachers}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              professeurs actifs
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Classes : <strong className="text-slate-700 dark:text-slate-200">{totalClasses}</strong></span>
            <span>Personnel RH : <strong className="text-slate-700 dark:text-slate-200">{totalStaff}</strong></span>
          </div>
        </div>

        {/* Présences du jour */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Présences du Jour
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {presentCount + lateCount} / {todayAttendance.length || totalStudents}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              92%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">{lateCount} Retard(s)</span>
            <span className="text-red-500 font-semibold">{absentCount} Absent(s)</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Visual Breakdown & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recettes par mode de paiement (Mobile Money Wave / Orange / MTN / etc.) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Répartition des Encaissements
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">En FCFA</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Wave CI (Mobile Money)
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{formatFCFA(methodTotals.wave)}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${totalEncaisse > 0 ? (methodTotals.wave / totalEncaisse) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Orange Money
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{formatFCFA(methodTotals.orange_money)}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full"
                  style={{ width: `${totalEncaisse > 0 ? (methodTotals.orange_money / totalEncaisse) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Espèces (Caisse Centrale)
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{formatFCFA(methodTotals.especes)}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${totalEncaisse > 0 ? (methodTotals.especes / totalEncaisse) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Virement Bancaire & Chèque
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatFCFA(methodTotals.virement + methodTotals.cheque)}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full"
                  style={{
                    width: `${totalEncaisse > 0 ? ((methodTotals.virement + methodTotals.cheque) / totalEncaisse) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> MTN MoMo
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{formatFCFA(methodTotals.mtn_momo)}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-yellow-500 h-full rounded-full"
                  style={{ width: `${totalEncaisse > 0 ? (methodTotals.mtn_momo / totalEncaisse) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Solde net caisse & banque :</span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
              {formatFCFA(soldeNetCaisse)}
            </span>
          </div>
        </div>

        {/* Derniers Paiements Enregistrés */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              Derniers Paiements Reçus & Reçus Officiels
            </h2>
            <button
              onClick={() => setActiveTab('payments')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="pb-3">N° Reçu</th>
                  <th className="pb-3">Élève & Classe</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Mode</th>
                  <th className="pb-3 text-right">Montant</th>
                  <th className="pb-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {recentPayments.map((p) => {
                  const student = students.find((s) => s.id === p.studentId);
                  const cls = classes.find((c) => c.id === p.classId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                      <td className="py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {p.receiptNumber}
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                          {student ? `${student.firstName} ${student.lastName}` : 'Élève'}
                        </div>
                        <div className="text-[11px] text-slate-400">{cls?.name || 'Classe'}</div>
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{p.date}</td>
                      <td className="py-3">
                        <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {p.paymentMethod.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 text-right font-extrabold text-slate-900 dark:text-white">
                        {formatFCFA(p.amount)}
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => {
                            if (onOpenReceipt) onOpenReceipt(p.id);
                            else setActiveTab('payments');
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                          title="Imprimer le reçu"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Registrations & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dernières Inscriptions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Derniers Élèves Inscrits
            </h2>
            <button
              onClick={() => setActiveTab('students')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Répertoire complet</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentStudents.map((st) => {
              const cls = classes.find((c) => c.id === st.classId);
              return (
                <div
                  key={st.id}
                  onClick={() => {
                    if (onSelectStudent) onSelectStudent(st.id);
                    else setActiveTab('students');
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 hover:bg-blue-50/60 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-slate-600"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={st.photoUrl}
                      alt={st.lastName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                    />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">
                        {st.firstName} {st.lastName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span className="font-mono text-blue-600 dark:text-blue-400 font-medium">{st.matricule}</span>
                        <span>•</span>
                        <span>{cls?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      Inscrit
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">{st.parentPhone}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Tools & Reminders */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Échéances & Rappels Ministériels
            </h2>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/60">
                <span className="font-bold text-blue-900 dark:text-blue-200 block">
                  Arrêt des notes 1er Trimestre
                </span>
                <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-1">
                  Clôture des saisies le vendredi 6 décembre 2024 à 18h00 pour les délibérations.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/60">
                <span className="font-bold text-amber-900 dark:text-amber-200 block">
                  Examen Blanc BEPC & BAC
                </span>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                  Épreuves de niveau régionales programmées pour les classes de 3ème et Terminale.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/60">
                <span className="font-bold text-purple-900 dark:text-purple-200 block">
                  Assistant IA Pédagogique
                </span>
                <p className="text-[11px] text-purple-700 dark:text-purple-300 mt-1">
                  Générez automatiquement les appréciations des bulletins en 1 clic.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('grades')}
            className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-xs"
          >
            Accéder à la saisie des notes
          </button>
        </div>
      </div>
    </div>
  );
};
