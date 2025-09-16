
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddStock from "./pages/AddStock";
import AddItem from "./pages/AddItem";
import Reports from "./pages/Reports";
import Sales from "./pages/Sales";
import NotFound from "./pages/NotFound";
import { InventoryProvider } from "./contexts/InventoryContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <InventoryProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
            <Route path="/add-stock" element={<Layout><AddStock /></Layout>} />
            <Route path="/add-item" element={<Layout><AddItem /></Layout>} />
            <Route path="/reports" element={<Layout><Reports /></Layout>} />
            <Route path="/sales" element={<Layout><Sales /></Layout>} />
            {/* These routes will be implemented later */}
            <Route path="/alerts" element={<Layout><Dashboard /></Layout>} />
            <Route path="/settings" element={<Layout><Dashboard /></Layout>} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </InventoryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
