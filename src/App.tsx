import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudentsView } from './components/students/StudentsView';
import { StudentRegisterModal } from './components/students/StudentRegisterModal';
import { StudentDetailModal } from './components/students/StudentDetailModal';
import { ClassesView } from './components/classes/ClassesView';
import { TeachersView } from './components/teachers/TeachersView';
import { StaffView } from './components/staff/StaffView';
import { FinancesView } from './components/finances/FinancesView';
import { PaymentsView } from './components/payments/PaymentsView';
import { ReceiptModal } from './components/payments/ReceiptModal';
import { GradesView } from './components/grades/GradesView';
import { BulletinModal } from './components/grades/BulletinModal';
import { ScheduleView } from './components/schedule/ScheduleView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { ParentPortalView } from './components/parent-portal/ParentPortalView';
import { StudentPortalView } from './components/student-portal/StudentPortalView';
import { CommunicationView } from './components/communication/CommunicationView';
import { DocumentsView } from './components/documents/DocumentsView';
import { LibraryView } from './components/library/LibraryView';
import { TransportCanteenView } from './components/transport-canteen/TransportCanteenView';
import { ReportsView } from './components/reports/ReportsView';
import { AiAssistantView } from './components/ai-assistant/AiAssistantView';
import { SettingsView } from './components/settings/SettingsView';
import { AuditView } from './components/audit/AuditView';
import { ShowcaseView } from './components/showcase/ShowcaseView';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, students, payments, viewMode } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global modal triggers
  const [inspectStudentId, setInspectStudentId] = useState<string | null>(null);
  const [inspectPaymentId, setInspectPaymentId] = useState<string | null>(null);
  const [inspectBulletinStudentId, setInspectBulletinStudentId] = useState<string | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // When in showcase mode, render the public landing and login page
  if (viewMode === 'showcase') {
    return <ShowcaseView />;
  }

  const selectedStudent = students.find((s) => s.id === inspectStudentId);
  const selectedPayment = payments.find((p) => p.id === inspectPaymentId);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onSelectStudent={(id) => setInspectStudentId(id)}
            onOpenReceipt={(id) => setInspectPaymentId(id)}
          />
        );
      case 'students':
      case 'admissions':
        return (
          <StudentsView
            onOpenReceipt={(id) => setInspectPaymentId(id)}
            onOpenBulletin={(id) => setInspectBulletinStudentId(id)}
          />
        );
      case 'classes':
        return <ClassesView onSelectClass={() => setActiveTab('students')} />;
      case 'teachers':
        return <TeachersView />;
      case 'staff':
        return <StaffView />;
      case 'finances':
        return <FinancesView />;
      case 'payments':
        return <PaymentsView initialReceiptId={inspectPaymentId || undefined} />;
      case 'grades':
        return <GradesView />;
      case 'schedule':
        return <ScheduleView />;
      case 'attendance':
        return <AttendanceView />;
      case 'parent_portal':
        return <ParentPortalView />;
      case 'student_portal':
        return <StudentPortalView />;
      case 'communication':
        return <CommunicationView />;
      case 'documents':
        return <DocumentsView />;
      case 'library':
        return <LibraryView />;
      case 'transport_canteen':
        return <TransportCanteenView />;
      case 'reports':
        return <ReportsView />;
      case 'ai_assistant':
        return <AiAssistantView />;
      case 'settings':
        return <SettingsView />;
      case 'audit':
        return <AuditView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F5F9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenQuickPayment={() => setActiveTab('payments')}
          onOpenQuickRegister={() => setShowRegisterModal(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      {showRegisterModal && (
        <StudentRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSuccess={(id) => setInspectStudentId(id)}
        />
      )}

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setInspectStudentId(null)}
          onOpenReceipt={(id) => {
            setInspectStudentId(null);
            setInspectPaymentId(id);
          }}
          onOpenBulletin={(id) => {
            setInspectStudentId(null);
            setInspectBulletinStudentId(id);
          }}
        />
      )}

      {selectedPayment && (
        <ReceiptModal
          payment={selectedPayment}
          onClose={() => setInspectPaymentId(null)}
        />
      )}

      {inspectBulletinStudentId && (
        <BulletinModal
          studentId={inspectBulletinStudentId}
          onClose={() => setInspectBulletinStudentId(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
