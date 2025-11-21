import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import ActiveSession from "@/pages/ActiveSession";
import CourseDetails from "@/pages/CourseDetails";
import { AppLayout } from "@/components/layout/AppLayout";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/session/:id" component={ActiveSession} />
        <Route path="/courses/:id" component={CourseDetails} />
        <Route path="/courses">
            <div className="p-8 text-center text-muted-foreground">Courses List Page (Placeholder - Select from Dashboard)</div>
        </Route>
        <Route path="/students">
            <div className="p-8 text-center text-muted-foreground">Students Page (Placeholder)</div>
        </Route>
        <Route path="/schedule">
            <div className="p-8 text-center text-muted-foreground">Schedule Page (Placeholder)</div>
        </Route>
        <Route path="/settings">
            <div className="p-8 text-center text-muted-foreground">Settings Page (Placeholder)</div>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
