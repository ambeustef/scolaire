import React, { useState, useRef } from 'react';
import {
  X,
  UserPlus,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  School,
  ShieldCheck,
  CheckCircle,
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Trash2,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StudentRegisterModalProps {
  onClose: () => void;
  onSuccess?: (studentId: string) => void;
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
];

export const StudentRegisterModal: React.FC<StudentRegisterModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const { classes, addStudent, currentEstablishment } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2009-01-15');
  const [placeOfBirth, setPlaceOfBirth] = useState('Abidjan');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [nationality, setNationality] = useState('Ivoirienne');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [address, setAddress] = useState('Bagohouo Centre');
  const [parentName, setParentName] = useState('');
  const [parentProfession, setParentProfession] = useState('');
  const [parentPhone, setParentPhone] = useState('+225 07 ');
  const [parentEmail, setParentEmail] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('+225 05 ');
  const [previousSchool, setPreviousSchool] = useState('');
  const [scholarshipPercent, setScholarshipPercent] = useState<number>(0);
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [photoUrl, setPhotoUrl] = useState(SAMPLE_AVATARS[0]);
  const [isCustomUploaded, setIsCustomUploaded] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Veuillez sélectionner un fichier image valide (PNG, JPG, JPEG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Le fichier est trop lourd (taille maximale : 8 Mo).");
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
        setIsCustomUploaded(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !classId) return;

    const newStudent = addStudent({
      firstName,
      lastName,
      dateOfBirth,
      placeOfBirth,
      gender,
      nationality,
      address,
      classId,
      establishmentId: currentEstablishment.id,
      parentName: parentName || `Parent de ${lastName}`,
      parentPhone: parentPhone || '+225 07 00 00 00 00',
      parentEmail: parentEmail || `${lastName.toLowerCase()}@famille.ci`,
      parentProfession,
      emergencyContact: emergencyContact || parentPhone,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'actif',
      photoUrl,
      previousSchool,
      scholarshipPercent,
      bloodGroup,
    });

    if (onSuccess) onSuccess(newStudent.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        <div className="bg-[#142B49] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-400/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold">Inscription d’un Nouvel Élève</h2>
              <p className="text-xs text-slate-300">
                Attribution automatique du matricule officiel {currentEstablishment.currentYear}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Élève Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              1. Identité de l’Élève
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom de famille *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: KOUASSI"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prénoms *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jean-Eudes"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sexe *
                </label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'M'}
                      onChange={() => setGender('M')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Masculin (Garçon)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'F'}
                      onChange={() => setGender('F')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Féminin (Fille)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Classe d’affectation *
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.level} - {c.cycle.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date de naissance
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lieu de naissance
                </label>
                <input
                  type="text"
                  placeholder="Ex: Treichville, Abidjan"
                  value={placeOfBirth}
                  onChange={(e) => setPlaceOfBirth(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nationalité
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Groupe Sanguin
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                  <option value="A-">A-</option>
                  <option value="B-">B-</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            {/* Photo Upload & Avatar Selector */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Photo d’Identité de l’Élève *
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Obligatoire pour la carte scolaire, le dossier d’inscription et le bulletin officiel.
                  </p>
                </div>
                {isCustomUploaded && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Photo personnalisée
                  </span>
                )}
              </div>

              {/* Upload & Preview Zone */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                {/* Image Preview */}
                <div className="relative group shrink-0">
                  <img
                    src={photoUrl}
                    alt="Aperçu photo élève"
                    className="w-24 h-28 object-cover rounded-2xl border-2 border-blue-500 shadow-md ring-4 ring-blue-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-950/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 cursor-pointer"
                  >
                    <Camera className="w-5 h-5 text-white" />
                    <span>Modifier</span>
                  </button>
                </div>

                {/* Upload Action Box & Dropzone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex-1 w-full p-3 rounded-2xl border-2 transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                      : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                  }`}
                >
                  {/* Hidden native input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>{isDragging ? 'Déposez l’image ici...' : 'Importer une photo depuis l’appareil'}</span>
                    </button>

                    {isCustomUploaded && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoUrl(SAMPLE_AVATARS[0]);
                          setIsCustomUploaded(false);
                          setUploadError(null);
                        }}
                        className="px-3 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-red-50 hover:text-red-600 text-xs font-semibold transition-colors flex items-center gap-1.5"
                        title="Réinitialiser la photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Réinitialiser</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2">
                    Glissez-déposez une image ou cliquez pour parcourir vos fichiers.
                    Formats acceptés : <strong>PNG, JPG, JPEG, WebP</strong> (Max : 8 Mo).
                  </p>

                  {uploadError && (
                    <p className="text-[11px] font-semibold text-red-500 flex items-center gap-1 mt-1.5">
                      ⚠️ {uploadError}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Preset Photos (Optional fallback) */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                  Ou choisir parmi les photos de démonstration :
                </span>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {SAMPLE_AVATARS.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Avatar prédéfini ${index + 1}`}
                      onClick={() => {
                        setPhotoUrl(url);
                        setIsCustomUploaded(false);
                        setUploadError(null);
                      }}
                      className={`w-11 h-11 rounded-xl object-cover cursor-pointer ring-2 transition-all ${
                        photoUrl === url && !isCustomUploaded
                          ? 'ring-blue-600 scale-105 shadow-md'
                          : 'ring-transparent opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Parent & Responsable Légal */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              2. Informations Parent / Tuteur Légal
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom & Prénoms du Parent *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: M. KOUASSI Jérôme"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Profession du parent
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cadre d’entreprise / Pharmacien"
                  value={parentProfession}
                  onChange={(e) => setParentProfession(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Téléphone Principal (SMS & Alertes) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+225 07 00 00 00 00"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact d’urgence médicale
                </label>
                <input
                  type="text"
                  placeholder="+225 05 00 00 00 00 (Mère ou Oncle)"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Adresse du domicile
                </label>
                <input
                  type="text"
                  placeholder="Ex: Bagohouo Centre, Quartier Mairie"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Bourses & Exonérations */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <School className="w-4 h-4 text-purple-500" />
              3. Bourse & Établissement Antérieur
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bourse ou Réduction accordée (%)
                </label>
                <select
                  value={scholarshipPercent}
                  onChange={(e) => setScholarshipPercent(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value={0}>Aucune (Plein tarif)</option>
                  <option value={25}>25% Réduction fratrie</option>
                  <option value={50}>50% Demi-bourse d’excellence</option>
                  <option value={100}>100% Exonération totale</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Établissement de provenance
                </label>
                <input
                  type="text"
                  placeholder="Ex: EPP Bagohouo 1 ou Collège Moderne Duékoué"
                  value={previousSchool}
                  onChange={(e) => setPreviousSchool(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Valider l’inscription</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
