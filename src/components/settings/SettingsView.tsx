import React, { useState } from 'react';
import {
  Settings,
  School,
  Building2,
  Calendar,
  Save,
  RotateCcw,
  ShieldCheck,
  CheckCircle,
  Database,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    currentEstablishment,
    establishments,
    setEstablishmentId,
    resetDemoData,
  } = useApp();

  const [name, setName] = useState(currentEstablishment.name);
  const [address, setAddress] = useState(currentEstablishment.address);
  const [commune, setCommune] = useState(currentEstablishment.commune);
  const [city, setCity] = useState(currentEstablishment.city);
  const [phone, setPhone] = useState(currentEstablishment.phone);
  const [email, setEmail] = useState(currentEstablishment.email);
  const [directorName, setDirectorName] = useState(currentEstablishment.directorName);
  const [currentYear, setCurrentYear] = useState(currentEstablishment.currentYear);
  const [motto, setMotto] = useState(currentEstablishment.motto);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    currentEstablishment.name = name;
    currentEstablishment.address = address;
    currentEstablishment.commune = commune;
    currentEstablishment.city = city;
    currentEstablishment.phone = phone;
    currentEstablishment.email = email;
    currentEstablishment.directorName = directorName;
    currentEstablishment.currentYear = currentYear;
    currentEstablishment.motto = motto;

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Paramètres & Multi-Établissements SaaS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Personnalisation de l’identité de l’école, gestion des années scolaires et maintenance du système.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Paramètres de l’établissement mis à jour avec succès !</span>
        </div>
      )}

      {/* Multi-School Switcher Banner */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          Changer d’Établissement Actif (Mode Multi-Écoles)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Dans l’architecture SaaS de ScolarCI, chaque établissement dispose de sa propre base cloisonnée.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {establishments.map((est) => (
            <div
              key={est.id}
              onClick={() => setEstablishmentId(est.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                est.id === currentEstablishment.id
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <School className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">{est.name}</h3>
                <p className="text-[11px] text-slate-400">{est.commune}, {est.city} • {est.currentYear}</p>
                {est.id === currentEstablishment.id && (
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Actuellement sélectionné</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Identity Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5 text-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <School className="w-4 h-4 text-blue-600" />
          Identité & En-Tête Officiel de l’Établissement
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nom complet de l’établissement *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Devise de l’école
            </label>
            <input
              type="text"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white italic"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chef d’Établissement / Directeur *
            </label>
            <input
              type="text"
              required
              value={directorName}
              onChange={(e) => setDirectorName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Année Scolaire en cours *
            </label>
            <input
              type="text"
              required
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Adresse physique & Boîte postale
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Commune & Ville
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Bagohouo"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Duékoué"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Téléphone Standard
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              E-mail Administratif
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les Modifications</span>
          </button>
        </div>
      </form>

      {/* System Maintenance & Demo Reset */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-500" />
            Réinitialisation de la Démonstration
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Restaure l’ensemble des élèves, notes, présences, et encaissements FCFA pré-configurés pour la Côte d’Ivoire.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Voulez-vous réinitialiser toutes les données de la démo à leur état initial ?')) {
              resetDemoData();
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Réinitialiser les Données Démo</span>
        </button>
      </div>
    </div>
  );
};
