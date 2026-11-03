import React, { useState } from 'react';
import {
  X,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  School,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PreRegisterModalProps {
  onClose: () => void;
}

export const PreRegisterModal: React.FC<PreRegisterModalProps> = ({ onClose }) => {
  const { currentEstablishment, classes } = useApp();

  const [studentLastName, setStudentLastName] = useState('');
  const [studentFirstName, setStudentFirstName] = useState('');
  const [birthDate, setBirthDate] = useState('2011-04-12');
  const [birthPlace, setBirthPlace] = useState('Bagohouo');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [desiredClass, setDesiredClass] = useState('6ème 1');
  const [previousSchool, setPreviousSchool] = useState('EPP Bagohouo 1');

  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('+225 07 ');
  const [parentEmail, setParentEmail] = useState('');
  const [address, setAddress] = useState('Bagohouo Quartier Mission');

  const [submitted, setSubmitted] = useState(false);
  const [dossierNumber, setDossierNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentLastName || !studentFirstName || !parentName || !parentPhone) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `DOS-CMB-${new Date().getFullYear()}-${randomNum}`;
    setDossierNumber(code);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#142B49] text-white p-6 sm:p-7 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 block">
                Session Rentrée {currentEstablishment.currentYear}
              </span>
              <h2 className="text-xl font-black text-white">Demande de Pré-Inscription</h2>
              <p className="text-xs text-slate-300 mt-0.5">{currentEstablishment.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 block">
                Dossier Enregistré avec Succès
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                Merci {parentName} !
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                La demande de pré-inscription pour{' '}
                <strong className="text-slate-900 dark:text-white font-bold">
                  {studentFirstName} {studentLastName}
                </strong>{' '}
                a bien été transmise au secrétariat du Collège Moderne Bagohouo.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto text-left space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">N° de Dossier :</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{dossierNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Classe demandée :</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{desiredClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Statut :</span>
                <span className="font-semibold text-amber-600">En cours d'étude</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Vous recevrez une notification par SMS au {parentPhone} pour finaliser le dépôt des pièces physiques.
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Fermer la fenêtre
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 max-h-[70vh] overflow-y-auto">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4" />
                1. Renseignements sur le futur élève
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nom de l’élève *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: KOUASSI"
                    value={studentLastName}
                    onChange={(e) => setStudentLastName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prénoms *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ange Emmanuel"
                    value={studentFirstName}
                    onChange={(e) => setStudentFirstName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sexe
                  </label>
                  <div className="flex gap-4 mt-1.5">
                    <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                      <input
                        type="radio"
                        checked={gender === 'M'}
                        onChange={() => setGender('M')}
                        className="text-blue-600"
                      />
                      <span>Masculin</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                      <input
                        type="radio"
                        checked={gender === 'F'}
                        onChange={() => setGender('F')}
                        className="text-blue-600"
                      />
                      <span>Féminin</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Classe sollicitée *
                  </label>
                  <select
                    value={desiredClass}
                    onChange={(e) => setDesiredClass(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="6ème 1">6ème (Entrée en 1er Cycle)</option>
                    <option value="5ème 1">5ème</option>
                    <option value="4ème 1">4ème</option>
                    <option value="3ème 1">3ème (Préparation BEPC)</option>
                    <option value="2nde A">2nde Générale</option>
                    <option value="1ère D">1ère Scientifique</option>
                    <option value="Tle D">Terminale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Établissement d'origine
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: EPP Bagohouo 1"
                    value={previousSchool}
                    onChange={(e) => setPreviousSchool(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                2. Contact du parent ou tuteur légal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nom & Prénoms du Parent *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: M. KOUASSI Noël"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Numéro de Téléphone (SMS & Appel) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+225 07 00 00 00 00"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Quartier de résidence à Bagohouo / Duékoué
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Quartier Commerce, face grande mosquée"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Envoyer la demande de pré-inscription</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
