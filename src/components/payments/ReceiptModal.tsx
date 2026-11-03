import React from 'react';
import {
  X,
  Printer,
  Download,
  School,
  QrCode,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { PaymentRecord } from '../../types';
import { useApp } from '../../context/AppContext';

interface ReceiptModalProps {
  payment: PaymentRecord;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ payment, onClose }) => {
  const { currentEstablishment, getStudentById, getClassById, formatFCFA } = useApp();

  const student = getStudentById(payment.studentId);
  const cls = getClassById(payment.classId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Modal Top Bar (Not printed) */}
        <div className="no-print bg-[#142B49] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Reçu Officiel d’Encaissement</span>
            <span className="font-mono text-xs text-blue-300">({payment.receiptNumber})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le reçu</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="printable-card p-8 bg-white text-slate-900 space-y-6">
          {/* Official Ivorian Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-600">
                RÉPUBLIQUE DE CÔTE D’IVOIRE
              </p>
              <p className="text-[9px] text-slate-500 italic">Union - Discipline - Travail</p>
              <p className="text-[10px] text-slate-600 mt-1">Ministère de l’Éducation Nationale et de l’Alphabétisation</p>
              <h2 className="text-base font-black text-slate-900 mt-1 uppercase">
                {currentEstablishment.name}
              </h2>
              <p className="text-[11px] text-slate-600">{currentEstablishment.address} • {currentEstablishment.city}</p>
              <p className="text-[11px] text-slate-600">Tél : {currentEstablishment.phone}</p>
            </div>

            <div className="text-right">
              <div className="inline-block p-2 border-2 border-slate-900 rounded-xl bg-slate-50">
                <p className="text-[10px] font-bold uppercase text-slate-500">REÇU DE CAISSE N°</p>
                <p className="font-mono text-sm font-black text-blue-700">{payment.receiptNumber}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">Date : {payment.date}</p>
              </div>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Bénéficiaire (Élève)</span>
              <p className="font-extrabold text-sm text-slate-900 mt-0.5">
                {student ? `${student.firstName} ${student.lastName}` : 'Élève'}
              </p>
              <p className="text-slate-600 mt-0.5">
                Matricule : <strong className="font-mono text-blue-700">{student?.matricule}</strong>
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Classe & Année</span>
              <p className="font-extrabold text-sm text-slate-900 mt-0.5">
                {cls?.name || 'Classe'}
              </p>
              <p className="text-slate-600 mt-0.5">
                Année Scolaire : <strong>{currentEstablishment.currentYear}</strong>
              </p>
            </div>
          </div>

          {/* Payment Detail Table */}
          <table className="w-full text-xs border border-slate-200">
            <thead>
              <tr className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                <th className="p-3 text-left">Motif / Désignation</th>
                <th className="p-3 text-left">Mode de Règlement</th>
                <th className="p-3 text-right">Montant Encaissé</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="p-3 font-semibold">
                  Frais de {payment.feeType.toUpperCase()}
                  <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                    {payment.notes || 'Versement scolaire régulier'}
                  </span>
                </td>
                <td className="p-3 uppercase font-medium">
                  {payment.paymentMethod.replace('_', ' ')}
                </td>
                <td className="p-3 text-right font-black text-sm text-slate-900">
                  {formatFCFA(payment.amount)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold">
                <td colSpan={2} className="p-3 text-right text-slate-600">
                  Total Versé :
                </td>
                <td className="p-3 text-right font-black text-base text-blue-700">
                  {formatFCFA(payment.amount)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Solde Restant */}
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Solde restant à régler sur l’année :</span>
            <span className="font-black text-sm text-red-600">{formatFCFA(payment.remainingBalance)}</span>
          </div>

          {/* Signatures & Stamp */}
          <div className="pt-6 grid grid-cols-3 gap-4 items-end text-center text-xs">
            <div>
              <p className="font-bold text-slate-700">Le Parent / Déposant</p>
              <div className="h-16 flex items-center justify-center text-[10px] text-slate-400 italic">
                (Mention lu et approuvé)
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border border-slate-300 rounded-lg p-1 bg-white shadow-2xs">
                <QrCode className="w-full h-full text-slate-800" />
              </div>
              <span className="text-[9px] text-slate-400 mt-1 font-mono">Vérification QR</span>
            </div>

            <div>
              <p className="font-bold text-slate-700">Le Caissier / Comptable</p>
              <p className="text-[10px] text-blue-700 font-semibold">{payment.cashierName}</p>
              <div className="h-12 flex items-center justify-center">
                <div className="border border-blue-600 text-blue-700 px-3 py-1 rounded text-[10px] font-bold uppercase rotate-[-5deg]">
                  CACHET PAYÉ - SCOLARCI
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-center text-[9px] text-slate-400">
            Document généré électroniquement par le système de gestion scolaire ScolarCI • Ne peut être altéré
          </div>
        </div>
      </div>
    </div>
  );
};
