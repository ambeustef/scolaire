import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Send,
  MessageSquare,
  Users,
  Smartphone,
  Mail,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommunicationView: React.FC = () => {
  const { announcements, addAnnouncement, currentUser, classes } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetRole, setTargetRole] = useState<'tous' | 'parents' | 'enseignants' | 'eleves'>('parents');
  const [priority, setPriority] = useState<'normale' | 'urgente'>('normale');

  // SMS Broadcast simulator state
  const [smsChannel, setSmsChannel] = useState<'sms' | 'whatsapp'>('whatsapp');
  const [smsMessage, setSmsMessage] = useState('Chers parents, rappel : réunion générale et remise des bulletins ce samedi à 09h00.');
  const [sentStatus, setSentStatus] = useState<string | null>(null);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    addAnnouncement({
      title,
      content,
      targetRole,
      priority,
      date: new Date().toISOString().split('T')[0],
      author: currentUser.title,
    });

    setShowAddModal(false);
    setTitle('');
    setContent('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsMessage) return;

    setSentStatus(
      `Campagne ${smsChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'} transmise avec succès à 184 contacts parents via l'API Orange/MTN CI !`
    );
    setTimeout(() => setSentStatus(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-blue-600" />
            Communication & Diffusion SMS / WhatsApp
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Circulaires internes, alertes urgentes et diffusion de messages instantanés aux parents et enseignants.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Annonce Scolaire</span>
        </button>
      </div>

      {sentStatus && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{sentStatus}</span>
        </div>
      )}

      {/* Grid: Broadcast SMS + Announcements Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SMS / WhatsApp Simulator */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Diffusion SMS & WhatsApp Direct
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Envoi d’alertes groupées instantanées sur les téléphones des parents (Côte d’Ivoire : +225).
          </p>

          <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Canal de diffusion :
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSmsChannel('whatsapp')}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    smsChannel === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  WhatsApp Business
                </button>
                <button
                  type="button"
                  onClick={() => setSmsChannel('sms')}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    smsChannel === 'sms'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  SMS Réseau GSM
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Message à diffuser :
              </label>
              <textarea
                rows={4}
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>{smsMessage.length} caractères</span>
                <span>~ 1 SMS par parent</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Diffuser aux Parents ({classes.length} Classes)</span>
            </button>
          </form>
        </div>

        {/* Announcements List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Annonces Officielles & Circulaires Publiées ({announcements.length})
            </h2>
          </div>

          <div className="space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ann.priority === 'urgente'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                      }`}
                    >
                      {ann.priority}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      Cible : {ann.targetRole.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{ann.date}</span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {ann.content}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-400 italic">
                  Par {ann.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal New Announcement */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Publier une Annonce
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Titre de l’annonce *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Calendrier des examens blancs"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Destinataires
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="tous">Tous</option>
                    <option value="parents">Parents uniquement</option>
                    <option value="enseignants">Enseignants</option>
                    <option value="eleves">Élèves</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priorité
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="normale">Normale</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contenu détaillé de la note *
                </label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
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
                  Publier l’annonce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
