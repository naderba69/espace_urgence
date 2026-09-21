"use client";
// v1.9 — gazométrie interprétée + ajustement ventilatoire (méthode combinée).
import AbgVent from "@/components/tools/AbgVent";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import PageHeader from "@/components/ui/PageHeader";
import { Droplets } from "lucide-react";

export default function GazometriePage() {
  useRegisterRecent("calculateur:gazometrie");
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <PageHeader
        icon={<Droplets className="h-6 w-6" />}
        title={<T fr="Gazométrie & ventilation" ar="الغازات وتعديل التهوية" />}
        sub={<T fr="Interprétation combinée + ajustements du ventilateur." ar="تفسير مركّب + تعديلات التهوية." />}
      />
      <AbgVent />
    </div>
  );
}
