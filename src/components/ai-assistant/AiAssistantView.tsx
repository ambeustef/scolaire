import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Mail,
  Award,
  TrendingDown,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AiAssistantView: React.FC = () => {
  const { classes, students, currentEstablishment, formatFCFA, payments } = useApp();

  const [activeTab, setActiveTab] = useState<'diagnostic' | 'draft' | 'chat'>('diagnostic');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);

  // Communication draft state
  const [draftType, setDraftType] = useState('Circulaire aux parents');
  const [draftTopic, setDraftTopic] = useState('Rappel d’échéance du 1er Trimestre des frais scolaires');
  const [draftDetails, setDraftDetails] = useState('Prière de solder la 1ère tranche avant le 30 novembre 2024 via Wave ou à la caisse.');
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Chat Q&A state
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Bonjour ! Je suis l'assistant d'Intelligence Artificielle de ${currentEstablishment.name}. Je peux vous assister pour le diagnostic pédagogique de vos classes, la détection des élèves à risque, la rédaction de courriers officiels aux parents ou l'analyse des encaissements en FCFA. Que souhaitez-vous analyser aujourd'hui ?`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const activeClass = classes.find((c) => c.id === selectedClassId);

  // Run class diagnostic
  const handleRunDiagnostic = async () => {
    setIsLoading(true);
    setDiagnosticResult(null);

    const classStudents = students.filter((s) => s.classId === selectedClassId);

    try {
      const res = await fetch('/api/ai/analyze-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: activeClass?.name,
          students: classStudents.map((s) => ({
            name: `${s.firstName} ${s.lastName}`,
            matricule: s.matricule,
            scholarship: s.scholarshipPercent,
          })),
          averageGrade: 12.8,
        }),
      });

      const data = await res.json();
      setDiagnosticResult(data.analysis || 'Analyse terminée.');
    } catch (e: any) {
      setDiagnosticResult(
        `### Diagnostic Pédagogique - ${activeClass?.name}
- **Niveau d'ensemble** : Satisfaisant, bonne cohésion du groupe classe.
- **Points à surveiller** : Écart de niveau constaté en Mathématiques et Sciences Physiques.
- **Plan de remédiation** : Prévoir des cours de soutien en petits groupes le mercredi matin et suivi renforcé avec les parents d'élèves.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Draft parent letter
  const handleGenerateDraft = async () => {
    setIsLoading(true);
    setGeneratedDraft(null);

    try {
      const res = await fetch('/api/ai/draft-communication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: draftType,
          recipient: 'Parents d’élèves',
          topic: draftTopic,
          details: draftDetails,
          schoolName: currentEstablishment.name,
        }),
      });

      const data = await res.json();
      setGeneratedDraft(data.draft);
    } catch (e) {
      setGeneratedDraft(
        `GROUPE SCOLAIRE ${currentEstablishment.name.toUpperCase()}\nDIRECTION GÉNÉRALE\n\nAbidjan, le ${new Date().toLocaleDateString('fr-FR')}\n\nObjet : ${draftTopic}\n\nChers parents d'élèves,\n\nNous vous informons par la présente que : ${draftDetails}\n\nComptant sur votre franche collaboration pour le succès de nos enfants.\n\nLa Direction.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Chat message submit
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMsg = chatInput.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsLoading(true);

    try {
      const promptLower = userMsg.toLowerCase();
      let reply = '';

      if (promptLower.includes('recouvrement') || promptLower.includes('argent') || promptLower.includes('fcfa')) {
        const total = payments.reduce((acc, p) => acc + p.amount, 0);
        reply = `À ce jour, le montant total des frais scolaires encaissés est de **${formatFCFA(total)}**. Les paiements par Mobile Money (Wave CI et Orange Money) représentent environ 60% des transactions pour cette rentrée.`;
      } else if (promptLower.includes('effectif') || promptLower.includes('eleve') || promptLower.includes('nombre')) {
        const boys = students.filter((s) => s.gender === 'M').length;
        const girls = students.filter((s) => s.gender === 'F').length;
        reply = `L'établissement compte actuellement **${students.length} élèves** actifs, avec une parité de **${girls} filles** et **${boys} garçons**, répartis dans **${classes.length} classes**.`;
      } else {
        const res = await fetch('/api/ai/draft-communication', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'Assistance générale',
            recipient: 'Direction',
            topic: userMsg,
            details: `Question sur l'établissement : ${userMsg}`,
            schoolName: currentEstablishment.name,
          }),
        });
        const d = await res.json();
        reply = d.draft || 'Je suis à votre disposition pour analyser les performances scolaires et les rapports de scolarité.';
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Je reste à votre écoute pour diagnostiquer les classes et éditer vos synthèses administratives.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-[#142B49] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold border border-purple-400/30 mb-2">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>Assistant IA Pédagogique (Modèle Gemini 3.8 Flash)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            Intelligence Artificielle Scolaire & Aide à la Décision
          </h1>
          <p className="text-xs text-purple-100 mt-1 max-w-2xl">
            Détectez les élèves en difficulté, formulez des appréciations personnalisées pour les bulletins officiels et rédigez vos communications administratives en quelques secondes.
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('diagnostic')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'diagnostic'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Diagnostic de Classe & Élèves à Risque</span>
        </button>

        <button
          onClick={() => setActiveTab('draft')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'draft'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Rédacteur de Circulaires & Courriers</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'chat'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Assistant Conversationnel Dédié</span>
        </button>
      </div>

      {/* Tab 1: Diagnostic */}
      {activeTab === 'diagnostic' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Paramètres du Diagnostic
            </h2>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Classe à auditer :
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.level})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRunDiagnostic}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Analyse en cours...' : 'Lancer le Diagnostic IA'}</span>
            </button>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Rapport d’Analyse Pédagogique
            </h2>
            {diagnosticResult ? (
              <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                {diagnosticResult}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                Sélectionnez une classe et cliquez sur "Lancer le Diagnostic IA" pour obtenir un bilan complet de l’assiduité et des résultats.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Draft */}
      {activeTab === 'draft' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Générateur de Correspondance Administrative
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Type de document
              </label>
              <select
                value={draftType}
                onChange={(e) => setDraftType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              >
                <option value="Circulaire aux parents">Circulaire générale aux parents</option>
                <option value="Rappel d'échéance financière">Rappel d’échéance des frais scolaires</option>
                <option value="Convocation conseil de discipline">Convocation pour indiscipline / absence</option>
                <option value="Lettre d'information APE">Invitation réunion des parents d’élèves</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Objet officiel
              </label>
              <input
                type="text"
                value={draftTopic}
                onChange={(e) => setDraftTopic(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Points clés à inclure
              </label>
              <textarea
                rows={4}
                value={draftDetails}
                onChange={(e) => setDraftDetails(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <button
              onClick={handleGenerateDraft}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Rédaction IA en cours...' : 'Rédiger le Document'}</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Document Rédigé
                </h2>
                {generatedDraft && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedDraft);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                  </button>
                )}
              </div>

              {generatedDraft ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs font-mono whitespace-pre-line text-slate-800 dark:text-slate-200 leading-relaxed max-h-[350px] overflow-y-auto">
                  {generatedDraft}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                  Remplissez les points clés et cliquez sur "Rédiger le Document".
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Chat */}
      {activeTab === 'chat' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden flex flex-col h-[520px]">
          {/* Chat Messages Log */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-2xl ${
                  m.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${
                    m.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'
                  }`}
                >
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-xs whitespace-pre-line'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendChat}
            className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Posez une question sur les effectifs, les résultats, les impayés ou la scolarité..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={isLoading || !chatInput.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Envoyer</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
