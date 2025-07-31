import WtaRaceChart from "@/components/dashboard/WtaRaceChart";
import GrandSlamTop10Chart from "@/components/dashboard/GrandSlamTop10Chart";

export default function Bi() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block w-full text-center justify-center">
        <WtaRaceChart/>

        <GrandSlamTop10Chart/>
      </div>
    </section>
  );
}
