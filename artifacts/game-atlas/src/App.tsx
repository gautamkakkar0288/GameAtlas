import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const Landing = lazy(() => import("@/pages/Landing"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Library = lazy(() => import("@/pages/Library"));
const GameDetail = lazy(() => import("@/pages/GameDetail"));
const Discover = lazy(() => import("@/pages/Discover"));
const Search = lazy(() => import("@/pages/Search"));
const News = lazy(() => import("@/pages/News"));
const Achievements = lazy(() => import("@/pages/Achievements"));
const Profile = lazy(() => import("@/pages/Profile"));
const Community = lazy(() => import("@/pages/Community"));
const Leaderboards = lazy(() => import("@/pages/Leaderboards"));
const Reviews = lazy(() => import("@/pages/Reviews"));
const Arcade = lazy(() => import("@/pages/Arcade"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if ((error as { status?: number })?.status === 404) return false;
        if ((error as { status?: number })?.status === 401) return false;
        return failureCount < 2;
      },
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function PageFallback() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
        <p className="font-orbitron text-red-700 text-xs tracking-widest uppercase">Loading</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/library" component={Library} />
        <Route path="/library/:id" component={GameDetail} />
        <Route path="/discover" component={Discover} />
        <Route path="/search" component={Search} />
        <Route path="/news" component={News} />
        <Route path="/achievements" component={Achievements} />
        <Route path="/profile" component={Profile} />
        <Route path="/community" component={Community} />
        <Route path="/leaderboards" component={Leaderboards} />
        <Route path="/reviews" component={Reviews} />
        <Route path="/arcade" component={Arcade} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
            <GlobalSearch />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
