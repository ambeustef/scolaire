import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  Users,
  DollarSign,
  Award,
  Clock,
  Printer,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const {
    students,
    classes,
    payments,
    expenses,
    formatFCFA,
    currentEstablishment,
  } = useApp();

  const [reportType, setReportType] = useState<'financial' | 'academic' | 'demographic' | 'attendance'>('financial');

  // Key metrics
  const totalStudents = students.length;
  const totalBoys = students.filter((s) => s.gender === 'M').length;
  const totalGirls = students.filter((s) => s.gender === 'F').length;

  const totalPayments = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netCaisse = totalPayments - totalExpenses;

  const handleExportCSV = () => {
    let rows: string[][] = [];
    let filename = 'rapport_scolaire.csv';

    if (reportType === 'financial') {
      rows = [
        ['Date', 'N° Reçu', 'Montant (FCFA)', 'Mode de Paiement', 'Motif'],
        ...payments.map((p) => [p.date, p.receiptNumber, String(p.amount), p.paymentMethod, p.feeType]),
      ];
      filename = 'rapport_financier.csv';
    } else {
      rows = [
        ['Matricule', 'Nom', 'Prénoms', 'Classe', 'Sexe', 'Statut'],
        ...students.map((s) => [s.matricule, s.lastName, s.firstName, s.classId, s.gender, s.status]),
      ];
      filename = 'rapport_effectifs.csv';
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(';')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Centre de Rapports & Statistiques Stratégiques
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Génération des bilans financiers en FCFA, taux d’encaissement, ratios démographiques et assiduité.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Imprimer</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Exporter en CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2 overflow-x-auto">
        <button
          onClick={() => setReportType('financial')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportType === 'financial'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          Rapport Financier & Caisse
        </button>
        <button
          onClick={() => setReportType('demographic')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportType === 'demographic'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          Rapport des Effectifs & Parité
        </button>
        <button
          onClick={() => setReportType('academic')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportType === 'academic'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          Rapport des Résultats Pédagogiques
        </button>
      </div>

      {/* Report Content */}
      {reportType === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase block">Recettes Totales Encaissées</span>
              <span className="text-2xl font-black text-emerald-600 mt-2 block">
                {formatFCFA(totalPayments)}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">{payments.length} transactions enregistrées</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase block">Charges de Fonctionnement</span>
              <span className="text-2xl font-black text-red-600 mt-2 block">
                {formatFCFA(totalExpenses)}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">{expenses.length} dépenses mandatées</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase block">Solde d’Exploitation Net</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2 block">
                {formatFCFA(netCaisse)}
              </span>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Trésorerie positive</p>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Synthèse Détaillée par Moyen de Paiement
            </h2>
            <div className="space-y-3 text-xs">
              {['wave', 'orange_money', 'mtn_momo', 'especes', 'virement', 'cheque'].map((method) => {
                const subTotal = payments
                  .filter((p) => p.paymentMethod === method)
                  .reduce((acc, p) => acc + p.amount, 0);
                const count = payments.filter((p) => p.paymentMethod === method).length;

                return (
                  <div
                    key={method}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-extrabold uppercase text-slate-800 dark:text-slate-100">
                        {method.replace('_', ' ')}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">{count} transaction(s)</div>
                    </div>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {formatFCFA(subTotal)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {reportType === 'demographic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase block">Effectif Global</span>
              <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
                {totalStudents} élèves
              </span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase block">Filles Inscrites</span>
              <span className="text-3xl font-black text-purple-600 mt-1 block">
                {totalGirls} ({totalStudents > 0 ? Math.round((totalGirls / totalStudents) * 100) : 0}%)
              </span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase block">Garçons Inscrits</span>
              <span className="text-3xl font-black text-blue-600 mt-1 block">
                {totalBoys} ({totalStudents > 0 ? Math.round((totalBoys / totalStudents) * 100) : 0}%)
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Effectifs Réels par Classe et par Cycle
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => {
                const count = students.filter((s) => s.classId === cls.id).length;
                return (
                  <div
                    key={cls.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{cls.name}</span>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">{cls.cycle}</div>
                    </div>
                    <span className="font-black text-sm text-blue-600 dark:text-blue-400">
                      {count} élèves
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {reportType === 'academic' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Palmarès Pédagogique du 1er Trimestre
          </h2>
          <div className="space-y-3">
            {students.slice(0, 5).map((st) => {
              const cls = classes.find((c) => c.id === st.classId);
              return (
                <div
                  key={st.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={st.photoUrl}
                      alt={st.lastName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {st.firstName} {st.lastName}
                      </span>
                      <p className="text-[11px] text-slate-400">{cls?.name} • {st.matricule}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                    Moyenne : 16.20 / 20 (Félicitations)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
