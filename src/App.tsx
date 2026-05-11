import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import HomePage from "@/pages/HomePage";
import PricingPage from "@/pages/PricingPage";
import LoginPage from "@/pages/LoginPage";
import MainPage from "@/pages/MainPage";
import ScrollManagement from "@/components/layout/ScrollManagement";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <ScrollManagement />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}
