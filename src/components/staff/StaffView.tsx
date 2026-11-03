import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Phone,
  Mail,
  Building,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StaffView: React.FC = () => {
  const { staff } = useApp();
  const [search, setSearch] = useState('');

  const filteredStaff = staff.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roleTitle.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Personnel Administratif & Encadrement
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Direction générale, secrétariat, comptabilité et surveillance générale de l’établissement.
          </p>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    {member.roleTitle}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {member.department}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="font-mono text-[11px]">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] truncate">{member.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
              <span>Date d’entrée :</span>
              <strong className="text-slate-600 dark:text-slate-300">{member.hireDate}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
