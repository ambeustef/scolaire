import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Download,
  Eye,
  Trash2,
  Edit2,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  GraduationCap,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { StudentDetailModal } from './StudentDetailModal';
import { StudentRegisterModal } from './StudentRegisterModal';

interface StudentsViewProps {
  onOpenReceipt?: (paymentId: string) => void;
  onOpenBulletin?: (studentId: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  onOpenReceipt,
  onOpenBulletin,
}) => {
  const {
    students,
    classes,
    deleteStudent,
    formatFCFA,
    getStudentFinancialSummary,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [selectedCycle, setSelectedCycle] = useState<string>('all');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const [inspectStudent, setInspectStudent] = useState<Student | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);

  // Filter logic
  const filteredStudents = students.filter((st) => {
    const cls = classes.find((c) => c.id === st.classId);

    // Global and local search
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      !query ||
      st.firstName.toLowerCase().includes(query) ||
      st.lastName.toLowerCase().includes(query) ||
      st.matricule.toLowerCase().includes(query) ||
      (cls?.name && cls.name.toLowerCase().includes(query)) ||
      st.parentPhone.includes(query);

    // Cycle filter
    const matchCycle =
      selectedCycle === 'all' || (cls && cls.cycle === selectedCycle);

    // Class filter
    const matchClass =
      selectedClassId === 'all' || st.classId === selectedClassId;

    // Status filter
    const matchStatus =
      selectedStatus === 'all' || st.status === selectedStatus;

    return matchSearch && matchCycle && matchClass && matchStatus;
  });

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Matricule',
      'Nom',
      'Prénoms',
      'Classe',
      'Sexe',
      'Date de Naissance',
      'Parent Tuteur',
      'Téléphone Parent',
      'Reste Scolarité (FCFA)',
    ];

    const rows = filteredStudents.map((st) => {
      const cls = classes.find((c) => c.id === st.classId);
      const fin = getStudentFinancialSummary(st.id);
      return [
        st.matricule,
        st.lastName,
        st.firstName,
        cls?.name || 'N/A',
        st.gender === 'F' ? 'Féminin' : 'Masculin',
        st.dateOfBirth,
        st.parentName,
        st.parentPhone,
        fin.remaining,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `liste_eleves_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Répertoire des Élèves & Inscriptions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestion administrative, matricules officiels et dossiers complets des apprenants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-all"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Exporter Excel/CSV</span>
          </button>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nouvelle Inscription</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Nom, matricule, téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Cycle Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Cycle:</span>
          <select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="all">Tous cycles</option>
            <option value="primaire">Primaire (CP1 - CM2)</option>
            <option value="college">Collège (6e - 3e)</option>
            <option value="lycee">Lycée (2nde - Tle)</option>
          </select>
        </div>

        {/* Class Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Classe:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="all">Toutes classes ({classes.length})</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Statut:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="all">Tous statuts</option>
            <option value="actif">Actif</option>
            <option value="transfere">Transféré</option>
            <option value="radie">Radié</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Élève</th>
                <th className="py-3 px-4">Matricule</th>
                <th className="py-3 px-4">Classe & Cycle</th>
                <th className="py-3 px-4">Parent / Contact</th>
                <th className="py-3 px-4">Bourse / Statut</th>
                <th className="py-3 px-4 text-right">Reste Dû</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-xs">
                    Aucun élève ne correspond aux critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const cls = classes.find((c) => c.id === st.classId);
                  const fin = getStudentFinancialSummary(st.id);

                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors cursor-pointer"
                      onClick={() => setInspectStudent(st)}
                    >
                      {/* Photo & Nom */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.photoUrl}
                            alt={st.lastName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {st.firstName} {st.lastName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {st.gender === 'F' ? 'Fille' : 'Garçon'} • Né(e) le {st.dateOfBirth}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Matricule */}
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {st.matricule}
                      </td>

                      {/* Classe */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {cls?.name || 'Non assigné'}
                        </span>
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          {cls?.cycle}
                        </div>
                      </td>

                      {/* Contact Parent */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-700 dark:text-slate-300">
                          {st.parentName}
                        </div>
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                          {st.parentPhone}
                        </div>
                      </td>

                      {/* Bourse & Statut */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold w-fit ${
                              st.status === 'actif'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                            }`}
                          >
                            {st.status.toUpperCase()}
                          </span>
                          {st.scholarshipPercent > 0 && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                              Bourse {st.scholarshipPercent}%
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Reste Dû */}
                      <td className="py-3 px-4 text-right">
                        {fin.remaining === 0 ? (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            Soldé (0 FCFA)
                          </span>
                        ) : (
                          <span className="font-bold text-red-600 dark:text-red-400">
                            {formatFCFA(fin.remaining)}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setInspectStudent(st)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                            title="Voir dossier complet"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Confirmez-vous la suppression de l'élève ${st.firstName} ${st.lastName} ?`)) {
                                deleteStudent(st.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            title="Supprimer l'élève"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Student Modal */}
      {inspectStudent && (
        <StudentDetailModal
          student={inspectStudent}
          onClose={() => setInspectStudent(null)}
          onOpenReceipt={onOpenReceipt}
          onOpenBulletin={onOpenBulletin}
        />
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <StudentRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSuccess={(newId) => {
            const added = students.find((s) => s.id === newId);
            if (added) setInspectStudent(added);
          }}
        />
      )}
    </div>
  );
};
