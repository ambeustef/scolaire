import React, { useState } from 'react';
import {
  School,
  Plus,
  Users,
  GraduationCap,
  DoorOpen,
  X,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SchoolCycle } from '../../types';

export const ClassesView: React.FC<{ onSelectClass?: (classId: string) => void }> = ({
  onSelectClass,
}) => {
  const { classes, addClass, teachers, students, currentEstablishment } = useApp();

  const [activeCycle, setActiveCycle] = useState<'all' | SchoolCycle>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New class form state
  const [name, setName] = useState('');
  const [level, setLevel] = useState('6ème');
  const [cycle, setCycle] = useState<SchoolCycle>('college');
  const [capacity, setCapacity] = useState(40);
  const [mainTeacherId, setMainTeacherId] = useState(teachers[0]?.id || '');
  const [roomNumber, setRoomNumber] = useState('Salle C105');

  const filteredClasses = classes.filter(
    (c) => activeCycle === 'all' || c.cycle === activeCycle
  );

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addClass({
      name,
      level,
      cycle,
      capacity,
      mainTeacherId,
      roomNumber,
      establishmentId: currentEstablishment.id,
    });
    setShowAddModal(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <School className="w-6 h-6 text-blue-600" />
            Gestion des Classes & Cycles Scolaires
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Système ivoirien : Primaire (CP1-CM2), Collège (6e-3e) et Lycée (2nde-Terminale).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une Nouvelle Classe</span>
        </button>
      </div>

      {/* Cycle Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveCycle('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeCycle === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          Toutes les classes ({classes.length})
        </button>
        <button
          onClick={() => setActiveCycle('primaire')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeCycle === 'primaire'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          Primaire (CP1 à CM2)
        </button>
        <button
          onClick={() => setActiveCycle('college')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeCycle === 'college'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          Collège (6ème à 3ème - BEPC)
        </button>
        <button
          onClick={() => setActiveCycle('lycee')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeCycle === 'lycee'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          Lycée (2nde, 1ère, Terminale - BAC)
        </button>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((cls) => {
          const classStudents = students.filter((s) => s.classId === cls.id);
          const count = classStudents.length;
          const fillRate = Math.round((count / cls.capacity) * 100);
          const teacher = teachers.find((t) => t.id === cls.mainTeacherId);

          return (
            <div
              key={cls.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                    {cls.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      cls.cycle === 'lycee'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                        : cls.cycle === 'college'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    }`}
                  >
                    {cls.cycle} • {cls.level}
                  </span>
                </div>

                {/* Room */}
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <DoorOpen className="w-3.5 h-3.5 text-blue-500" />
                  <span>Salle assignée : <strong>{cls.roomNumber}</strong></span>
                </div>

                {/* Principal Teacher */}
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    Prof. Principal :{' '}
                    <strong className="text-slate-700 dark:text-slate-200">
                      {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Non assigné'}
                    </strong>
                  </span>
                </div>

                {/* Capacity Gauge */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Effectif réel
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {count} / {cls.capacity} ({fillRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        fillRate >= 90
                          ? 'bg-red-500'
                          : fillRate >= 70
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, fillRate)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectClass && onSelectClass(cls.id)}
                className="mt-4 w-full py-2 bg-slate-50 dark:bg-slate-700/60 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Voir les {count} élèves</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal New Class */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Ajouter une Nouvelle Classe
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom de la classe *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 3ème D ou Terminale C"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cycle
                  </label>
                  <select
                    value={cycle}
                    onChange={(e) => setCycle(e.target.value as SchoolCycle)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="primaire">Primaire</option>
                    <option value="college">Collège</option>
                    <option value="lycee">Lycée</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Niveau
                  </label>
                  <input
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="Ex: 3ème, Tle D"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Capacité (Places)
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Numéro de Salle
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Professeur Principal
                </label>
                <select
                  value={mainTeacherId}
                  onChange={(e) => setMainTeacherId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.firstName} {t.lastName} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
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
                  Créer la classe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
