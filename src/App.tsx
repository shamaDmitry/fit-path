import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Route, Routes } from "react-router";
import Index from "@/pages/Index";
import Quiz from "@/pages/Quiz";
import Checkout from "@/pages/Checkout";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    // <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    // </QueryClientProvider>
  );
}

export default App;
