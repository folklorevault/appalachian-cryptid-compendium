import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StampFilter } from "@/components/Stamp";
import Index from "./pages/Index";

const CryptidDetail = lazy(() => import("./pages/CryptidDetail"));
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
        <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cryptid/:id" element={<CryptidDetail />} />
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