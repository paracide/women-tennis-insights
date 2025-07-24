import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import MetabaseDashboard from "@/app/dashboard/metabase-dashboard";
import LookerReport from "@/components/dashboard/looker-studio";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Analyze and visualize</span><br />
        <span className={title()}>the performance of </span><br />
        <span className={title({ color: "violet" })}>women's tennis players</span>
        <br />
      </div>
       <div className="inline-block text-center justify-center">
        <MetabaseDashboard />
      </div>
     <div className="inline-block text-center justify-center">
        <LookerReport/>
      </div>
    </section>
  );
}
