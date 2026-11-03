import React, { useState } from 'react';
import {
  Award,
  Filter,
  Printer,
  Sparkles,
  Save,
  CheckCircle,
  TrendingUp,
  FileText,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BulletinModal } from './BulletinModal';

export const GradesView: React.FC = () => {
  const {
    classes,
    subjects,
    students,
    grades,
    addOrUpdateGrade,
    calculateStudentAverage,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedTerm, setSelectedTerm] = useState<'Trimestre 1' | 'Trimestre 2' | 'Trimestre 3'>('Trimestre 1');
  const [inspectBulletinStudentId, setInspectBulletinStudentId] = useState<string | null>(null);

  // Local state for grade entries
  const classStudents = students.filter((s) => s.classId === selectedClassId && s.status === 'actif');
  const activeClass = classes.find((c) => c.id === selectedClassId);
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId);

  // Subject coeff in this class
  const coeff = activeClass && activeSubject ? activeSubject.coefficients[activeClass.level] || 2 : 2;

  // Grade state by studentId
  const [tempGrades, setTempGrades] = useState<
    Record<string, { interrogation: number; devoir1: number; devoir2: number; composition: number; appreciation: string }>
  >({});

  const [aiGeneratingId, setAiGeneratingId] = useState<string | null>(null);

  const getStudentGrade = (studentId: string) => {
    if (tempGrades[studentId]) return tempGrades[studentId];
    const existing = grades.find(
      (g) => g.studentId === studentId && g.subjectId === selectedSubjectId && g.term === selectedTerm
    );
    return {
      interrogation: existing?.interrogation || 12,
      devoir1: existing?.devoir1 || 12,
      devoir2: existing?.devoir2 || 12,
      composition: existing?.composition || 12,
      appreciation: existing?.teacherAppreciation || 'Bon travail dans l’ensemble.',
    };
  };

  const handleUpdateField = (
    studentId: string,
    field: 'interrogation' | 'devoir1' | 'devoir2' | 'composition' | 'appreciation',
    value: any
  ) => {
    const current = getStudentGrade(studentId);
    setTempGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...current,
        [field]: value,
      },
    }));
  };

  const handleSaveGrade = (studentId: string) => {
    const data = getStudentGrade(studentId);
    addOrUpdateGrade({
      studentId,
      classId: selectedClassId,
      subjectId: selectedSubjectId,
      term: selectedTerm,
      interrogation: Number(data.interrogation),
      devoir1: Number(data.devoir1),
      devoir2: Number(data.devoir2),
      composition: Number(data.composition),
      average: 0, // Auto calculated in context
      teacherAppreciation: data.appreciation,
    });
  };

  const handleSaveAll = () => {
    classStudents.forEach((st) => {
      handleSaveGrade(st.id);
    });
    alert('Toutes les notes de la classe ont été enregistrées avec succès !');
  };

  // AI-powered appreciation generator
  const handleGenerateAppreciation = async (studentId: string, studentName: string) => {
    const data = getStudentGrade(studentId);
    const avg = ((data.interrogation + data.devoir1 + data.devoir2) / 3 + data.composition * 2) / 3;

    setAiGeneratingId(studentId);
    try {
      const res = await fetch('/api/ai/generate-appreciation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          average: Number(avg.toFixed(2)),
          subjectNotes: { [activeSubject?.name || 'Matière']: avg.toFixed(2) },
          behavior: 'Exemplaire',
        }),
      });
      const result = await res.json();
      if (result.appreciation) {
        handleUpdateField(studentId, 'appreciation', result.appreciation);
      }
    } catch (e) {
      console.warn('AI call error:', e);
    } finally {
      setAiGeneratingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            Saisie des Notes & Bulletins Officiels
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calcul automatique des moyennes pondérées selon les coefficients officiels ivoiriens et classements.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer les Notes de la Classe</span>
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Classe :</label>
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setTempGrades({});
            }}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.cycle.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Matière :</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              setTempGrades({});
            }}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Période :</label>
          <select
            value={selectedTerm}
            onChange={(e) => {
              setSelectedTerm(e.target.value as any);
              setTempGrades({});
            }}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
          >
            <option value="Trimestre 1">Trimestre 1</option>
            <option value="Trimestre 2">Trimestre 2</option>
            <option value="Trimestre 3">Trimestre 3</option>
          </select>
        </div>
      </div>

      {/* Class Info Card */}
      <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-blue-600" />
          <div>
            <span className="font-extrabold text-blue-900 dark:text-blue-100 text-sm">
              {activeClass?.name} • {activeSubject?.name}
            </span>
            <div className="text-blue-700 dark:text-blue-300 text-[11px]">
              Coefficient officiel dans ce niveau : <strong className="text-blue-900 dark:text-blue-100 font-bold">{coeff}</strong> • Formule : (Moy. Devoirs + 2 × Compo) / 3
            </div>
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-500">
          {classStudents.length} élèves évalués
        </div>
      </div>

      {/* Grade Entry Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Élève</th>
                <th className="py-3 px-4 w-28 text-center">Interro /20</th>
                <th className="py-3 px-4 w-28 text-center">Devoir 1 /20</th>
                <th className="py-3 px-4 w-28 text-center">Devoir 2 /20</th>
                <th className="py-3 px-4 w-28 text-center">Compo /20</th>
                <th className="py-3 px-4 w-24 text-center">Moyenne</th>
                <th className="py-3 px-4">Appréciation Pédagogique</th>
                <th className="py-3 px-4 text-center">Bulletin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {classStudents.map((st) => {
                const gradeData = getStudentGrade(st.id);
                const avg =
                  ((Number(gradeData.interrogation) + Number(gradeData.devoir1) + Number(gradeData.devoir2)) / 3 +
                    Number(gradeData.composition) * 2) /
                  3;

                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30">
                    {/* Student Identity */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {st.firstName} {st.lastName}
                      </div>
                      <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                        {st.matricule}
                      </div>
                    </td>

                    {/* Interro */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        step={0.5}
                        value={gradeData.interrogation}
                        onChange={(e) => handleUpdateField(st.id, 'interrogation', Number(e.target.value))}
                        onBlur={() => handleSaveGrade(st.id)}
                        className="w-16 text-center py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold text-xs"
                      />
                    </td>

                    {/* Devoir 1 */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        step={0.5}
                        value={gradeData.devoir1}
                        onChange={(e) => handleUpdateField(st.id, 'devoir1', Number(e.target.value))}
                        onBlur={() => handleSaveGrade(st.id)}
                        className="w-16 text-center py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold text-xs"
                      />
                    </td>

                    {/* Devoir 2 */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        step={0.5}
                        value={gradeData.devoir2}
                        onChange={(e) => handleUpdateField(st.id, 'devoir2', Number(e.target.value))}
                        onBlur={() => handleSaveGrade(st.id)}
                        className="w-16 text-center py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold text-xs"
                      />
                    </td>

                    {/* Composition */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        step={0.5}
                        value={gradeData.composition}
                        onChange={(e) => handleUpdateField(st.id, 'composition', Number(e.target.value))}
                        onBlur={() => handleSaveGrade(st.id)}
                        className="w-16 text-center py-1 rounded-lg border border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 font-black text-xs text-blue-900 dark:text-blue-100"
                      />
                    </td>

                    {/* Moyenne Calculée */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-black text-sm text-blue-600 dark:text-blue-400">
                        {avg.toFixed(2)}
                      </span>
                    </td>

                    {/* Appreciation & AI button */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={gradeData.appreciation}
                          onChange={(e) => handleUpdateField(st.id, 'appreciation', e.target.value)}
                          onBlur={() => handleSaveGrade(st.id)}
                          className="flex-1 px-2.5 py-1 text-[11px] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => handleGenerateAppreciation(st.id, `${st.firstName} ${st.lastName}`)}
                          disabled={aiGeneratingId === st.id}
                          className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 hover:bg-purple-100 transition-colors shrink-0"
                          title="Générer appréciation par IA"
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${aiGeneratingId === st.id ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </td>

                    {/* Action Bulletin */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setInspectBulletinStudentId(st.id)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Bulletin</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulletin Modal */}
      {inspectBulletinStudentId && (
        <BulletinModal
          studentId={inspectBulletinStudentId}
          term={selectedTerm}
          onClose={() => setInspectBulletinStudentId(null)}
        />
      )}
    </div>
  );
};
