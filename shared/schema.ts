import { sql } from "drizzle-orm";
import { pgTable, text, serial, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  studentId: text("student_id").notNull().unique(),
  nfcId: text("nfc_id").notNull().unique(),
  avatar: text("avatar"),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  location: text("location").notNull(),
});

export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
});

export const scheduleItems = pgTable("schedule_items", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  type: text("type").notNull(),
});

export const attendanceRecords = pgTable("attendance_records", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  sessionId: text("session_id").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  status: text("status").notNull().default("Present"),
});

export const insertStudentSchema = createInsertSchema(students).omit({ id: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true });
export const insertScheduleItemSchema = createInsertSchema(scheduleItems).omit({ id: true });
export const insertAttendanceRecordSchema = createInsertSchema(attendanceRecords).omit({ id: true, timestamp: true });

export type Student = typeof students.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type ScheduleItem = typeof scheduleItems.$inferSelect;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertScheduleItem = z.infer<typeof insertScheduleItemSchema>;
export type InsertAttendanceRecord = z.infer<typeof insertAttendanceRecordSchema>;

export interface CourseWithStudents extends Course {
  students: Student[];
}
