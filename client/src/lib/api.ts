import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CourseWithStudents, ScheduleItem, AttendanceRecord, Student } from "@shared/schema";

const API_BASE = "/api";

// Fetch functions
async function fetchCourses(): Promise<CourseWithStudents[]> {
  const response = await fetch(`${API_BASE}/courses`);
  if (!response.ok) throw new Error("Failed to fetch courses");
  return response.json();
}

async function fetchCourse(id: number): Promise<CourseWithStudents> {
  const response = await fetch(`${API_BASE}/courses/${id}`);
  if (!response.ok) throw new Error("Failed to fetch course");
  return response.json();
}

async function fetchSchedule(): Promise<ScheduleItem[]> {
  const response = await fetch(`${API_BASE}/schedule`);
  if (!response.ok) throw new Error("Failed to fetch schedule");
  return response.json();
}

async function fetchScheduleItem(id: number): Promise<ScheduleItem> {
  const response = await fetch(`${API_BASE}/schedule/${id}`);
  if (!response.ok) throw new Error("Failed to fetch schedule item");
  return response.json();
}

async function fetchAttendanceForSession(sessionId: string): Promise<AttendanceRecord[]> {
  const response = await fetch(`${API_BASE}/attendance/session/${sessionId}`);
  if (!response.ok) throw new Error("Failed to fetch attendance");
  return response.json();
}

async function scanNfcCard(data: { nfcId: string; courseId: number; sessionId: string }): Promise<{ student: Student; record: AttendanceRecord }> {
  const response = await fetch(`${API_BASE}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to scan NFC card");
  }
  return response.json();
}

// React Query hooks
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });
}

export function useCourse(id: number) {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: () => fetchCourse(id),
    enabled: !!id,
  });
}

export function useSchedule() {
  return useQuery({
    queryKey: ["schedule"],
    queryFn: fetchSchedule,
  });
}

export function useScheduleItem(id: number) {
  return useQuery({
    queryKey: ["schedule", id],
    queryFn: () => fetchScheduleItem(id),
    enabled: !!id,
  });
}

export function useAttendanceForSession(sessionId: string) {
  return useQuery({
    queryKey: ["attendance", "session", sessionId],
    queryFn: () => fetchAttendanceForSession(sessionId),
    enabled: !!sessionId,
  });
}

export function useScanNfc() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: scanNfcCard,
    onSuccess: (data, variables) => {
      // Invalidate attendance queries
      queryClient.invalidateQueries({ queryKey: ["attendance", "session", variables.sessionId] });
    },
  });
}
