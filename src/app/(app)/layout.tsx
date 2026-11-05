import { AppSidebar } from "@/components/app/AppSidebar";
import { AppHeader } from "@/components/app/AppHeader";
import { FinancialProvider } from "@/context/FinancialContext";
import { RecordTransactionModal } from "@/components/dashboard/RecordTransactionModal";
import { DemoBanner } from "@/components/dashboard/DemoBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FinancialProvider>
      <div className="min-h-screen bg-black flex text-white selection:bg-white selection:text-black">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <DemoBanner />
          <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
        <RecordTransactionModal />
      </div>
    </FinancialProvider>
  );
}
