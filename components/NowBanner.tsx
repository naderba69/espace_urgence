import T from "@/components/T";
// v5.6 — شارة القيادة: «الآن: …» سطراً واحداً أحمر يوجه الفعل التالي.
export default function NowBanner({ fr, ar }: { fr: string; ar: string }) {
  return (
    <p role="status" className="rounded-2xl border border-red-600 bg-red-600/15 p-4 text-lg font-black text-red-500">
      <T fr={`Maintenant : ${fr}`} ar={`الآن: ${ar}`} />
    </p>
  );
}
