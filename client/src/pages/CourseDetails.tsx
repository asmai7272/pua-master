import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCourse } from "@/lib/api";
import { 
  ArrowLeft, Users, Calendar, BarChart3, Search, 
  Download, Filter, MoreHorizontal, Mail, GraduationCap 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function CourseDetails() {
  const [match, params] = useRoute("/courses/:id");
  const [, setLocation] = useLocation();
  const courseId = params?.id ? parseInt(params.id) : 0;
  const { data: course, isLoading } = useCourse(courseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Course not found</h2>
        <Button variant="link" onClick={() => setLocation("/")}>Return Home</Button>
      </div>
    );
  }

  // Mock Analytics Data
  const attendanceData = [
    { session: 'Wk 1', attendance: 95 },
    { session: 'Wk 2', attendance: 88 },
    { session: 'Wk 3', attendance: 92 },
    { session: 'Wk 4', attendance: 85 },
    { session: 'Wk 5', attendance: 90 },
    { session: 'Wk 6', attendance: 78 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="sm" className="-ml-2 h-8 w-8 p-0" onClick={() => setLocation("/")}>
               <ArrowLeft size={16} />
             </Button>
             <span className="text-muted-foreground font-mono text-sm">{course.code}</span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">{course.name}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <span className="flex items-center gap-1"><Users size={14} /> {course.students.length} Students</span>
            <span>•</span>
            <span className="flex items-center gap-1"><GraduationCap size={14} /> Fall Semester 2024</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} /> Export Report
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Mail size={16} /> Email Class
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* STUDENTS TAB */}
        <TabsContent value="students" className="mt-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-9 bg-card" />
            </div>
            <Button variant="outline" size="icon">
              <Filter size={16} />
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Student</TableHead>
                  <TableHead>ID Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attendance Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course.students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={student.avatar || undefined} />
                          <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{student.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">{student.studentId}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                             <div className="h-full bg-primary w-[85%] rounded-full" />
                          </div>
                          <span className="text-sm font-medium">85%</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history" className="mt-6">
           <Card>
              <CardHeader>
                 <CardTitle>Session History</CardTitle>
                 <CardDescription>Past lectures and attendance records.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                       <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex flex-col items-center justify-center font-bold text-xs leading-tight">
                                <span>OCT</span>
                                <span className="text-lg">{10 + i}</span>
                             </div>
                             <div>
                                <h4 className="font-semibold">Lecture {i}: Introduction to Concepts</h4>
                                <p className="text-sm text-muted-foreground">09:00 AM - 10:30 AM • Hall A</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="text-sm font-medium">42 / 45 Present</div>
                             <div className="text-xs text-muted-foreground">93% Attendance</div>
                          </div>
                       </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="mt-6">
           <div className="grid gap-6 md:grid-cols-2">
              <Card>
                 <CardHeader>
                    <CardTitle>Attendance Trend</CardTitle>
                    <CardDescription>Attendance percentage over the last 6 weeks</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="h-[300px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={attendanceData}>
                             <XAxis dataKey="session" fontSize={12} tickLine={false} axisLine={false} />
                             <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                             <Tooltip 
                                cursor={{ fill: 'hsl(var(--muted))' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                             />
                             <Bar dataKey="attendance" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                 </CardContent>
              </Card>

              <div className="space-y-6">
                 <Card>
                    <CardHeader>
                       <CardTitle>At Risk Students</CardTitle>
                       <CardDescription>Students with attendance below 75%</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                   <AvatarFallback className="bg-red-100 text-red-600">JD</AvatarFallback>
                                </Avatar>
                                <div>
                                   <p className="text-sm font-medium">John Doe</p>
                                   <p className="text-xs text-red-500">3 consecutive absences</p>
                                </div>
                             </div>
                             <Button size="sm" variant="outline" className="text-xs h-8">Contact</Button>
                          </div>
                          {/* More mock items */}
                       </div>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
