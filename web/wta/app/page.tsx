import { title } from "@/components/primitives";
import AgeDistributionChart from "@/components/dashboard/AgeDistributionChart";
import MatchDurationChart from "@/components/dashboard/MatchDurationChart";
import MonthlyTournamentActivity from "@/components/dashboard/MonthlyTournamentActivity";
import SurfaceDistributionChart from "@/components/dashboard/SurfaceDistributionChart";
import TopPlayersWinRateChart from "@/components/dashboard/TopPlayersWinRateChart";
import TournamentLevelChart from "@/components/dashboard/TournamentLevelChart"; // Your generated types

export default async function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Analyze and visualize</span>
        <br />
        <span className={title()}>the performance of </span>
        <br />
        <span className={title({ color: "violet" })}>
          Women's Tennis Players
        </span>
        <br />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <AgeDistributionChart />
        <MatchDurationChart />
        <MonthlyTournamentActivity />
        <SurfaceDistributionChart />
        <TopPlayersWinRateChart />
        <TournamentLevelChart />
      </div>
    </section>
  );
}
