import { format } from "date-fns";
import { Link } from "wouter";
import { MapPin, Clock, ChevronRight, Users, MoreVertical, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCourses, useSchedule } from "@/lib/api";

export default function Dashboard() {
  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  const { data: schedule = [], isLoading: scheduleLoading } = useSchedule();
  
  const today = new Date();
  const dayOfWeek = 1; // Mocking Monday for demo purposes (so we see lectures)
  
  const todaysClasses = schedule.filter(item => item.dayOfWeek === dayOfWeek).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const upcomingClasses = schedule.filter(item => item.dayOfWeek !== dayOfWeek).slice(0, 3);

  // Find the "active" class based on time (mocking 09:15 AM)
  const activeClass = todaysClasses[0];
  
  if (coursesLoading || scheduleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  } 

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Good Morning, Dr. Fox
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(today, "EEEE, MMMM do, yyyy")}
          </p>
        </div>
        <Button variant="outline" className="hidden md:flex">
          <CalendarDays className="mr-2 h-4 w-4" /> View Full Schedule
        </Button>
      </div>

      {/* Active Session Hero Card */}
      {activeClass && (() => {
        const activeCourse = courses.find(c => c.id === activeClass.courseId);
        return (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Happening Now</h2>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-blue-700 text-white shadow-xl shadow-primary/20">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Clock size={120} />
              </div>
              
              <div className="p-6 md:p-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div>
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-3">
                      {activeClass.type}
                    </Badge>
                    <h3 className="text-2xl md:text-4xl font-heading font-bold mb-2">
                      {activeCourse?.name}
                    </h3>
                    <p className="text-blue-100 text-lg mb-6 flex items-center gap-2">
                      <span className="font-mono opacity-80">{activeCourse?.code}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin size={16} /> {activeCourse?.location}</span>
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm font-medium text-blue-50">
                       <div className="flex items-center gap-2">
                          <Clock size={16} />
                          {activeClass.startTime} - {activeClass.endTime}
                       </div>
                       <div className="flex items-center gap-2">
                          <Users size={16} />
                          {activeCourse?.students.length || 0} Registered
                       </div>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Link href={`/session/${activeClass.id}`}>
                      <Button size="lg" className="w-full md:w-auto bg-white text-primary hover:bg-blue-50 border-none shadow-lg font-bold text-base h-12 px-8">
                        Start Session
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Today's Schedule */}
      <section>
        <h2 className="text-lg font-heading font-semibold mb-4">Rest of Today</h2>
        <div className="grid gap-4">
          {todaysClasses.slice(1).map((cls) => {
            const course = courses.find(c => c.id === cls.courseId);
            return (
              <Card key={cls.id} className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-center w-16">
                       <span className="block text-lg font-bold text-foreground">{cls.startTime}</span>
                       <span className="block text-xs text-muted-foreground">{cls.endTime}</span>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div>
                      <Link href={`/courses/${course?.id}`}>
                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer">
                          {course?.name}
                        </h4>
                      </Link>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">{course?.code}</span>
                        <span>•</span>
                        <span>{cls.type}</span>
                        <span>•</span>
                        <span>{course?.location}</span>
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <MoreVertical size={18} />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          {todaysClasses.length <= 1 && (
             <div className="text-center p-8 border border-dashed rounded-xl text-muted-foreground bg-muted/20">
                No other classes today.
             </div>
          )}
        </div>
      </section>

       {/* Quick Access / Upcoming */}
       <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
             <CardHeader>
                <CardTitle className="text-lg font-heading">Quick Actions</CardTitle>
             </CardHeader>
             <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:border-primary hover:text-primary hover:bg-primary/5">
                   <Users size={24} />
                   <span>Student Directory</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:border-primary hover:text-primary hover:bg-primary/5">
                   <CalendarDays size={24} />
                   <span>My Calendar</span>
                </Button>
             </CardContent>
          </Card>

          <Card>
             <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-heading">Upcoming</CardTitle>
                <Button variant="link" size="sm">View All</Button>
             </CardHeader>
             <CardContent className="space-y-4">
                {upcomingClasses.map(cls => {
                   const course = courses.find(c => c.id === cls.courseId);
                   return (
                      <div key={cls.id} className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary flex flex-col items-center justify-center text-xs font-bold leading-tight">
                               <span>Tue</span>
                               <span className="text-muted-foreground font-normal">12</span>
                            </div>
                            <div>
                               <p className="font-medium">{course?.code}</p>
                               <p className="text-muted-foreground text-xs">{cls.startTime} • {course?.location}</p>
                            </div>
                         </div>
                         <ChevronRight size={16} className="text-muted-foreground" />
                      </div>
                   )
                })}
             </CardContent>
          </Card>
       </section>
    </div>
  );
}
