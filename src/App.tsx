import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { StampFilter } from "@/components/Stamp";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import Index from "./pages/Index";

// Scroll to top on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const CryptidDetail = lazy(() => import("./pages/CryptidDetail"));
const Anomalies = lazy(() => import("./pages/Anomalies"));
const AnomalyDetail = lazy(() => import("./pages/AnomalyDetail"));
const About = lazy(() => import("./pages/About"));
const Map = lazy(() => import("./pages/Map"));
const ReportSighting = lazy(() => import("./pages/ReportSighting"));
const Admin = lazy(() => import("./pages/Admin"));
const Analytics = lazy(() => import("./pages/Analytics"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StampFilter />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AnalyticsTracker />
        <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cryptid/:id" element={<CryptidDetail />} />
            <Route path="/anomalies" element={<Anomalies />} />
            <Route path="/anomaly/:id" element={<AnomalyDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/map" element={<Map />} />
            <Route path="/report" element={<ReportSighting />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;