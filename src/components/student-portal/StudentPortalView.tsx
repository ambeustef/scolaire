import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  Calendar,
  BookOpen,
  Clock,
  Printer,
  Download,
  CheckCircle2,
  FileText,
  School,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BulletinModal } from '../grades/BulletinModal';

export const StudentPortalView: React.FC = () => {
  const {
    students,
    classes,
    schedule,
    subjects,
    calculateStudentAverage,
    currentEstablishment,
    currentUser,
  } = useApp();

  // Pick first student as active student profile
  const me = students[0]; // Aya Marie Koffi (Terminale D1)
  const myClass = classes.find((c) => c.id === me.classId);
  const avgData = calculateStudentAverage(me.id, 'Trimestre 1');
  const mySchedule = schedule.filter((s) => s.classId === me.classId);

  const [showBulletin, setShowBulletin] = useState(false);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={me.photoUrl}
            alt={me.lastName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-md"
          />
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30">
              Espace Élève
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-1">
              {me.firstName} {me.lastName}
            </h1>
            <p className="text-xs text-blue-200 mt-0.5">
              Classe de <strong className="text-white font-bold">{myClass?.name}</strong> • Matricule : <span className="font-mono">{me.matricule}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowBulletin(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-blue-900 font-extrabold text-xs shadow-lg hover:bg-blue-50 flex items-center gap-2"
        >
          <Award className="w-4 h-4 text-blue-600" />
          <span>Consulter Mon Bulletin Officiel</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase block">Moyenne Générale</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {avgData.average.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">/ 20</span>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            Rang : {avgData.rank}ère de la classe (Tableau d’Honneur)
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase block">Prochains Devoirs & BEPC/BAC</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-2 block">
            Devoir de Maths Surveillé
          </span>
          <p className="text-xs text-blue-600 font-medium mt-1">
            Samedi 23 Novembre • 08h00 - 12h00
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase block">Statut Administratif</span>
          <span className="text-lg font-black text-emerald-600 mt-2 block">
            Inscrite & Assidue
          </span>
          <p className="text-xs text-slate-400 mt-1">
            Carte scolaire valide pour {currentEstablishment.currentYear}
          </p>
        </div>
      </div>

      {/* Grade Book & Timetable Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes par matière */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Mon Carnet de Notes (Trimestre 1)
          </h2>

          <div className="space-y-3">
            {avgData.details.map((d, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{d.subject?.name}</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Coeff: {d.coeff} • Devoirs: {d.grade.devoir1}/20 • Compo: {d.grade.composition}/20
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-blue-600 dark:text-blue-400">
                    {d.grade.average.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">/20</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mon Emploi du Temps */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Mon Emploi du Temps Hebdomadaire
          </h2>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {mySchedule.map((s) => {
              const subj = subjects.find((sub) => sub.id === s.subjectId);
              return (
                <div
                  key={s.id}
                  className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-blue-950 dark:text-blue-100">{subj?.name}</span>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-blue-700 dark:text-blue-300">{s.day}</span>
                      <span>•</span>
                      <span>{s.startTime} - {s.endTime}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-2xs border border-slate-200 dark:border-slate-700">
                    {s.room}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showBulletin && (
        <BulletinModal
          studentId={me.id}
          onClose={() => setShowBulletin(false)}
        />
      )}
    </div>
  );
};
