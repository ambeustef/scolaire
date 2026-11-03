import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  School,
  QrCode,
  CheckCircle,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DocumentsView: React.FC = () => {
  const { students, classes, currentEstablishment } = useApp();

  const [docType, setDocType] = useState<
    'certificat_scolarite' | 'attestation_frequentation' | 'radiation'
  >('certificat_scolarite');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');

  const student = students.find((s) => s.id === selectedStudentId);
  const cls = classes.find((c) => c.id === student?.classId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Documents Administratifs & Attestations Officielles
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Génération instantanée de certificats de scolarité, attestations de fréquentation et documents ministériels.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer le Document (Format A4)</span>
        </button>
      </div>

      {/* Selectors */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
            Type de document :
          </label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as any)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
          >
            <option value="certificat_scolarite">Certificat de Scolarité Officiel</option>
            <option value="attestation_frequentation">Attestation de Fréquentation</option>
            <option value="radiation">Certificat de Radiation / Transfert</option>
          </select>
        </div>

        <div className="flex-1 min-w-[240px]">
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
            Sélectionner l’Élève :
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
          >
            {students.map((st) => {
              const c = classes.find((cl) => cl.id === st.classId);
              return (
                <option key={st.id} value={st.id}>
                  {st.lastName} {st.firstName} ({st.matricule} - {c?.name})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Printable Document Preview */}
      <div className="printable-card bg-white text-slate-900 p-10 sm:p-14 rounded-2xl border border-slate-200 shadow-xl max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
          <div className="text-left text-xs space-y-0.5">
            <p className="font-bold uppercase text-[10px] tracking-wider text-slate-700">
              RÉPUBLIQUE DE CÔTE D’IVOIRE
            </p>
            <p className="text-[9px] text-slate-500 italic">Union - Discipline - Travail</p>
            <p className="text-[10px] text-slate-600 mt-1 font-semibold">
              MINISTÈRE DE L’ÉDUCATION NATIONALE
            </p>
            <p className="text-[9px] text-slate-500">DRENA DUÉKOUÉ • IEP BAGOHOUO</p>
            <p className="font-extrabold text-blue-900 text-sm mt-1 uppercase">
              {currentEstablishment.name}
            </p>
            <p className="text-[10px] text-slate-600">{currentEstablishment.address}</p>
            <p className="text-[10px] text-slate-600">Tél : {currentEstablishment.phone}</p>
          </div>

          <div className="text-right">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              <School className="w-8 h-8 text-blue-900" />
            </div>
            <p className="text-[10px] font-mono text-slate-500 mt-2">
              Réf : {docType === 'certificat_scolarite' ? 'CS' : 'AF'}-{new Date().getFullYear()}-00{student?.id.slice(-2)}
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-4">
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900 inline-block border-b-2 border-slate-900 pb-1">
            {docType === 'certificat_scolarite'
              ? 'CERTIFICAT DE SCOLARITÉ'
              : docType === 'attestation_frequentation'
              ? 'ATTESTATION DE FRÉQUENTATION'
              : 'CERTIFICAT DE RADIATION'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">Année Scolaire {currentEstablishment.currentYear}</p>
        </div>

        {/* Certificate Text Body */}
        <div className="text-sm leading-relaxed text-slate-800 space-y-4">
          <p>
            Le Directeur du <strong>{currentEstablishment.name}</strong>, soussigné, certifie que l’élève :
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 font-medium">
            <p>
              Nom et Prénoms : <strong className="text-sm text-slate-900">{student?.lastName} {student?.firstName}</strong>
            </p>
            <p>
              Matricule National : <strong className="font-mono text-blue-800">{student?.matricule}</strong>
            </p>
            <p>
              Date et Lieu de Naissance : <strong>{student?.dateOfBirth}</strong> à <strong>{student?.placeOfBirth}</strong>
            </p>
            <p>
              Nationalité : <strong>{student?.nationality}</strong>
            </p>
            <p>
              Nom du Parent / Tuteur légal : <strong>{student?.parentName}</strong>
            </p>
          </div>

          <p>
            Est régulièrement inscrit(e) et fréquente les cours dans notre établissement au titre de l’année scolaire{' '}
            <strong>{currentEstablishment.currentYear}</strong> en classe de :
          </p>

          <div className="text-center py-2">
            <span className="text-base font-black px-6 py-2 rounded-xl bg-blue-100 text-blue-950 inline-block border border-blue-300">
              {cls?.name} ({cls?.cycle.toUpperCase()})
            </span>
          </div>

          <p className="text-xs text-slate-600">
            En foi de quoi, le présent document lui est délivré pour servir et valoir ce que de droit.
          </p>
        </div>

        {/* Signatures & Seal */}
        <div className="pt-8 grid grid-cols-2 gap-8 items-end text-xs">
          <div>
            <p className="text-slate-500 text-[11px]">Fait à {currentEstablishment.commune || 'Bagohouo'}, le {new Date().toLocaleDateString('fr-FR')}</p>
            <div className="mt-4 w-16 h-16 border border-slate-300 rounded-lg p-1 bg-white">
              <QrCode className="w-full h-full text-slate-800" />
            </div>
            <span className="text-[9px] text-slate-400 font-mono">Authentifié ScolarCI</span>
          </div>

          <div className="text-right">
            <p className="font-bold text-slate-800">Le Chef d’Établissement</p>
            <p className="text-[11px] text-blue-900 font-semibold">{currentEstablishment.directorName}</p>
            <div className="h-16 flex items-center justify-end">
              <div className="border-2 border-blue-800 text-blue-900 px-3 py-1 rounded text-[10px] font-black uppercase rotate-[-3deg]">
                DIRECTION DES ÉTUDES - SCOLARCI
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
