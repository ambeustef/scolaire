import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  ShieldCheck,
  CreditCard,
  Award,
  Clock,
  Download,
  School,
  QrCode,
  AlertCircle,
  FileText,
  Camera,
  UploadCloud,
  Check,
} from 'lucide-react';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';

interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
  onOpenReceipt?: (paymentId: string) => void;
  onOpenBulletin?: (studentId: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onOpenReceipt,
  onOpenBulletin,
}) => {
  const {
    currentEstablishment,
    getClassById,
    payments,
    formatFCFA,
    getStudentFinancialSummary,
    calculateStudentAverage,
    attendance,
    updateStudent,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'finances' | 'grades' | 'card'>('profile');
  const [photoUrl, setPhotoUrl] = useState<string>(student.photoUrl);
  const [photoUpdated, setPhotoUpdated] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Veuillez sélectionner un fichier image valide (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Taille maximale autorisée : 8 Mo.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const newPhoto = reader.result;
        setPhotoUrl(newPhoto);
        updateStudent(student.id, { photoUrl: newPhoto });
        setPhotoUpdated(true);
        setTimeout(() => setPhotoUpdated(false), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const cls = getClassById(student.classId);
  const finSummary = getStudentFinancialSummary(student.id);
  const studentPayments = payments.filter((p) => p.studentId === student.id);
  const avgData = calculateStudentAverage(student.id, 'Trimestre 1');
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);

  const handlePrintCard = () => {
    setActiveTab('card');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="relative bg-[#142B49] text-white p-6 sm:p-8 flex items-start justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Interactive Photo Upload Container */}
            <div className="relative group">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <img
                src={photoUrl}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 cursor-pointer"
                title="Cliquer pour changer la photo"
              >
                <Camera className="w-5 h-5 text-white" />
                <span>Changer</span>
              </button>
              {photoUpdated && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-md flex items-center justify-center animate-bounce">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  {student.matricule}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  {student.status.toUpperCase()}
                </span>
                {student.scholarshipPercent > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                    Bourse {student.scholarshipPercent}%
                  </span>
                )}
                {photoUpdated && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Photo actualisée
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-sm text-slate-300 flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-white">{cls?.name || 'Classe non assignée'}</span>
                <span>•</span>
                <span>{currentEstablishment.name}</span>
              </p>
              {uploadError && (
                <p className="text-xs text-red-300 font-medium mt-1">⚠️ {uploadError}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintCard}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
              title="Imprimer la Carte Scolaire"
            >
              <Printer className="w-4 h-4" />
              <span>Carte Scolaire</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Fiche Personnelle
          </button>
          <button
            onClick={() => setActiveTab('finances')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'finances'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Scolarité & Paiements</span>
            {finSummary.remaining > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'grades'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Notes & Moyenne
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'card'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Aperçu Carte Scolaire
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* État Civil */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    État Civil de l’Élève
                  </h3>
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-slate-500">Nom & Prénoms :</span>
                      <strong className="text-slate-900 dark:text-white">{student.firstName} {student.lastName}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-slate-500">Date de naissance :</span>
                      <strong className="text-slate-900 dark:text-white">{student.dateOfBirth}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-slate-500">Lieu de naissance :</span>
                      <strong className="text-slate-900 dark:text-white">{student.placeOfBirth}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-slate-500">Sexe :</span>
                      <strong className="text-slate-900 dark:text-white">{student.gender === 'F' ? 'Féminin' : 'Masculin'}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-slate-500">Nationalité :</span>
                      <strong className="text-slate-900 dark:text-white">{student.nationality}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Groupe Sanguin :</span>
                      <strong className="text-blue-600 dark:text-blue-400">{student.bloodGroup || 'N/C'}</strong>
                    </div>
                  </div>
                </div>

                {/* Parents & Contacts */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Responsables Légaux & Urgence
                  </h3>
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-slate-500">Tuteur / Parent :</span>
                      <strong className="text-slate-900 dark:text-white">{student.parentName}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-slate-500">Profession :</span>
                      <strong className="text-slate-900 dark:text-white">{student.parentProfession || 'N/C'}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-slate-500">Téléphone Direct :</span>
                      <strong className="text-blue-600 dark:text-blue-400">{student.parentPhone}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-slate-500">E-mail Parent :</span>
                      <strong className="text-slate-900 dark:text-white truncate max-w-[200px]">{student.parentEmail}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Contact d’urgence :</span>
                      <strong className="text-red-500 font-semibold">{student.emergencyContact}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adresse et Parcours */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                  <span><strong>Adresse du domicile :</strong> {student.address}</span>
                </div>
                {student.previousSchool && (
                  <div className="text-slate-500 dark:text-slate-400">
                    Établissement d’origine : <strong>{student.previousSchool}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'finances' && (
            <div className="space-y-6">
              {/* Financial Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-400 font-semibold block">Total Dû pour l’année</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                    {formatFCFA(finSummary.totalDue)}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold block">Déjà Encaissé</span>
                  <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1 block">
                    {formatFCFA(finSummary.totalPaid)}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <span className="text-xs text-red-700 dark:text-red-400 font-semibold block">Reste à payer</span>
                  <span className="text-xl font-extrabold text-red-700 dark:text-red-300 mt-1 block">
                    {formatFCFA(finSummary.remaining)}
                  </span>
                </div>
              </div>

              {/* Payments History */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Historique des versements
                </h4>
                {studentPayments.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Aucun paiement enregistré pour cet élève.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                    {studentPayments.map((p) => (
                      <div key={p.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="font-mono text-blue-600 dark:text-blue-400">{p.receiptNumber}</span>
                            <span>•</span>
                            <span>{p.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{p.notes}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-extrabold text-slate-900 dark:text-white">
                            {formatFCFA(p.amount)}
                          </span>
                          <button
                            onClick={() => onOpenReceipt && onOpenReceipt(p.id)}
                            className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-semibold flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Reçu</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'grades' && (
            <div className="space-y-6">
              {/* Summary Average Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-blue-200 font-semibold block">Moyenne Générale (1er Trimestre)</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black">{avgData.average.toFixed(2)}</span>
                    <span className="text-sm text-blue-200">/ 20</span>
                  </div>
                  <span className="text-xs text-emerald-300 font-semibold mt-1 block">
                    Rang : {avgData.rank}ème sur {avgData.totalStudents} élèves
                  </span>
                </div>
                <button
                  onClick={() => onOpenBulletin && onOpenBulletin(student.id)}
                  className="px-4 py-2 bg-white text-blue-900 font-bold text-xs rounded-xl shadow-md hover:bg-blue-50 transition-all flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Voir Bulletin Officiel</span>
                </button>
              </div>

              {/* Subject Breakdown */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="pb-2">Matière</th>
                      <th className="pb-2 text-center">Interro</th>
                      <th className="pb-2 text-center">Devoir 1</th>
                      <th className="pb-2 text-center">Compo</th>
                      <th className="pb-2 text-center">Moyenne</th>
                      <th className="pb-2 text-center">Coeff</th>
                      <th className="pb-2">Appréciation Enseignant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {avgData.details.map((d, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 font-bold text-slate-800 dark:text-slate-100">
                          {d.subject?.name}
                        </td>
                        <td className="py-2.5 text-center">{d.grade.interrogation}/20</td>
                        <td className="py-2.5 text-center">{d.grade.devoir1}/20</td>
                        <td className="py-2.5 text-center font-semibold">{d.grade.composition}/20</td>
                        <td className="py-2.5 text-center font-extrabold text-blue-600 dark:text-blue-400">
                          {d.grade.average.toFixed(2)}
                        </td>
                        <td className="py-2.5 text-center font-bold text-slate-500">{d.coeff}</td>
                        <td className="py-2.5 text-slate-500 italic max-w-xs truncate">
                          {d.grade.teacherAppreciation || 'Bon travail.'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'card' && (
            <div className="flex flex-col items-center justify-center p-4">
              {/* Carte Scolaire Ivoirienne Format Recto / Verso */}
              <div className="printable-card w-full max-w-md bg-gradient-to-br from-[#142B49] via-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-2xl border-2 border-amber-400/50 relative overflow-hidden">
                {/* Decorative Republic Stamp */}
                <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
                  <div className="text-left">
                    <p className="text-[9px] uppercase font-bold tracking-wider text-amber-300">
                      RÉPUBLIQUE DE CÔTE D’IVOIRE
                    </p>
                    <p className="text-[8px] text-slate-300">Union - Discipline - Travail</p>
                    <p className="text-[10px] font-extrabold text-white mt-0.5">{currentEstablishment.name}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <School className="w-5 h-5 text-amber-400" />
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <img
                    src={photoUrl}
                    alt={student.lastName}
                    className="w-24 h-28 object-cover rounded-xl border-2 border-white/60 shadow-lg"
                  />
                  <div className="text-xs space-y-1">
                    <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                      CARTE D’IDENTITÉ SCOLAIRE
                    </p>
                    <p className="text-base font-extrabold leading-tight text-white">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-xs font-semibold text-blue-200">
                      Classe : <span className="text-white font-bold">{cls?.name}</span>
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Matricule : <span className="font-mono font-bold text-amber-300">{student.matricule}</span>
                    </p>
                    <p className="text-[10px] text-slate-300">
                      Né(e) le : {student.dateOfBirth} à {student.placeOfBirth}
                    </p>
                    <p className="text-[10px] text-slate-300">
                      Année : {currentEstablishment.currentYear}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[10px] text-slate-300">
                  <div>
                    <p className="font-semibold text-white">Le Directeur</p>
                    <p className="italic text-[9px]">{currentEstablishment.directorName}</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center shadow-inner">
                    <QrCode className="w-10 h-10 text-slate-900" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="no-print mt-6 px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Lancer l’impression de la carte</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
