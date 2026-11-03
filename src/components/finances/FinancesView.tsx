import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  X,
  CheckCircle,
  FileText,
  Building,
  CreditCard,
  Edit2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExpenseRecord, PaymentMethod } from '../../types';

export const FinancesView: React.FC = () => {
  const {
    feePlans,
    updateFeePlan,
    payments,
    expenses,
    addExpense,
    formatFCFA,
    currentUser,
  } = useApp();

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  // New Expense form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseRecord['category']>('fournitures');
  const [amount, setAmount] = useState<number>(50000);
  const [beneficiary, setBeneficiary] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('especes');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Totals
  const totalRecettes = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalDepenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const soldeNet = totalRecettes - totalDepenses;

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount <= 0) return;

    addExpense({
      title,
      category,
      amount: Number(amount),
      date,
      beneficiary: beneficiary || 'Fournisseur / Prestataire',
      paymentMethod,
      status: 'paye',
      approvedBy: currentUser.name,
    });

    setShowAddExpense(false);
    setTitle('');
    setBeneficiary('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            Comptabilité & Grille Tarifaire FCFA
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pilotage de la trésorerie, gestion des tarifs par cycle et journal des charges de fonctionnement.
          </p>
        </div>

        <button
          onClick={() => setShowAddExpense(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-md shadow-red-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Enregistrer une Dépense</span>
        </button>
      </div>

      {/* Financial Health Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>TOTAL RECETTES ENCAISSÉES</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-2 block">
            {formatFCFA(totalRecettes)}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Frais scolarité, inscriptions et annexes</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400">
            <span>TOTAL DÉPENSES ENGAGÉES</span>
            <TrendingDown className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-2 block">
            {formatFCFA(totalDepenses)}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Salaires, fournitures et factures courantes</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
            <span>SOLDE DISPONIBLE EN CAISSE</span>
            <Building className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2 block">
            {formatFCFA(soldeNet)}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Solde net d’exploitation</p>
        </div>
      </div>

      {/* Fee Plans by Cycle (Section 8) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Grille Officielle des Frais Scolaires (Par Cycle)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feePlans.map((plan) => (
            <div
              key={plan.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {plan.level}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  {plan.cycle}
                </span>
              </div>

              <div className="space-y-2 text-xs py-2">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Droit d’inscription :</span>
                  <strong>{formatFCFA(plan.registrationFee)}</strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Scolarité annuelle :</span>
                  <strong>{formatFCFA(plan.tuitionFee)}</strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Frais annexes (rame, tenue) :</span>
                  <strong>{formatFCFA(plan.annexFees)}</strong>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Total Annuel :</span>
                <span className="text-base font-black text-blue-600 dark:text-blue-400">
                  {formatFCFA(plan.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses Journal */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Journal des Dépenses & Sorties de Caisse
          </h2>
          <span className="text-xs text-slate-400 font-semibold">{expenses.length} opérations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Motif / Libellé</th>
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4">Bénéficiaire</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {e.title}
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {e.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{e.beneficiary}</td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{e.date}</td>
                  <td className="py-3 px-4 uppercase font-medium">{e.paymentMethod}</td>
                  <td className="py-3 px-4 text-right font-black text-red-600 dark:text-red-400">
                    - {formatFCFA(e.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Expense */}
      {showAddExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Enregistrer une Dépense
              </h3>
              <button
                onClick={() => setShowAddExpense(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Libellé de la dépense *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Facture CIE Électricité ou Achat rames"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Montant (FCFA) *
                  </label>
                  <input
                    type="number"
                    step={1000}
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="fournitures">Fournitures & Rames</option>
                    <option value="salaires">Salaires & Primes</option>
                    <option value="electricite_eau">CIE / SODECI</option>
                    <option value="maintenance">Entretien & Véhicules</option>
                    <option value="pedagogie">Matériel Pédagogique</option>
                    <option value="autre">Autre Charge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bénéficiaire / Prestataire
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: CIE ou Librairie de France"
                    value={beneficiary}
                    onChange={(e) => setBeneficiary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mode de Règlement
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="especes">Espèces</option>
                    <option value="wave">Wave CI</option>
                    <option value="orange_money">Orange Money</option>
                    <option value="virement">Virement bancaire</option>
                    <option value="cheque">Chèque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date de règlement
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Enregistrer la dépense</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
