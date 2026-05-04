import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ChatApp from "@/pages/ChatApp";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/auth/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Redirect to="/chat" />
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/chat">
        <ProtectedRoute>
          <ChatApp />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
