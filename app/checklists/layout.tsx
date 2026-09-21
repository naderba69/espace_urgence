// v14.1 — قاموس الاختصارات أسفل قسم قوائم التدقيق.
import Legend from "@/components/ui/Legend";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      {children}
      <Legend />
    </div>
  );
}
