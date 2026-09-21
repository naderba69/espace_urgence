// v13.3 — شريط «المريض النشط» أعلى كل صفحات الحاسبات.
import ActivePatient from "@/components/ActivePatient";
import Legend from "@/components/ui/Legend";

export default function CalculateursLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <ActivePatient />
      {children}
      <Legend />
    </div>
  );
}
