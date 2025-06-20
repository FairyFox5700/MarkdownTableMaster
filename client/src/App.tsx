import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Home from "@/pages/home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="*" component={Home} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </DndProvider>
    </QueryClientProvider>
  );
}

export default App;
