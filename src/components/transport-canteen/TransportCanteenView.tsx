import React, { useState } from 'react';
import {
  Bus,
  Coffee,
  MapPin,
  Phone,
  User,
  Calendar,
  UtensilsCrossed,
  Users,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TransportCanteenView: React.FC = () => {
  const { transportRoutes, canteenMenu, formatFCFA } = useApp();

  const [activeTab, setActiveTab] = useState<'transport' | 'canteen'>('transport');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bus className="w-6 h-6 text-blue-600" />
            Transport Scolaire & Restauration / Cantine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestion des circuits de ramassage par car à Abidjan et menus de la demi-pension.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('transport')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'transport'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Lignes de Bus Scolaire ({transportRoutes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('canteen')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'canteen'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Menus & Abonnements Cantine ({canteenMenu.length} Jours)</span>
        </button>
      </div>

      {/* Tab: Transport */}
      {activeTab === 'transport' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transportRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {route.busNumber}
                  </span>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {route.name}
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {formatFCFA(route.monthlyFee)} / mois
                </span>
              </div>

              {/* Driver info */}
              <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    Chauffeur : {route.driverName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-mono text-[11px]">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{route.driverPhone}</span>
                </div>
              </div>

              {/* Stops */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Itinéraire & Points de Ramassage
                </span>
                <div className="flex flex-wrap gap-2">
                  {route.stops.map((stop, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium"
                    >
                      <MapPin className="w-3 h-3 text-blue-500" />
                      <span>{stop}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Capacity bar */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Places occupées</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {route.studentCount} / {route.capacity} élèves
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${(route.studentCount / route.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Canteen */}
      {activeTab === 'canteen' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {canteenMenu.map((m) => (
              <div
                key={m.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      {m.day}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{m.date}</span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Entrée</span>
                      <p className="text-slate-700 dark:text-slate-200 font-medium mt-0.5">{m.starter}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-500 block">Plat de Résistance</span>
                      <p className="text-slate-900 dark:text-white font-extrabold text-sm mt-0.5">{m.mainDish}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Dessert</span>
                      <p className="text-slate-700 dark:text-slate-200 font-medium mt-0.5">{m.dessert}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Demi-pensionnaires servis :</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">
                    {m.totalSubscribers} repas
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
