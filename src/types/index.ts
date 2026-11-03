export type UserRole =
  | 'super_admin'
  | 'directeur'
  | 'secretaire'
  | 'comptable'
  | 'directeur_etudes'
  | 'enseignant'
  | 'surveillant'
  | 'eleve'
  | 'parent';

export interface RoleConfig {
  id: UserRole;
  label: string;
  description: string;
  badgeColor: string;
}

export interface Establishment {
  id: string;
  name: string;
  code: string;
  cycle: 'primaire' | 'college' | 'lycee' | 'mixte';
  address: string;
  commune: string;
  city: string;
  phone: string;
  email: string;
  logoUrl?: string;
  directorName: string;
  motto: string;
  currentYear: string;
  stampUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  establishmentId: string;
  title: string;
  permissions: string[];
}

export type SchoolCycle = 'primaire' | 'college' | 'lycee';

export interface ClassRoom {
  id: string;
  name: string;
  level: string;
  cycle: SchoolCycle;
  capacity: number;
  mainTeacherId: string;
  roomNumber: string;
  establishmentId: string;
}

export interface Student {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: 'M' | 'F';
  nationality: string;
  address: string;
  classId: string;
  establishmentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentProfession?: string;
  emergencyContact: string;
  registrationDate: string;
  status: 'actif' | 'transfere' | 'radie' | 'archive';
  photoUrl: string;
  previousSchool?: string;
  scholarshipPercent: number; // e.g. 0, 25, 50, 100
  bloodGroup?: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  phone: string;
  email: string;
  subject: string;
  diploma: string;
  classes: string[];
  salary: number; // In FCFA
  contractType: 'CDI' | 'CDD' | 'Vacataire';
  hireDate: string;
  establishmentId: string;
  status: 'actif' | 'conge';
  avatar: string;
}

export interface StaffMember {
  id: string;
  name: string;
  roleTitle: string;
  role: UserRole;
  phone: string;
  email: string;
  department: string;
  hireDate: string;
  establishmentId: string;
  avatar: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  cycle: SchoolCycle;
  category: 'Scientifique' | 'Littéraire' | 'Sport & Arts' | 'Général';
  coefficients: Record<string, number>; // level -> coeff e.g. { "6eme": 4, "3eme": 4, "Tle D": 4 }
}

export interface GradeItem {
  id: string;
  studentId: string;
  classId: string;
  subjectId: string;
  term: 'Trimestre 1' | 'Trimestre 2' | 'Trimestre 3' | 'Semestre 1' | 'Semestre 2';
  interrogation: number;
  devoir1: number;
  devoir2?: number;
  composition: number;
  average: number;
  teacherAppreciation?: string;
}

export interface FeePlan {
  id: string;
  level: string;
  cycle: SchoolCycle;
  registrationFee: number;
  tuitionFee: number;
  annexFees: number;
  total: number;
}

export type PaymentMethod =
  | 'especes'
  | 'wave'
  | 'orange_money'
  | 'mtn_momo'
  | 'virement'
  | 'cheque';

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  studentId: string;
  classId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  feeType: 'inscription' | 'scolarite' | 'cantine' | 'transport' | 'annexe';
  date: string;
  notes?: string;
  cashierName: string;
  remainingBalance: number;
}

export interface ExpenseRecord {
  id: string;
  title: string;
  category: 'salaires' | 'fournitures' | 'maintenance' | 'electricite_eau' | 'pedagogie' | 'autre';
  amount: number;
  date: string;
  beneficiary: string;
  paymentMethod: PaymentMethod;
  status: 'paye' | 'en_attente';
  approvedBy: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  classId: string;
  studentId: string;
  status: 'present' | 'absent' | 'retard' | 'excuse';
  reason?: string;
  time?: string;
  notifiedParent: boolean;
}

export interface ScheduleItem {
  id: string;
  classId: string;
  day: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi';
  startTime: string; // e.g. "08:00"
  endTime: string;   // e.g. "10:00"
  subjectId: string;
  teacherId: string;
  room: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRole: 'tous' | 'parents' | 'enseignants' | 'eleves';
  date: string;
  priority: 'normale' | 'urgente';
  author: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
}

export interface BookBorrow {
  id: string;
  bookId: string;
  studentId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'en_cours' | 'rendu' | 'en_retard';
}

export interface TransportRoute {
  id: string;
  name: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  stops: string[];
  capacity: number;
  studentCount: number;
  monthlyFee: number;
}

export interface CanteenMenu {
  id: string;
  day: string;
  date: string;
  starter: string;
  mainDish: string;
  dessert: string;
  totalSubscribers: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  role: string;
  action: string;
  details: string;
  ipAddress?: string;
}
