import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { eq, and, inArray } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  Student,
  Course,
  ScheduleItem,
  AttendanceRecord,
  InsertStudent,
  InsertCourse,
  InsertScheduleItem,
  InsertAttendanceRecord,
  CourseWithStudents,
} from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

export interface IStorage {
  // Students
  getStudents(): Promise<Student[]>;
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByNfcId(nfcId: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;

  // Courses
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  getCoursesWithStudents(): Promise<CourseWithStudents[]>;
  getCourseWithStudents(id: number): Promise<CourseWithStudents | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  enrollStudent(studentId: number, courseId: number): Promise<void>;

  // Schedule
  getScheduleItems(): Promise<ScheduleItem[]>;
  getScheduleItem(id: number): Promise<ScheduleItem | undefined>;
  createScheduleItem(item: InsertScheduleItem): Promise<ScheduleItem>;

  // Attendance
  logAttendance(record: InsertAttendanceRecord): Promise<AttendanceRecord>;
  getAttendanceForSession(sessionId: string): Promise<AttendanceRecord[]>;
  getAttendanceForCourse(courseId: number): Promise<AttendanceRecord[]>;
}

export class DatabaseStorage implements IStorage {
  // Students
  async getStudents(): Promise<Student[]> {
    return db.select().from(schema.students);
  }

  async getStudent(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(schema.students).where(eq(schema.students.id, id));
    return student;
  }

  async getStudentByNfcId(nfcId: string): Promise<Student | undefined> {
    const [student] = await db.select().from(schema.students).where(eq(schema.students.nfcId, nfcId));
    return student;
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const [created] = await db.insert(schema.students).values(student).returning();
    return created;
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    return db.select().from(schema.courses);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(schema.courses).where(eq(schema.courses.id, id));
    return course;
  }

  async getCoursesWithStudents(): Promise<CourseWithStudents[]> {
    const courses = await this.getCourses();
    const result: CourseWithStudents[] = [];

    for (const course of courses) {
      const enrollments = await db
        .select()
        .from(schema.courseEnrollments)
        .where(eq(schema.courseEnrollments.courseId, course.id));

      const studentIds = enrollments.map((e) => e.studentId);
      const students = studentIds.length > 0
        ? await db.select().from(schema.students).where(inArray(schema.students.id, studentIds))
        : [];

      result.push({ ...course, students });
    }

    return result;
  }

  async getCourseWithStudents(id: number): Promise<CourseWithStudents | undefined> {
    const course = await this.getCourse(id);
    if (!course) return undefined;

    const enrollments = await db
      .select()
      .from(schema.courseEnrollments)
      .where(eq(schema.courseEnrollments.courseId, id));

    const studentIds = enrollments.map((e) => e.studentId);
    const students = studentIds.length > 0
      ? await db.select().from(schema.students).where(inArray(schema.students.id, studentIds))
      : [];

    return { ...course, students };
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [created] = await db.insert(schema.courses).values(course).returning();
    return created;
  }

  async enrollStudent(studentId: number, courseId: number): Promise<void> {
    await db.insert(schema.courseEnrollments).values({ studentId, courseId });
  }

  // Schedule
  async getScheduleItems(): Promise<ScheduleItem[]> {
    return db.select().from(schema.scheduleItems);
  }

  async getScheduleItem(id: number): Promise<ScheduleItem | undefined> {
    const [item] = await db.select().from(schema.scheduleItems).where(eq(schema.scheduleItems.id, id));
    return item;
  }

  async createScheduleItem(item: InsertScheduleItem): Promise<ScheduleItem> {
    const [created] = await db.insert(schema.scheduleItems).values(item).returning();
    return created;
  }

  // Attendance
  async logAttendance(record: InsertAttendanceRecord): Promise<AttendanceRecord> {
    const [created] = await db.insert(schema.attendanceRecords).values(record).returning();
    return created;
  }

  async getAttendanceForSession(sessionId: string): Promise<AttendanceRecord[]> {
    return db.select().from(schema.attendanceRecords).where(eq(schema.attendanceRecords.sessionId, sessionId));
  }

  async getAttendanceForCourse(courseId: number): Promise<AttendanceRecord[]> {
    return db.select().from(schema.attendanceRecords).where(eq(schema.attendanceRecords.courseId, courseId));
  }
}

export const storage = new DatabaseStorage();
