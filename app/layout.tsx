import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import DemoModeSelector from "@/components/DemoModeSelector";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { SecurityProvider } from "@/context/SecurityContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VeriDoc AI — Identity Intelligence & Document Verification",
  description:
    "Next-generation identity intelligence and document forensics platform with multi-modal AI for OCR, tampering detection, face matching, and risk fusion.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex text-[15px]`}>
        <ThemeProvider>
          <LanguageProvider>
            <SecurityProvider>
              <Sidebar />
              <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden transition-all duration-300">
                {children}
              </main>
              <DemoModeSelector />
            </SecurityProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
