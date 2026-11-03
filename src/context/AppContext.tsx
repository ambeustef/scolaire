import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Establishment,
  ClassRoom,
  Student,
  Teacher,
  StaffMember,
  Subject,
  GradeItem,
  FeePlan,
  PaymentRecord,
  ExpenseRecord,
  AttendanceRecord,
  ScheduleItem,
  Announcement,
  LibraryBook,
  BookBorrow,
  TransportRoute,
  CanteenMenu,
  AuditLog,
} from '../types';
import {
  INITIAL_ESTABLISHMENTS,
  DEMO_USERS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_TEACHERS,
  INITIAL_STAFF,
  INITIAL_STUDENTS,
  INITIAL_FEE_PLANS,
  INITIAL_PAYMENTS,
  INITIAL_EXPENSES,
  INITIAL_GRADES,
  INITIAL_ATTENDANCE,
  INITIAL_SCHEDULE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_LIBRARY,
  INITIAL_BORROWS,
  INITIAL_TRANSPORT_ROUTES,
  INITIAL_CANTEEN_MENU,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

interface AppContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  currentEstablishment: Establishment;
  establishments: Establishment[];
  setEstablishmentId: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode: 'showcase' | 'app';
  setViewMode: (mode: 'showcase' | 'app') => void;
  isAuthenticated: boolean;
  login: (role?: UserRole, customUser?: { email: string; name: string }) => void;
  logout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  
  // Data
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'matricule'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  classes: ClassRoom[];
  addClass: (cls: Omit<ClassRoom, 'id'>) => void;
  updateClass: (id: string, updates: Partial<ClassRoom>) => void;
  
  teachers: Teacher[];
  addTeacher: (tch: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  
  staff: StaffMember[];
  subjects: Subject[];
  
  feePlans: FeePlan[];
  updateFeePlan: (id: string, updates: Partial<FeePlan>) => void;
  
  payments: PaymentRecord[];
  addPayment: (payment: Omit<PaymentRecord, 'id' | 'receiptNumber'>) => PaymentRecord;
  
  expenses: ExpenseRecord[];
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  
  grades: GradeItem[];
  addOrUpdateGrade: (grade: Omit<GradeItem, 'id'> & { id?: string }) => void;
  
  attendance: AttendanceRecord[];
  markAttendance: (
    date: string,
    classId: string,
    records: { studentId: string; status: 'present' | 'absent' | 'retard' | 'excuse'; reason?: string; time?: string }[]
  ) => void;
  
  schedule: ScheduleItem[];
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => { success: boolean; conflict?: string };
  deleteScheduleItem: (id: string) => void;
  
  announcements: Announcement[];
  addAnnouncement: (ann: Omit<Announcement, 'id'>) => void;
  
  library: LibraryBook[];
  borrows: BookBorrow[];
  borrowBook: (bookId: string, studentId: string, dueDate: string) => void;
  returnBook: (borrowId: string) => void;
  
  transportRoutes: TransportRoute[];
  canteenMenu: CanteenMenu[];
  auditLogs: AuditLog[];
  
  // Helpers
  formatFCFA: (amount: number) => string;
  getStudentById: (id: string) => Student | undefined;
  getClassById: (id: string) => ClassRoom | undefined;
  getTeacherById: (id: string) => Teacher | undefined;
  getSubjectById: (id: string) => Subject | undefined;
  getStudentFinancialSummary: (studentId: string) => { totalDue: number; totalPaid: number; remaining: number };
  calculateStudentAverage: (studentId: string, term?: string) => { average: number; details: any[]; rank?: number; totalStudents?: number };
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'scolarci_state_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load initial from localStorage
  const savedState = (() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  })();

  const [establishments] = useState<Establishment[]>(INITIAL_ESTABLISHMENTS);
  const [currentEstId, setCurrentEstId] = useState<string>(() => {
    if (savedState?.currentEstId && INITIAL_ESTABLISHMENTS.some((e) => e.id === savedState.currentEstId)) {
      return savedState.currentEstId;
    }
    return INITIAL_ESTABLISHMENTS[0].id;
  });
  
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const defaultUser = DEMO_USERS[0]; // Super Admin
    if (savedState?.currentUserId) {
      const found = DEMO_USERS.find((u) => u.id === savedState.currentUserId);
      if (found) return found;
    }
    return defaultUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return savedState?.isAuthenticated ?? false;
  });

  const [viewMode, setViewMode] = useState<'showcase' | 'app'>(() => {
    if (savedState?.viewMode) return savedState.viewMode;
    return savedState?.isAuthenticated ? 'app' : 'showcase';
  });

  const [activeTab, setActiveTab] = useState<string>(savedState?.activeTab || 'dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(savedState?.darkMode || false);

  const [students, setStudents] = useState<Student[]>(savedState?.students || INITIAL_STUDENTS);
  const [classes, setClasses] = useState<ClassRoom[]>(savedState?.classes || INITIAL_CLASSES);
  const [teachers, setTeachers] = useState<Teacher[]>(savedState?.teachers || INITIAL_TEACHERS);
  const [staff] = useState<StaffMember[]>(savedState?.staff || INITIAL_STAFF);
  const [subjects] = useState<Subject[]>(savedState?.subjects || INITIAL_SUBJECTS);
  const [feePlans, setFeePlans] = useState<FeePlan[]>(savedState?.feePlans || INITIAL_FEE_PLANS);
  const [payments, setPayments] = useState<PaymentRecord[]>(savedState?.payments || INITIAL_PAYMENTS);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(savedState?.expenses || INITIAL_EXPENSES);
  const [grades, setGrades] = useState<GradeItem[]>(savedState?.grades || INITIAL_GRADES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(savedState?.attendance || INITIAL_ATTENDANCE);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(savedState?.schedule || INITIAL_SCHEDULE);
  const [announcements, setAnnouncements] = useState<Announcement[]>(savedState?.announcements || INITIAL_ANNOUNCEMENTS);
  const [library, setLibrary] = useState<LibraryBook[]>(savedState?.library || INITIAL_LIBRARY);
  const [borrows, setBorrows] = useState<BookBorrow[]>(savedState?.borrows || INITIAL_BORROWS);
  const [transportRoutes] = useState<TransportRoute[]>(savedState?.transportRoutes || INITIAL_TRANSPORT_ROUTES);
  const [canteenMenu] = useState<CanteenMenu[]>(savedState?.canteenMenu || INITIAL_CANTEEN_MENU);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(savedState?.auditLogs || INITIAL_AUDIT_LOGS);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Rentrée du 1er Trimestre',
      message: 'La rentrée administrative et académique 2026-2027 est ouverte.',
      date: 'Aujourd’hui',
      read: false,
      type: 'info',
    },
    {
      id: 'notif-2',
      title: 'Alertes Retard du jour',
      message: 'Un retard signalé en Terminale D1 (Traoré Mohamed Lamine).',
      date: 'Ce matin',
      read: false,
      type: 'warning',
    },
    {
      id: 'notif-3',
      title: 'Nouveau Paiement Mobile Money',
      message: 'Reçu n° REC-2024-0089 encaissé avec succès via Wave (350 000 FCFA).',
      date: 'Hier',
      read: true,
      type: 'success',
    },
  ]);

  // Sync to local storage
  useEffect(() => {
    try {
      const stateToSave = {
        currentEstId,
        currentUserId: currentUser.id,
        activeTab,
        darkMode,
        isAuthenticated,
        viewMode,
        students,
        classes,
        teachers,
        feePlans,
        payments,
        expenses,
        grades,
        attendance,
        schedule,
        announcements,
        library,
        borrows,
        auditLogs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Could not save state to localStorage:', e);
    }
  }, [
    currentEstId,
    currentUser,
    activeTab,
    darkMode,
    isAuthenticated,
    viewMode,
    students,
    classes,
    teachers,
    feePlans,
    payments,
    expenses,
    grades,
    attendance,
    schedule,
    announcements,
    library,
    borrows,
    auditLogs,
  ]);

  const currentEstablishment =
    establishments.find((e) => e.id === currentEstId) || establishments[0];

  const setEstablishmentId = (id: string) => {
    setCurrentEstId(id);
  };

  const login = (role?: UserRole, customUser?: { email: string; name: string }) => {
    if (role) {
      const userForRole = DEMO_USERS.find((u) => u.role === role);
      if (userForRole) {
        setCurrentUser(userForRole);
        if (role === 'parent') setActiveTab('parent_portal');
        else if (role === 'eleve') setActiveTab('student_portal');
        else if (role === 'enseignant') setActiveTab('grades');
        else if (role === 'comptable') setActiveTab('finances');
        else if (role === 'secretaire') setActiveTab('students');
        else if (role === 'surveillant') setActiveTab('attendance');
        else setActiveTab('dashboard');
      }
    } else if (customUser) {
      const found = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === customUser.email.toLowerCase()
      );
      if (found) {
        setCurrentUser(found);
        if (found.role === 'parent') setActiveTab('parent_portal');
        else if (found.role === 'eleve') setActiveTab('student_portal');
        else setActiveTab('dashboard');
      } else {
        // Create a custom session user
        setCurrentUser({
          id: `usr-${Date.now()}`,
          name: customUser.name,
          email: customUser.email,
          role: 'directeur',
          phone: '+225 07 00 00 00 00',
          establishmentId: currentEstId,
          title: 'Directeur Connecté',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
          permissions: ['all'],
        });
        setActiveTab('dashboard');
      }
    }
    setIsAuthenticated(true);
    setViewMode('app');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setViewMode('showcase');
  };

  const switchRole = (role: UserRole) => {
    const userForRole = DEMO_USERS.find((u) => u.role === role);
    if (userForRole) {
      setCurrentUser(userForRole);
      // Route appropriately if parent or eleve
      if (role === 'parent') setActiveTab('parent_portal');
      else if (role === 'eleve') setActiveTab('student_portal');
      else if (activeTab === 'parent_portal' || activeTab === 'student_portal') setActiveTab('dashboard');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Helper formatting FCFA
  const formatFCFA = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('XOF', 'FCFA');
  };

  const getStudentById = (id: string) => students.find((s) => s.id === id);
  const getClassById = (id: string) => classes.find((c) => c.id === id);
  const getTeacherById = (id: string) => teachers.find((t) => t.id === id);
  const getSubjectById = (id: string) => subjects.find((s) => s.id === id);

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id' | 'matricule'>): Student => {
    const year = new Date().getFullYear();
    const count = students.length + 1;
    const matricule = `CI-${year}-${String(count).padStart(4, '0')}`;
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      matricule,
      establishmentId: currentEstId,
    };
    setStudents((prev) => [newStudent, ...prev]);

    // Add audit log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentUser.name,
      role: currentUser.title,
      action: 'Nouvelle Inscription',
      details: `Élève ${newStudent.firstName} ${newStudent.lastName} inscrit sous le matricule ${matricule}.`,
    };
    setAuditLogs((prev) => [log, ...prev]);

    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Class CRUD
  const addClass = (clsData: Omit<ClassRoom, 'id'>) => {
    const newClass: ClassRoom = {
      ...clsData,
      id: `cls-${Date.now()}`,
      establishmentId: currentEstId,
    };
    setClasses((prev) => [...prev, newClass]);
  };

  const updateClass = (id: string, updates: Partial<ClassRoom>) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  // Teacher CRUD
  const addTeacher = (tchData: Omit<Teacher, 'id'>) => {
    const newTch: Teacher = {
      ...tchData,
      id: `tch-${Date.now()}`,
      establishmentId: currentEstId,
    };
    setTeachers((prev) => [...prev, newTch]);
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  // Fee Plans
  const updateFeePlan = (id: string, updates: Partial<FeePlan>) => {
    setFeePlans((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates, total: (updates.registrationFee ?? f.registrationFee) + (updates.tuitionFee ?? f.tuitionFee) + (updates.annexFees ?? f.annexFees) } : f))
    );
  };

  // Financial summary per student
  const getStudentFinancialSummary = (studentId: string) => {
    const student = getStudentById(studentId);
    if (!student) return { totalDue: 0, totalPaid: 0, remaining: 0 };
    const cls = getClassById(student.classId);
    const plan = feePlans.find((p) => p.cycle === cls?.cycle) || feePlans[0];
    const totalStandard = plan ? plan.total : 450000;
    
    // Apply scholarship discount if applicable
    const discount = (totalStandard * (student.scholarshipPercent || 0)) / 100;
    const totalDue = totalStandard - discount;

    const studentPayments = payments.filter((p) => p.studentId === studentId);
    const totalPaid = studentPayments.reduce((acc, p) => acc + p.amount, 0);
    const remaining = Math.max(0, totalDue - totalPaid);

    return { totalDue, totalPaid, remaining };
  };

  // Add Payment
  const addPayment = (paymentData: Omit<PaymentRecord, 'id' | 'receiptNumber'>): PaymentRecord => {
    const year = new Date().getFullYear();
    const count = payments.length + 89;
    const receiptNumber = `REC-${year}-${String(count).padStart(4, '0')}`;
    
    // Compute remaining
    const currentFin = getStudentFinancialSummary(paymentData.studentId);
    const newRemaining = Math.max(0, currentFin.remaining - paymentData.amount);

    const newPayment: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNumber,
      remainingBalance: newRemaining,
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Add audit log
    const st = getStudentById(paymentData.studentId);
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentUser.name,
      role: currentUser.title,
      action: 'Encaissement Paiement',
      details: `Reçu ${receiptNumber} émis : ${formatFCFA(paymentData.amount)} pour ${st?.firstName} ${st?.lastName}.`,
    };
    setAuditLogs((prev) => [log, ...prev]);

    return newPayment;
  };

  // Add Expense
  const addExpense = (expenseData: Omit<ExpenseRecord, 'id'>) => {
    const newExp: ExpenseRecord = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  // Grades & Averages calculation
  const addOrUpdateGrade = (gradeData: Omit<GradeItem, 'id'> & { id?: string }) => {
    // calculate average: typically 40% Devoirs/Interros + 60% Composition, or standard Ivorian: (Moyenne devoirs + 2*Compo) / 3
    const interro = gradeData.interrogation || 0;
    const dev1 = gradeData.devoir1 || 0;
    const dev2 = gradeData.devoir2 !== undefined ? gradeData.devoir2 : dev1;
    const moyDevoirs = (interro + dev1 + dev2) / 3;
    const compo = gradeData.composition || 0;
    const calculatedAvg = Number(((moyDevoirs + compo * 2) / 3).toFixed(2));

    const itemToSave: GradeItem = {
      ...gradeData,
      id: gradeData.id || `grd-${Date.now()}`,
      average: calculatedAvg,
    };

    setGrades((prev) => {
      const idx = prev.findIndex((g) => g.id === itemToSave.id || (g.studentId === itemToSave.studentId && g.subjectId === itemToSave.subjectId && g.term === itemToSave.term));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = itemToSave;
        return copy;
      }
      return [...prev, itemToSave];
    });
  };

  const calculateStudentAverage = (studentId: string, term = 'Trimestre 1') => {
    const student = getStudentById(studentId);
    if (!student) return { average: 0, details: [] };
    const cls = getClassById(student.classId);
    const studentGrades = grades.filter((g) => g.studentId === studentId && g.term === term);

    let totalPoints = 0;
    let totalCoeffs = 0;

    const details = studentGrades.map((g) => {
      const subject = getSubjectById(g.subjectId);
      const coeff = cls ? subject?.coefficients[cls.level] || 2 : 2;
      const points = g.average * coeff;
      totalPoints += points;
      totalCoeffs += coeff;
      return {
        subject,
        grade: g,
        coeff,
        points: Number(points.toFixed(2)),
      };
    });

    const average = totalCoeffs > 0 ? Number((totalPoints / totalCoeffs).toFixed(2)) : 0;

    // Class ranking
    const classmates = students.filter((s) => s.classId === student.classId && s.status === 'actif');
    const classAverages = classmates.map((cm) => {
      const cmGrades = grades.filter((g) => g.studentId === cm.id && g.term === term);
      let p = 0;
      let c = 0;
      cmGrades.forEach((g) => {
        const subj = getSubjectById(g.subjectId);
        const coeff = cls ? subj?.coefficients[cls.level] || 2 : 2;
        p += g.average * coeff;
        c += coeff;
      });
      return { id: cm.id, avg: c > 0 ? p / c : 0 };
    });

    classAverages.sort((a, b) => b.avg - a.avg);
    const rankIndex = classAverages.findIndex((item) => item.id === studentId);
    const rank = rankIndex >= 0 ? rankIndex + 1 : 1;

    return {
      average,
      details,
      rank,
      totalStudents: classmates.length,
    };
  };

  // Attendance
  const markAttendance = (
    date: string,
    classId: string,
    records: { studentId: string; status: 'present' | 'absent' | 'retard' | 'excuse'; reason?: string; time?: string }[]
  ) => {
    setAttendance((prev) => {
      // Remove previous records for this date and class
      const filtered = prev.filter((a) => !(a.date === date && a.classId === classId));
      const newItems: AttendanceRecord[] = records.map((r, idx) => ({
        id: `att-${Date.now()}-${idx}`,
        date,
        classId,
        studentId: r.studentId,
        status: r.status,
        reason: r.reason,
        time: r.time,
        notifiedParent: r.status === 'absent' || r.status === 'retard',
      }));
      return [...newItems, ...filtered];
    });

    // Add audit log
    const cls = getClassById(classId);
    const absentCount = records.filter((r) => r.status === 'absent').length;
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentUser.name,
      role: currentUser.title,
      action: 'Feuille d’Appel Enregistrée',
      details: `Appel effectué pour la classe ${cls?.name} (${absentCount} absents).`,
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Schedule & conflict check
  const addScheduleItem = (itemData: Omit<ScheduleItem, 'id'>) => {
    // Check conflicts
    const conflictTeacher = schedule.find(
      (s) =>
        s.day === itemData.day &&
        s.teacherId === itemData.teacherId &&
        ((itemData.startTime >= s.startTime && itemData.startTime < s.endTime) ||
          (itemData.endTime > s.startTime && itemData.endTime <= s.endTime))
    );

    if (conflictTeacher) {
      const tch = getTeacherById(itemData.teacherId);
      const cls = getClassById(conflictTeacher.classId);
      return {
        success: false,
        conflict: `Conflit enseignant : ${tch?.firstName} ${tch?.lastName} a déjà cours avec la classe ${cls?.name} de ${conflictTeacher.startTime} à ${conflictTeacher.endTime}.`,
      };
    }

    const conflictRoom = schedule.find(
      (s) =>
        s.day === itemData.day &&
        s.room === itemData.room &&
        ((itemData.startTime >= s.startTime && itemData.startTime < s.endTime) ||
          (itemData.endTime > s.startTime && itemData.endTime <= s.endTime))
    );

    if (conflictRoom) {
      return {
        success: false,
        conflict: `Conflit de salle : La salle ${itemData.room} est déjà occupée de ${conflictRoom.startTime} à ${conflictRoom.endTime}.`,
      };
    }

    const newItem: ScheduleItem = {
      ...itemData,
      id: `sch-${Date.now()}`,
    };
    setSchedule((prev) => [...prev, newItem]);
    return { success: true };
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule((prev) => prev.filter((s) => s.id !== id));
  };

  // Announcements
  const addAnnouncement = (annData: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: `anc-${Date.now()}`,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  // Library
  const borrowBook = (bookId: string, studentId: string, dueDate: string) => {
    const newBorrow: BookBorrow = {
      id: `brw-${Date.now()}`,
      bookId,
      studentId,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'en_cours',
    };
    setBorrows((prev) => [newBorrow, ...prev]);
    setLibrary((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b))
    );
  };

  const returnBook = (borrowId: string) => {
    const borrow = borrows.find((b) => b.id === borrowId);
    if (!borrow) return;
    setBorrows((prev) =>
      prev.map((b) =>
        b.id === borrowId ? { ...b, status: 'rendu', returnDate: new Date().toISOString().split('T')[0] } : b
      )
    );
    setLibrary((prev) =>
      prev.map((b) => (b.id === borrow.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b))
    );
  };

  // Reset to initial demo state
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStudents(INITIAL_STUDENTS);
    setClasses(INITIAL_CLASSES);
    setTeachers(INITIAL_TEACHERS);
    setFeePlans(INITIAL_FEE_PLANS);
    setPayments(INITIAL_PAYMENTS);
    setExpenses(INITIAL_EXPENSES);
    setGrades(INITIAL_GRADES);
    setAttendance(INITIAL_ATTENDANCE);
    setSchedule(INITIAL_SCHEDULE);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setLibrary(INITIAL_LIBRARY);
    setBorrows(INITIAL_BORROWS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setActiveTab('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        currentEstablishment,
        establishments,
        setEstablishmentId,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        isAuthenticated,
        login,
        logout,
        searchQuery,
        setSearchQuery,
        darkMode,
        toggleDarkMode,
        notifications,
        markNotificationRead,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        classes,
        addClass,
        updateClass,
        teachers,
        addTeacher,
        updateTeacher,
        staff,
        subjects,
        feePlans,
        updateFeePlan,
        payments,
        addPayment,
        expenses,
        addExpense,
        grades,
        addOrUpdateGrade,
        attendance,
        markAttendance,
        schedule,
        addScheduleItem,
        deleteScheduleItem,
        announcements,
        addAnnouncement,
        library,
        borrows,
        borrowBook,
        returnBook,
        transportRoutes,
        canteenMenu,
        auditLogs,
        formatFCFA,
        getStudentById,
        getClassById,
        getTeacherById,
        getSubjectById,
        getStudentFinancialSummary,
        calculateStudentAverage,
        resetDemoData,
      }}
    >
      <div className={darkMode ? 'dark' : ''}>{children}</div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
