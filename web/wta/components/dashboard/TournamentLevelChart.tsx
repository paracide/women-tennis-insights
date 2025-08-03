"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Card, CardBody, CardHeader } from "@heroui/card";
import prisma from "@/lib/prisma";

interface TournamentLevelData {
  name: string;
  value: number;
}

const LEVEL_LABELS = {
  G: "Grand Slam",
  WTA1000: "WTA 1000",
  WTA500: "WTA 500",
  WTA250: "WTA 250",
  Other: "Other",
};

export default function TournamentLevelChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<TournamentLevelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTournamentLevels() {
      const tournamentData = await prisma.wta.findMany({
        where: {
          tourney_level: {
            not: null,
          },
        },
        select: {
          tourney_level: true,
        },
      });

      // Count tournament levels
      const levelCounts = tournamentData.reduce(
        (acc: Record<string, number>, tournament) => {
          const level = tournament.tourney_level || "Other";
          acc[level] = (acc[level] || 0) + 1;
          return acc;
        },
        {},
      );

      const chartData = Object.entries(levelCounts).map(([level, value]) => ({
        name: LEVEL_LABELS[level as keyof typeof LEVEL_LABELS] || level,
        value,
      }));

      setData(chartData);
      setLoading(false);
    }

    fetchTournamentLevels();
  }, []);

  useEffect(() => {
    if (!chartRef.current || loading || data.length === 0) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: data.map((item) => item.name),
      },
      series: [
        {
          name: "Tournament Level",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "60%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "18",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
          itemStyle: {
            borderRadius: 8,
            borderColor: "#fff",
            borderWidth: 2,
          },
        },
      ],
      color: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [data, loading]);

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">Tournament Level Distribution</h3>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div ref={chartRef} className="h-[400px] w-full" />
        )}
      </CardBody>
    </Card>
  );
}
