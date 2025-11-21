import { storage } from "./storage";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create students
  const students = await Promise.all([
    storage.createStudent({
      name: "Alex Rivera",
      studentId: "2023101",
      nfcId: "nfc_001",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    }),
    storage.createStudent({
      name: "Sarah Chen",
      studentId: "2023102",
      nfcId: "nfc_002",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    }),
    storage.createStudent({
      name: "Jordan Smith",
      studentId: "2023103",
      nfcId: "nfc_003",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    }),
    storage.createStudent({
      name: "Emily Davis",
      studentId: "2023104",
      nfcId: "nfc_004",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    }),
    storage.createStudent({
      name: "Michael Brown",
      studentId: "2023105",
      nfcId: "nfc_005",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    }),
  ]);

  console.log(`✓ Created ${students.length} students`);

  // Create courses
  const courses = await Promise.all([
    storage.createCourse({
      code: "CS101",
      name: "Intro to Computer Science",
      location: "Hall A",
    }),
    storage.createCourse({
      code: "CS202",
      name: "Data Structures",
      location: "Lab 3",
    }),
    storage.createCourse({
      code: "MATH101",
      name: "Calculus I",
      location: "Room 304",
    }),
  ]);

  console.log(`✓ Created ${courses.length} courses`);

  // Enroll all students in CS101 and MATH101
  for (const student of students) {
    await storage.enrollStudent(student.id, courses[0].id); // CS101
    await storage.enrollStudent(student.id, courses[2].id); // MATH101
  }

  // Enroll first 3 students in CS202
  for (let i = 0; i < 3; i++) {
    await storage.enrollStudent(students[i].id, courses[1].id);
  }

  console.log("✓ Enrolled students in courses");

  // Create schedule
  const schedule = await Promise.all([
    storage.createScheduleItem({
      courseId: courses[0].id,
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "10:30",
      type: "Lecture",
    }),
    storage.createScheduleItem({
      courseId: courses[1].id,
      dayOfWeek: 1,
      startTime: "11:00",
      endTime: "13:00",
      type: "Lab",
    }),
    storage.createScheduleItem({
      courseId: courses[2].id,
      dayOfWeek: 2,
      startTime: "10:00",
      endTime: "11:30",
      type: "Lecture",
    }),
    storage.createScheduleItem({
      courseId: courses[0].id,
      dayOfWeek: 3,
      startTime: "09:00",
      endTime: "10:30",
      type: "Lecture",
    }),
    storage.createScheduleItem({
      courseId: courses[1].id,
      dayOfWeek: 4,
      startTime: "14:00",
      endTime: "16:00",
      type: "Lab",
    }),
  ]);

  console.log(`✓ Created ${schedule.length} schedule items`);

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
