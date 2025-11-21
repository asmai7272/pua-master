import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Scanner } from "@/components/nfc/Scanner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Radio, Check, Clock, Users, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useScheduleItem, useCourse, useAttendanceForSession } from "@/lib/api";
import type { Student } from "@shared/schema";

export default function ActiveSession() {
  const [match, params] = useRoute("/session/:id");
  const [location, setLocation] = useLocation();
  const [isScanning, setIsScanning] = useState(false);

  const scheduleId = params?.id ? parseInt(params.id) : 0;
  const { data: scheduleItem, isLoading: scheduleLoading } = useScheduleItem(scheduleId);
  const { data: course, isLoading: courseLoading } = useCourse(scheduleItem?.courseId || 0);
  
  // Session ID based on today's date + schedule ID
  const sessionId = `${params?.id}-${format(new Date(), "yyyy-MM-dd")}`;
  const { data: attendanceList = [] } = useAttendanceForSession(sessionId);

  const handleNewScan = (student: Student) => {
    // React Query will automatically refetch
  };

  if (scheduleLoading || courseLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!scheduleItem || !course) return <div>Session not found</div>;

  const presentCount = attendanceList.length;
  const totalStudents = course.students.length;
  const attendanceRate = Math.round((presentCount / totalStudents) * 100);

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] md:h-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/")} className="-ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
        </Button>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 flex items-center gap-1.5 px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Session
            </Badge>
        </div>
      </div>

      {/* Session Info */}
      <div className="bg-card border rounded-2xl p-6 shrink-0 shadow-sm">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold mb-1">{course.name}</h1>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    <span className="font-mono bg-muted px-1.5 rounded">{course.code}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {scheduleItem.startTime} - {scheduleItem.endTime}</span>
                    <span className="flex items-center gap-1"><Users size={14} /> {course.location}</span>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="text-right mr-2 hidden md:block">
                    <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                    <p className="text-2xl font-bold font-heading leading-none">{presentCount} <span className="text-muted-foreground text-lg font-normal">/ {totalStudents}</span></p>
                </div>
                
                {/* Circular Progress (Simple CSS Conic Gradient) */}
                <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center relative"
                    style={{ background: `conic-gradient(hsl(var(--primary)) ${attendanceRate}%, hsl(var(--muted)) 0)` }}
                >
                    <div className="w-11 h-11 bg-card rounded-full flex items-center justify-center text-xs font-bold">
                        {attendanceRate}%
                    </div>
                </div>

                <Button size="lg" className="ml-4 gap-2 shadow-lg shadow-primary/20" onClick={() => setIsScanning(true)}>
                    <Radio size={18} className="animate-pulse" />
                    Scan Cards
                </Button>
            </div>
         </div>
      </div>

      {/* Student List Grid */}
      <div className="flex-1 min-h-0 flex flex-col">
         <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="font-heading font-semibold text-lg">Class Roster</h3>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="text-xs h-8">All</Button>
               <Button variant="ghost" size="sm" className="text-xs h-8 text-muted-foreground">Present</Button>
               <Button variant="ghost" size="sm" className="text-xs h-8 text-muted-foreground">Absent</Button>
            </div>
         </div>

         <ScrollArea className="flex-1 border rounded-xl bg-white/50">
             <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {course.students.map(student => {
                    const isPresent = attendanceList.some(r => r.studentId === student.id);
                    
                    return (
                        <div 
                            key={student.id} 
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                                isPresent 
                                ? "bg-green-50/50 border-green-100" 
                                : "bg-white border-transparent hover:border-border"
                            }`}
                        >
                            <Avatar className={`h-10 w-10 border-2 ${isPresent ? "border-green-500" : "border-transparent"}`}>
                                <AvatarImage src={student.avatar || undefined} />
                                <AvatarFallback>{student.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{student.name}</p>
                                <p className="text-xs text-muted-foreground font-mono">{student.studentId}</p>
                            </div>
                            <div>
                                {isPresent ? (
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                        <Check size={12} className="mr-1" /> Present
                                    </Badge>
                                ) : (
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-20 hover:opacity-100">
                                        <MoreHorizontal size={16} />
                                    </Button>
                                )}
                            </div>
                        </div>
                    )
                })}
             </div>
         </ScrollArea>
      </div>

      {/* NFC Scanner Overlay */}
      {isScanning && (
        <Scanner 
            courseId={course.id} 
            sessionId={sessionId} 
            onClose={() => setIsScanning(false)} 
            onScanned={handleNewScan}
        />
      )}
    </div>
  );
}
