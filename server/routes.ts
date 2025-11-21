import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAttendanceRecordSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all courses with enrolled students
  app.get("/api/courses", async (_req, res) => {
    try {
      const courses = await storage.getCoursesWithStudents();
      res.json(courses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get specific course with students
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourseWithStudents(id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all students
  app.get("/api/students", async (_req, res) => {
    try {
      const students = await storage.getStudents();
      res.json(students);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get schedule
  app.get("/api/schedule", async (_req, res) => {
    try {
      const schedule = await storage.getScheduleItems();
      res.json(schedule);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get specific schedule item
  app.get("/api/schedule/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getScheduleItem(id);
      if (!item) {
        return res.status(404).json({ error: "Schedule item not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Log attendance (NFC scan)
  app.post("/api/attendance", async (req, res) => {
    try {
      const validation = insertAttendanceRecordSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: fromError(validation.error).toString() });
      }

      const record = await storage.logAttendance(validation.data);
      res.status(201).json(record);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get attendance for a session
  app.get("/api/attendance/session/:sessionId", async (req, res) => {
    try {
      const records = await storage.getAttendanceForSession(req.params.sessionId);
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get attendance for a course
  app.get("/api/attendance/course/:courseId", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const records = await storage.getAttendanceForCourse(courseId);
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Scan NFC card (lookup student by NFC ID and log attendance)
  app.post("/api/scan", async (req, res) => {
    try {
      const { nfcId, courseId, sessionId } = req.body;

      if (!nfcId || !courseId || !sessionId) {
        return res.status(400).json({ error: "Missing required fields: nfcId, courseId, sessionId" });
      }

      const student = await storage.getStudentByNfcId(nfcId);
      if (!student) {
        return res.status(404).json({ error: "Student not found with this NFC ID" });
      }

      const record = await storage.logAttendance({
        studentId: student.id,
        courseId: parseInt(courseId),
        sessionId,
        status: "Present",
      });

      res.status(201).json({ student, record });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
