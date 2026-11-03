import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  MessageSquare,
  Users,
  Search,
  Filter,
  Save,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AttendanceView: React.FC = () => {
  const { classes, students, attendance, markAttendance, currentUser } = useApp();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('2024-11-04');
  const [sentAlertInfo, setSentAlertInfo] = useState<string | null>(null);

  const classStudents = students.filter(
    (s) => s.classId === selectedClassId && s.status === 'actif'
  );
  const activeClass = classes.find((c) => c.id === selectedClassId);

  // Local state for roll call
  const [rollRecords, setRollRecords] = useState<
    Record<string, { status: 'present' | 'absent' | 'retard' | 'excuse'; reason: string; time: string }>
  >({});

  const getRecord = (studentId: string) => {
    if (rollRecords[studentId]) return rollRecords[studentId];
    const existing = attendance.find(
      (a) => a.studentId === studentId && a.date === selectedDate
    );
    return {
      status: existing?.status || 'present',
      reason: existing?.reason || '',
      time: existing?.time || '07:30',
    };
  };

  const handleSetStatus = (
    studentId: string,
    status: 'present' | 'absent' | 'retard' | 'excuse'
  ) => {
    const current = getRecord(studentId);
    setRollRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...current,
        status,
      },
    }));
  };

  const handleSetReason = (studentId: string, reason: string) => {
    const current = getRecord(studentId);
    setRollRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...current,
        reason,
      },
    }));
  };

  const handleSaveAttendance = () => {
    const recordsToSave = classStudents.map((st) => {
      const rec = getRecord(st.id);
      return {
        studentId: st.id,
        status: rec.status,
        reason: rec.reason,
        time: rec.time,
      };
    });

    markAttendance(selectedDate, selectedClassId, recordsToSave);

    const absentOrLate = recordsToSave.filter((r) => r.status === 'absent' || r.status === 'retard');
    if (absentOrLate.length > 0) {
      setSentAlertInfo(
        `Feuille d'appel validée ! ${absentOrLate.length} alerte(s) SMS/WhatsApp simulées ont été envoyées aux parents concernés.`
      );
    } else {
      setSentAlertInfo("Feuille d'appel validée avec succès ! Tous les élèves sont présents.");
    }
    setTimeout(() => setSentAlertInfo(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-500" />
            Gestion des Présences & Absences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Feuille d’appel numérique, retards, justifications médicales et notification instantanée aux parents.
          </p>
        </div>

        <button
          onClick={handleSaveAttendance}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Valider l’Appel du Jour</span>
        </button>
      </div>

      {/* Alert toast */}
      {sentAlertInfo && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{sentAlertInfo}</span>
        </div>
      )}

      {/* Selectors */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Classe :</label>
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setRollRecords({});
            }}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Date d’appel :</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setRollRecords({});
            }}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => {
              const allPresent: any = {};
              classStudents.forEach((st) => {
                allPresent[st.id] = { status: 'present', reason: '', time: '07:30' };
              });
              setRollRecords(allPresent);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200"
          >
            Marquer tous présents
          </button>
        </div>
      </div>

      {/* Roll Call Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Élève</th>
                <th className="py-3 px-4 text-center">Statut de Présence</th>
                <th className="py-3 px-4">Motif d’absence / Justification</th>
                <th className="py-3 px-4">Contact Parent (SMS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {classStudents.map((st) => {
                const rec = getRecord(st.id);

                return (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {st.firstName} {st.lastName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {st.matricule}
                      </div>
                    </td>

                    {/* Status Toggle Buttons */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSetStatus(st.id, 'present')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            rec.status === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50'
                          }`}
                        >
                          Présent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStatus(st.id, 'absent')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            rec.status === 'absent'
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStatus(st.id, 'retard')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            rec.status === 'retard'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-amber-50'
                          }`}
                        >
                          Retard
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStatus(st.id, 'excuse')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            rec.status === 'excuse'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50'
                          }`}
                        >
                          Excusé
                        </button>
                      </div>
                    </td>

                    {/* Reason input */}
                    <td className="py-3 px-4">
                      {rec.status !== 'present' ? (
                        <input
                          type="text"
                          placeholder="Ex: Rendez-vous médical ou Embouteillage"
                          value={rec.reason}
                          onChange={(e) => handleSetReason(st.id, e.target.value)}
                          className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        />
                      ) : (
                        <span className="text-slate-400 italic">En classe</span>
                      )}
                    </td>

                    {/* Parent Contact */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-mono text-[11px]">{st.parentPhone}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
