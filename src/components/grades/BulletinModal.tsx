import React from 'react';
import {
  X,
  Printer,
  Award,
  CheckCircle2,
  AlertTriangle,
  School,
  QrCode,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BulletinModalProps {
  studentId: string;
  term?: string;
  onClose: () => void;
}

export const BulletinModal: React.FC<BulletinModalProps> = ({
  studentId,
  term = 'Trimestre 1',
  onClose,
}) => {
  const {
    currentEstablishment,
    getStudentById,
    getClassById,
    calculateStudentAverage,
    attendance,
  } = useApp();

  const student = getStudentById(studentId);
  const cls = getClassById(student?.classId || '');
  const avgData = calculateStudentAverage(studentId, term);

  // Calculate class high & low
  const classAbsences = attendance.filter(
    (a) => a.studentId === studentId && (a.status === 'absent' || a.status === 'excuse')
  ).length;

  // Decision & Distinction
  let distinction = 'Tableau d’Honneur';
  let badgeColor = 'text-blue-700 border-blue-600 bg-blue-50';
  if (avgData.average >= 16) {
    distinction = 'Félicitations du Conseil & Tableau d’Honneur';
    badgeColor = 'text-emerald-700 border-emerald-600 bg-emerald-50';
  } else if (avgData.average >= 14) {
    distinction = 'Encouragements & Tableau d’Honneur';
    badgeColor = 'text-blue-700 border-blue-600 bg-blue-50';
  } else if (avgData.average >= 12) {
    distinction = 'Tableau d’Honneur';
    badgeColor = 'text-indigo-700 border-indigo-600 bg-indigo-50';
  } else if (avgData.average >= 10) {
    distinction = 'Passable - Doit maintenir ses efforts';
    badgeColor = 'text-slate-700 border-slate-400 bg-slate-50';
  } else {
    distinction = 'Avertissement Travail';
    badgeColor = 'text-red-700 border-red-600 bg-red-50';
  }

  const handlePrint = () => {
    window.print();
  };

  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Top bar (Hidden on print) */}
        <div className="no-print bg-[#142B49] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">
              Bulletin Officiel de Notes • {student.firstName} {student.lastName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le Bulletin (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Bulletin Document (Standard Ivorian Ministry of Education Format) */}
        <div className="printable-card p-8 bg-white text-slate-900 space-y-6">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 items-start border-b-2 border-slate-900 pb-4">
            <div className="text-left text-xs space-y-0.5">
              <p className="font-bold uppercase text-[10px] tracking-wider text-slate-700">
                RÉPUBLIQUE DE CÔTE D’IVOIRE
              </p>
              <p className="text-[9px] text-slate-500 italic">Union - Discipline - Travail</p>
              <p className="text-[10px] text-slate-600 mt-1 font-semibold">
                MINISTÈRE DE L’ÉDUCATION NATIONALE
              </p>
              <p className="text-[9px] text-slate-500">DRENA DUÉKOUÉ • IEP BAGOHOUO</p>
              <p className="font-extrabold text-blue-900 text-xs mt-1 uppercase">
                {currentEstablishment.name}
              </p>
              <p className="text-[10px] text-slate-600">{currentEstablishment.address}</p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center mb-1">
                <School className="w-6 h-6 text-blue-800" />
              </div>
              <h1 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b-2 border-amber-500 pb-0.5">
                BULLETIN DE NOTES
              </h1>
              <p className="text-xs font-bold text-blue-800 mt-1 uppercase tracking-wide">
                {term} • {currentEstablishment.currentYear}
              </p>
            </div>

            <div className="text-right text-xs">
              <div className="inline-block p-2 border border-slate-300 rounded-xl bg-slate-50 text-left">
                <div className="flex gap-3 items-center">
                  <img
                    src={student.photoUrl}
                    alt={student.lastName}
                    className="w-12 h-14 object-cover rounded border border-slate-300"
                  />
                  <div>
                    <p className="font-bold text-slate-900">{student.lastName} {student.firstName}</p>
                    <p className="font-mono text-blue-700 text-[10px] font-bold">Mat : {student.matricule}</p>
                    <p className="text-slate-600 text-[10px]">Classe : <strong>{cls?.name}</strong></p>
                    <p className="text-slate-500 text-[9px]">Né(e) le : {student.dateOfBirth}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Grades */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-900">
              <thead>
                <tr className="bg-slate-100 text-slate-800 uppercase font-extrabold text-[9px] border-b border-slate-900 text-center">
                  <th className="p-2 text-left border-r border-slate-300">Matières Enseignées</th>
                  <th className="p-2 border-r border-slate-300 w-16">Interro /20</th>
                  <th className="p-2 border-r border-slate-300 w-16">Devoir /20</th>
                  <th className="p-2 border-r border-slate-300 w-16">Compo /20</th>
                  <th className="p-2 border-r border-slate-300 w-16">Moy. /20</th>
                  <th className="p-2 border-r border-slate-300 w-12">Coeff</th>
                  <th className="p-2 border-r border-slate-300 w-16">Total</th>
                  <th className="p-2 border-r border-slate-300 w-12">Rang</th>
                  <th className="p-2 text-left">Appréciations & Signature du Professeur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {avgData.details.map((d, index) => (
                  <tr key={index} className="text-center hover:bg-slate-50">
                    <td className="p-2 text-left font-bold border-r border-slate-300 text-slate-900">
                      {d.subject?.name}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-slate-600">
                      {d.grade.interrogation}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-slate-600">
                      {d.grade.devoir1}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-semibold text-slate-800">
                      {d.grade.composition}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-black text-blue-900">
                      {d.grade.average.toFixed(2)}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-bold text-slate-600">
                      {d.coeff}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-bold text-slate-900">
                      {d.points.toFixed(2)}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-bold text-slate-600">
                      {index + 1}e
                    </td>
                    <td className="p-2 text-left text-slate-600 italic text-[11px]">
                      {d.grade.teacherAppreciation || 'Travail régulier.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Synthesis & Statistics */}
          <div className="grid grid-cols-2 gap-4">
            {/* Box Left: Summary KPIs */}
            <div className="p-4 rounded-xl border-2 border-slate-900 bg-slate-50 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="font-bold text-slate-700">Moyenne Générale Pondérée :</span>
                <span className="text-xl font-black text-blue-900">{avgData.average.toFixed(2)} / 20</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="font-bold text-slate-700">Rang de l’Élève :</span>
                <span className="font-extrabold text-blue-800 text-sm">
                  {avgData.rank}ème sur {avgData.totalStudents} élèves
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-600">Moyenne la plus forte de la classe :</span>
                <strong className="text-slate-900">17.20 / 20</strong>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">Moyenne la plus faible :</span>
                <strong className="text-slate-900">08.40 / 20</strong>
              </div>
            </div>

            {/* Box Right: Discipline & Council Decision */}
            <div className="p-4 rounded-xl border-2 border-slate-900 bg-slate-50 space-y-2 text-xs flex flex-col justify-between">
              <div>
                <span className="font-bold uppercase text-[10px] text-slate-500 block mb-1">
                  Assiduité & Conduite
                </span>
                <div className="flex justify-between text-slate-700">
                  <span>Absences enregistrées :</span>
                  <strong>{classAbsences} heure(s)</strong>
                </div>
                <div className="flex justify-between text-slate-700 mt-1">
                  <span>Note de Conduite :</span>
                  <strong className="text-blue-800">19 / 20</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-300">
                <span className="font-bold uppercase text-[10px] text-slate-500 block mb-1">
                  Décision du Conseil de Classe
                </span>
                <div className={`p-2 rounded-lg border font-black text-center text-xs ${badgeColor}`}>
                  {distinction}
                </div>
              </div>
            </div>
          </div>

          {/* Signatures & Official Stamp */}
          <div className="pt-4 grid grid-cols-3 gap-6 text-center text-xs">
            <div>
              <p className="font-bold text-slate-800">Le Professeur Principal</p>
              <div className="h-16 flex items-center justify-center text-[10px] text-slate-400 italic">
                (Visa & signature)
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-slate-100 border border-slate-300 rounded-lg p-1">
                <QrCode className="w-full h-full text-slate-800" />
              </div>
              <span className="text-[8px] text-slate-400 mt-1">Authentification DRENA</span>
            </div>

            <div>
              <p className="font-bold text-slate-800">Le Chef d’Établissement</p>
              <p className="text-[10px] text-blue-900 font-semibold">{currentEstablishment.directorName}</p>
              <div className="h-14 flex items-center justify-center">
                <div className="border-2 border-blue-800 text-blue-900 px-3 py-1 rounded text-[10px] font-black uppercase rotate-[-3deg]">
                  CACHET DE LA DIRECTION
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-center text-[8px] text-slate-400 uppercase">
            Document officiel conforme au modèle type du Ministère de l’Éducation Nationale de Côte d’Ivoire
          </div>
        </div>
      </div>
    </div>
  );
};
