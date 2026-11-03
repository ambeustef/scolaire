import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  Package,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LibraryView: React.FC = () => {
  const { library, borrows, borrowBook, returnBook, students } = useApp();

  const [activeTab, setActiveTab] = useState<'books' | 'borrows' | 'inventory'>('books');
  const [search, setSearch] = useState('');

  const [selectedBookId, setSelectedBookId] = useState(library[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [dueDate, setDueDate] = useState('2024-11-20');
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  const filteredBooks = library.filter((b) => {
    const q = search.toLowerCase();
    return !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q);
  });

  const handleBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    borrowBook(selectedBookId, selectedStudentId, dueDate);
    setShowBorrowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            Bibliothèque & Gestion du Matériel
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fonds documentaire (littérature africaine, manuels CIAM) et suivi des prêts aux élèves.
          </p>
        </div>

        <button
          onClick={() => setShowBorrowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Enregistrer un Prêt d’Ouvrage</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('books')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'books'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          Catalogue des Livres ({library.length})
        </button>
        <button
          onClick={() => setActiveTab('borrows')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'borrows'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          Prêts en Cours & Retours ({borrows.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'inventory'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          Stocks Fournitures & Matériel
        </button>
      </div>

      {/* Books Tab */}
      {activeTab === 'books' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, auteur, collection..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-transparent border-none focus:outline-hidden text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBooks.map((bk) => (
              <div
                key={bk.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {bk.category}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2">
                    {bk.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Par {bk.author}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">ISBN : {bk.isbn}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Emplacement : <strong>{bk.shelfLocation}</strong></span>
                  <span
                    className={`font-bold ${
                      bk.availableCopies > 0 ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {bk.availableCopies} dispo / {bk.totalCopies}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Borrows Tab */}
      {activeTab === 'borrows' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Livre</th>
                  <th className="py-3 px-4">Élève Emprunteur</th>
                  <th className="py-3 px-4">Date de Prêt</th>
                  <th className="py-3 px-4">Date Limite de Retour</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {borrows.map((br) => {
                  const book = library.find((b) => b.id === br.bookId);
                  const st = students.find((s) => s.id === br.studentId);

                  return (
                    <tr key={br.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {book?.title}
                      </td>
                      <td className="py-3 px-4">
                        {st ? `${st.firstName} ${st.lastName}` : 'Élève'}
                        <div className="text-[10px] text-slate-400 font-mono">{st?.matricule}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{br.borrowDate}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {br.dueDate}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            br.status === 'rendu'
                              ? 'bg-emerald-100 text-emerald-800'
                              : br.status === 'en_retard'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {br.status === 'rendu'
                            ? 'Rendu'
                            : br.status === 'en_retard'
                            ? 'En retard'
                            : 'En cours'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {br.status !== 'rendu' && (
                          <button
                            onClick={() => returnBook(br.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-bold hover:bg-emerald-100 inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Enregistrer retour</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase block">Rames de Papier A4</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">85 cartons</span>
            <span className="text-xs text-emerald-600 font-semibold mt-1 block">Stock suffisant</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase block">Craies & Marqueurs</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">120 boîtes</span>
            <span className="text-xs text-emerald-600 font-semibold mt-1 block">En réserve</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase block">Micro-ordinateurs Salle Info</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">32 postes</span>
            <span className="text-xs text-blue-600 font-semibold mt-1 block">Opérationnels</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase block">Bancs & Tables</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">450 unités</span>
            <span className="text-xs text-emerald-600 font-semibold mt-1 block">Bon état</span>
          </div>
        </div>
      )}

      {/* Modal Borrow Book */}
      {showBorrowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4">
              Enregistrer un Prêt de Livre
            </h3>
            <form onSubmit={handleBorrow} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ouvrage emprunté
                </label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  {library.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                      {b.title} ({b.availableCopies} dispo)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Élève emprunteur
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.firstName} {st.lastName} ({st.matricule})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date Limite de Retour
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBorrowModal(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700"
                >
                  Valider le prêt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
