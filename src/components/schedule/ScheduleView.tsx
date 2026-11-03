import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Printer,
  X,
  AlertTriangle,
  School,
  User,
  DoorOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScheduleItem } from '../../types';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'] as const;
const TIME_SLOTS = [
  '07:30 - 09:30',
  '09:45 - 11:45',
  '12:00 - 14:00', // Pause déjeuner / Cantine
  '14:00 - 16:00',
  '16:00 - 17:30',
];

export const ScheduleView: React.FC = () => {
  const {
    classes,
    teachers,
    subjects,
    schedule,
    addScheduleItem,
    deleteScheduleItem,
    currentEstablishment,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [viewMode, setViewMode] = useState<'class' | 'teacher'>('class');
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '');

  const [showAddModal, setShowAddModal] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  // New slot form state
  const [day, setDay] = useState<typeof DAYS[number]>('Lundi');
  const [startTime, setStartTime] = useState('07:30');
  const [endTime, setEndTime] = useState('09:30');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || '');
  const [room, setRoom] = useState('Salle L308');

  // Filter slots
  const filteredSchedule = schedule.filter((item) => {
    if (viewMode === 'class') {
      return item.classId === selectedClassId;
    } else {
      return item.teacherId === selectedTeacherId;
    }
  });

  const activeClass = classes.find((c) => c.id === selectedClassId);
  const activeTeacher = teachers.find((t) => t.id === selectedTeacherId);

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    const result = addScheduleItem({
      classId: selectedClassId,
      day,
      startTime,
      endTime,
      subjectId,
      teacherId,
      room,
    });

    if (!result.success) {
      setConflictError(result.conflict || 'Conflit horaire détecté.');
      return;
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Emplois du Temps & Affectation des Salles
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Grille hebdomadaire, détection automatique des conflits de professeurs et de salles de classe.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Imprimer la grille</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Créneau</span>
          </button>
        </div>
      </div>

      {/* Selector Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode('class')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'class' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              Par Classe
            </button>
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'teacher' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              Par Enseignant
            </button>
          </div>

          {viewMode === 'class' ? (
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.level})
                </option>
              ))}
            </select>
          ) : (
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName} ({t.subject})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="text-xs font-semibold text-slate-500">
          {viewMode === 'class' ? `Emploi du temps de la classe ${activeClass?.name}` : `Planning de cours de M./Mme ${activeTeacher?.lastName}`}
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="printable-card bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6 overflow-x-auto">
        <div className="min-w-[700px] grid grid-cols-5 gap-4">
          {DAYS.map((d) => {
            const daySlots = filteredSchedule
              .filter((s) => s.day === d)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div key={d} className="space-y-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-center font-extrabold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                  {d}
                </div>

                <div className="space-y-2.5 min-h-[300px]">
                  {daySlots.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-[11px] text-slate-400 italic border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                      Pas de cours
                    </div>
                  ) : (
                    daySlots.map((slot) => {
                      const subj = subjects.find((s) => s.id === slot.subjectId);
                      const tch = teachers.find((t) => t.id === slot.teacherId);
                      const cls = classes.find((c) => c.id === slot.classId);

                      return (
                        <div
                          key={slot.id}
                          className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs hover:shadow-xs transition-shadow relative group"
                        >
                          <div className="flex items-center justify-between text-[10px] text-blue-700 dark:text-blue-300 font-bold mb-1">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" />
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <button
                              onClick={() => deleteScheduleItem(slot.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-0.5"
                              title="Supprimer le créneau"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="font-extrabold text-slate-900 dark:text-white">
                            {subj?.name}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{viewMode === 'class' ? `${tch?.firstName} ${tch?.lastName}` : cls?.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                            <DoorOpen className="w-3 h-3 text-blue-500" />
                            <span>{slot.room}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Add Slot */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Ajouter un Créneau Horaire
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {conflictError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{conflictError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSlot} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Classe bénéficiaire
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jour
                  </label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Matière
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Heure de Début
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Heure de Fin
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Professeur
                  </label>
                  <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.firstName} {t.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Salle
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
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
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
                >
                  Valider le créneau
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
