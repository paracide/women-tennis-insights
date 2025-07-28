import LookerReport from "@/components/dashboard/looker-studio";

export default function Bi() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block text-center justify-center">
        <LookerReport />
      </div>
    </section>
  );
}
