import { addDays, format, startOfWeek, setHours, setMinutes } from "date-fns";

export interface Student {
  id: string;
  name: string;
  studentId: string; // The visual ID (e.g., 2023001)
  nfcId: string; // The hidden NFC tag ID
  avatar: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  location: string;
  students: Student[];
}

export interface ScheduleItem {
  id: string;
  courseId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  type: "Lecture" | "Lab" | "Tutorial";
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  sessionId: string; // Could be date + time
  timestamp: Date;
  status: "Present" | "Late" | "Absent";
}

// --- MOCK DATA ---

const STUDENTS: Student[] = [
  { id: "s1", name: "Alex Rivera", studentId: "2023101", nfcId: "nfc_001", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
  { id: "s2", name: "Sarah Chen", studentId: "2023102", nfcId: "nfc_002", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
  { id: "s3", name: "Jordan Smith", studentId: "2023103", nfcId: "nfc_003", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
  { id: "s4", name: "Emily Davis", studentId: "2023104", nfcId: "nfc_004", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
  { id: "s5", name: "Michael Brown", studentId: "2023105", nfcId: "nfc_005", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
];

const COURSES: Course[] = [
  { id: "c1", code: "CS101", name: "Intro to Computer Science", location: "Hall A", students: STUDENTS },
  { id: "c2", code: "CS202", name: "Data Structures", location: "Lab 3", students: [STUDENTS[0], STUDENTS[1], STUDENTS[2]] },
  { id: "c3", code: "MATH101", name: "Calculus I", location: "Room 304", students: STUDENTS },
];

// Mock schedule for the current week
const SCHEDULE: ScheduleItem[] = [
  { id: "sch1", courseId: "c1", dayOfWeek: 1, startTime: "09:00", endTime: "10:30", type: "Lecture" }, // Mon
  { id: "sch2", courseId: "c2", dayOfWeek: 1, startTime: "11:00", endTime: "13:00", type: "Lab" },     // Mon
  { id: "sch3", courseId: "c3", dayOfWeek: 2, startTime: "10:00", endTime: "11:30", type: "Lecture" }, // Tue
  { id: "sch4", courseId: "c1", dayOfWeek: 3, startTime: "09:00", endTime: "10:30", type: "Lecture" }, // Wed
  { id: "sch5", courseId: "c2", dayOfWeek: 4, startTime: "14:00", endTime: "16:00", type: "Lab" },     // Thu
];

export const getCourses = () => COURSES;
export const getSchedule = () => SCHEDULE;
export const getStudentByNfc = (nfcId: string) => STUDENTS.find(s => s.nfcId === nfcId);
export const getCourseById = (id: string) => COURSES.find(c => c.id === id);

// A simple in-memory store for attendance (resets on reload)
let ATTENDANCE_LOG: AttendanceRecord[] = [];

export const logAttendance = (studentId: string, courseId: string, sessionId: string) => {
  const record: AttendanceRecord = {
    id: Math.random().toString(36).substr(2, 9),
    studentId,
    courseId,
    sessionId,
    timestamp: new Date(),
    status: "Present"
  };
  ATTENDANCE_LOG.push(record);
  return record;
};

export const getAttendanceForSession = (sessionId: string) => {
  return ATTENDANCE_LOG.filter(r => r.sessionId === sessionId);
};
