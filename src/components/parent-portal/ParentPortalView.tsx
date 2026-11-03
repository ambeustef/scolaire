import React, { useState } from 'react';
import {
  UserCheck,
  Award,
  Clock,
  DollarSign,
  Receipt,
  Download,
  Calendar,
  MessageSquare,
  School,
  FileText,
  Phone,
  Printer,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BulletinModal } from '../grades/BulletinModal';
import { ReceiptModal } from '../payments/ReceiptModal';
import { PaymentRecord } from '../../types';

export const ParentPortalView: React.FC = () => {
  const {
    students,
    classes,
    payments,
    formatFCFA,
    getStudentFinancialSummary,
    calculateStudentAverage,
    attendance,
    announcements,
    currentEstablishment,
    currentUser,
  } = useApp();

  // Pick children associated with this parent (or first student in demo)
  const myChildren = students.slice(0, 2); // Aya Marie Koffi and Mohamed Lamine Traoré
  const [selectedChildId, setSelectedChildId] = useState(myChildren[0]?.id || '');
  const [inspectBulletin, setInspectBulletin] = useState(false);
  const [inspectReceipt, setInspectReceipt] = useState<PaymentRecord | null>(null);

  const currentChild = students.find((s) => s.id === selectedChildId) || myChildren[0];
  const childClass = classes.find((c) => c.id === currentChild?.classId);
  const finSummary = getStudentFinancialSummary(currentChild?.id || '');
  const avgData = calculateStudentAverage(currentChild?.id || '', 'Trimestre 1');
  const childPayments = payments.filter((p) => p.studentId === currentChild?.id);
  const childAttendance = attendance.filter((a) => a.studentId === currentChild?.id);

  if (!currentChild) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-[#142B49] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30">
            Espace Parents d’Élèves
          </span>
          <h1 className="text-xl sm:text-2xl font-black mt-2">
            Bonjour, {currentUser.name}
          </h1>
          <p className="text-xs text-teal-100 mt-1">
            Suivi personnalisé de la scolarité de vos enfants inscrits au sein de {currentEstablishment.name}.
          </p>
        </div>

        {/* Child Selector */}
        <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/20 flex items-center gap-3">
          <span className="text-xs font-bold text-teal-200">Enfant suivi :</span>
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-black shadow-xs"
          >
            {myChildren.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName} {child.lastName} ({classes.find((c) => c.id === child.classId)?.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Child Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Academic Average */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Moyenne 1er Trimestre</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {avgData.average.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">/ 20</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-700">
            <span className="text-emerald-600 font-semibold">Rang : {avgData.rank}e sur {avgData.totalStudents}</span>
            <button
              onClick={() => setInspectBulletin(true)}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Voir Bulletin
            </button>
          </div>
        </div>

        {/* Fees status */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Frais Scolaires</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="text-xs text-slate-400">Reste à solder :</span>
            <span className="text-2xl font-black text-red-600 dark:text-red-400 block mt-0.5">
              {formatFCFA(finSummary.remaining)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-700">
            <span className="text-slate-500">Déjà réglé : {formatFCFA(finSummary.totalPaid)}</span>
            <span className="text-emerald-600 font-bold">À jour</span>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Assiduité & Discipline</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {childAttendance.filter((a) => a.status === 'present').length} présences
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              {childAttendance.filter((a) => a.status === 'retard').length} retard(s) • {childAttendance.filter((a) => a.status === 'absent').length} absence(s)
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-700">
            <span className="text-slate-500">Note conduite : 19/20</span>
            <span className="text-blue-600 font-bold">Assidu</span>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payments Receipts for this Child */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              Reçus de Paiement Téléchargeables
            </h2>
            <span className="text-xs text-slate-400 font-semibold">{childPayments.length} reçu(s)</span>
          </div>

          <div className="space-y-3">
            {childPayments.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="font-mono text-blue-600 dark:text-blue-400">{p.receiptNumber}</span>
                    <span>•</span>
                    <span>{formatFCFA(p.amount)}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {p.date} • Règlement par {p.paymentMethod.replace('_', ' ')}
                  </p>
                </div>
                <button
                  onClick={() => setInspectReceipt(p)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Reçu Officiel</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* School Announcements for Parents */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Circulaires & Annonces de l’Établissement
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 dark:text-white">{ann.title}</span>
                  <span className="text-[10px] text-slate-400">{ann.date}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-3">
                  {ann.content}
                </p>
                <div className="mt-2 text-[10px] text-slate-400 font-semibold">{ann.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bulletin Modal */}
      {inspectBulletin && (
        <BulletinModal
          studentId={currentChild.id}
          onClose={() => setInspectBulletin(false)}
        />
      )}

      {/* Receipt Modal */}
      {inspectReceipt && (
        <ReceiptModal
          payment={inspectReceipt}
          onClose={() => setInspectReceipt(null)}
        />
      )}
    </div>
  );
};
