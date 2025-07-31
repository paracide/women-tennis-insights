import {title} from "@/components/primitives";
import WtaRaceChart from "@/components/dashboard/WtaRaceChart";
import AgeDistributionChart from "@/components/dashboard/AgeDistributionChart";
import StatsCards from "@/components/dashboard/StatsCards";
import MatchDurationChart from "@/components/dashboard/MatchDurationChart";
import MonthlyTournamentActivity from "@/components/dashboard/MonthlyTournamentActivity"; // Your generated types


export default async function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Analyze and visualize</span>
        <br/>
        <span className={title()}>the performance of </span>
        <br/>
        <span className={title({color: "violet"})}>
          Women's Tennis Players
        </span>
        <br/>
      </div>
      <StatsCards/>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <AgeDistributionChart/>
        <MatchDurationChart/>
        <MonthlyTournamentActivity/>
      </div>

      

      <WtaRaceChart></WtaRaceChart>
    </section>
  );
}
