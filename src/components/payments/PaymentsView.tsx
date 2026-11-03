import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Printer,
  Calendar,
  X,
  CheckCircle,
  CreditCard,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord, PaymentMethod } from '../../types';
import { ReceiptModal } from './ReceiptModal';

export const PaymentsView: React.FC<{ initialReceiptId?: string }> = ({
  initialReceiptId,
}) => {
  const {
    payments,
    addPayment,
    students,
    classes,
    formatFCFA,
    currentUser,
    getStudentFinancialSummary,
  } = useApp();

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [inspectPayment, setInspectPayment] = useState<PaymentRecord | null>(() => {
    if (initialReceiptId) {
      return payments.find((p) => p.id === initialReceiptId) || null;
    }
    return null;
  });

  // New Payment Form state
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [amount, setAmount] = useState<number>(150000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wave');
  const [feeType, setFeeType] = useState<'scolarite' | 'inscription' | 'cantine' | 'transport' | 'annexe'>('scolarite');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('Versement scolarité 1er Trimestre');

  const selectedStudentFin = getStudentFinancialSummary(studentId);

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const student = students.find((s) => s.id === p.studentId);
    const cls = classes.find((c) => c.id === p.classId);

    const matchSearch =
      !search ||
      p.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      (student && `${student.firstName} ${student.lastName}`.toLowerCase().includes(search.toLowerCase())) ||
      (student && student.matricule.toLowerCase().includes(search.toLowerCase()));

    const matchMethod = methodFilter === 'all' || p.paymentMethod === methodFilter;

    return matchSearch && matchMethod;
  });

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || amount <= 0) return;

    const student = students.find((s) => s.id === studentId);
    const created = addPayment({
      studentId,
      classId: student?.classId || '',
      amount: Number(amount),
      paymentMethod,
      feeType,
      date,
      notes,
      cashierName: currentUser.name,
      remainingBalance: 0, // Computed automatically by context
    });

    setShowAddModal(false);
    setInspectPayment(created);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-600" />
            Paiements & Reçus de Caisse
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enregistrement des versements en FCFA (Espèces, Wave CI, Orange Money, MTN MoMo, Virements) et émission instantanée de reçus.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Encaisser un Paiement</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">Total des Encaissements</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
            {formatFCFA(totalCollected)}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">Total Reçus Émis</span>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">
            {payments.length} reçus
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">Dernier Règlement</span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-2 block truncate">
            {payments[0]?.receiptNumber} • {formatFCFA(payments[0]?.amount || 0)}
          </span>
        </div>
      </div>

      {/* Toolbar Filter */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par N° de reçu, nom de l'élève, matricule..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Mode:</span>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="all">Tous modes</option>
            <option value="wave">Wave CI</option>
            <option value="orange_money">Orange Money</option>
            <option value="mtn_momo">MTN MoMo</option>
            <option value="especes">Espèces</option>
            <option value="virement">Virement bancaire</option>
            <option value="cheque">Chèque</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">N° Reçu</th>
                <th className="py-3 px-4">Élève & Classe</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type de Frais</th>
                <th className="py-3 px-4">Mode de Paiement</th>
                <th className="py-3 px-4 text-right">Montant Encaissé</th>
                <th className="py-3 px-4 text-right">Reste Dû</th>
                <th className="py-3 px-4 text-center">Reçu Officiel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredPayments.map((p) => {
                const student = students.find((s) => s.id === p.studentId);
                const cls = classes.find((c) => c.id === p.classId);

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {p.receiptNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {student ? `${student.firstName} ${student.lastName}` : 'Élève'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {cls?.name} • <span className="font-mono">{student?.matricule}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{p.date}</td>
                    <td className="py-3 px-4 uppercase font-semibold text-slate-700 dark:text-slate-300">
                      {p.feeType}
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {p.paymentMethod.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">
                      {formatFCFA(p.amount)}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-red-600 dark:text-red-400">
                      {formatFCFA(p.remainingBalance)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setInspectPayment(p)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Imprimer</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Payment */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Enregistrer un Paiement
                </h3>
                <p className="text-xs text-slate-400">Génération automatique du reçu officiel</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterPayment} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sélectionner l’Élève *
                </label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  {students.map((st) => {
                    const cls = classes.find((c) => c.id === st.classId);
                    return (
                      <option key={st.id} value={st.id}>
                        {st.firstName} {st.lastName} ({st.matricule} - {cls?.name})
                      </option>
                    );
                  })}
                </select>
                <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                  <span>Total dû : {formatFCFA(selectedStudentFin.totalDue)}</span>
                  <span className="font-bold text-red-500">
                    Reste à régler : {formatFCFA(selectedStudentFin.remaining)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Montant Versé (FCFA) *
                  </label>
                  <input
                    type="number"
                    step={5000}
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Type de Frais
                  </label>
                  <select
                    value={feeType}
                    onChange={(e) => setFeeType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="scolarite">Frais de Scolarité</option>
                    <option value="inscription">Droit d’Inscription</option>
                    <option value="cantine">Abonnement Cantine</option>
                    <option value="transport">Abonnement Bus</option>
                    <option value="annexe">Frais Annexes / Rame</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mode de Règlement
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="wave">Wave CI (Mobile Money)</option>
                    <option value="orange_money">Orange Money</option>
                    <option value="mtn_momo">MTN Mobile Money</option>
                    <option value="especes">Espèces (Guichet)</option>
                    <option value="virement">Virement Bancaire</option>
                    <option value="cheque">Chèque Bancaire</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date du Versement
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Observations / Référence transaction
                </label>
                <input
                  type="text"
                  placeholder="Ex: Réf Wave TX-88942 ou Chèque BICICI"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Valider & Générer Reçu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Receipt Modal */}
      {inspectPayment && (
        <ReceiptModal
          payment={inspectPayment}
          onClose={() => setInspectPayment(null)}
        />
      )}
    </div>
  );
};
