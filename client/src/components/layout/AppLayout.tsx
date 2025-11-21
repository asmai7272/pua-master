import { Link, useLocation } from "wouter";
import { LayoutDashboard, Calendar, Settings, LogOut, Users, GraduationCap, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Schedule", path: "/schedule" },
    { icon: GraduationCap, label: "Courses", path: "/courses" },
    { icon: Users, label: "Students", path: "/students" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-sidebar text-sidebar-foreground">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl font-heading">
              U
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none font-heading">UniAttend</h1>
              <span className="text-xs text-sidebar-foreground/60">Instructor Portal</span>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive(item.path) 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
                }`}
              >
                <item.icon size={20} className={isActive(item.path) ? "text-current" : "text-sidebar-foreground/60 group-hover:text-current"} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Dr. Robert Fox</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">Computer Science</p>
            </div>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-md sticky top-0 z-20">
           <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold font-heading">
              U
            </div>
            <span className="font-bold text-lg font-heading">UniAttend</span>
          </div>
          
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-sidebar text-sidebar-foreground border-r-sidebar-border">
              <div className="p-6">
                 <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl font-heading">
                    U
                  </div>
                  <div>
                    <h1 className="font-bold text-lg leading-none font-heading">UniAttend</h1>
                    <span className="text-xs text-sidebar-foreground/60">Instructor Portal</span>
                  </div>
                </div>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link 
                      key={item.path} 
                      href={item.path} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.path) 
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/30">
          <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
