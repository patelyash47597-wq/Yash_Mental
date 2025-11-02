import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- Page Imports (Ensure these paths are correct in your project) ---
import Index from "./pages/Index";

import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import ThoughtDetox from "./pages/Calender";
import IB from "./pages/Image"; 
import MentalHealthQuiz from "./pages/MentalHealthQuiz";
import Diary from "./pages/Diary";
import SafeSpace from "./pages/SafeSpace";
import MusicAssistant from "./components/Music";
import MildServices from "./pages/Mild";
import ModerateServices from "./pages/Moderate";
import SevereServices from "./pages/Severe";
// --------------------------------------------------------------------

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
         <Route path="/Detox" element={<ThoughtDetox/>}/>
          <Route path="/IB" element={<IB />} />
          <Route path="/quiz" element={<MentalHealthQuiz />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/diary" element={<Diary/>}/>
          <Route path="/Safespace" element={<SafeSpace/>}/>
          <Route path="/music" element={<MusicAssistant/>}/>
          <Route path="/mild" element={<MildServices/>}/>
           <Route path="/moderate" element={<ModerateServices/>}/>
           <Route path="/severe" element={<SevereServices/>}/>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);