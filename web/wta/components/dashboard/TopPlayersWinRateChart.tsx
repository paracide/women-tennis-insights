"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { supabase } from "@/lib/supabase";

interface PlayerWinRate {
  name: string;
  winRate: number;
  wins: number;
  losses: number;
  totalMatches: number;
}

export default function TopPlayersWinRateChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<PlayerWinRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayerWinRates() {
      const { data: matches, error } = await supabase
        .from("wta")
        .select("winner_name, loser_name")
        .not("winner_name", "is", null)
        .not("loser_name", "is", null);

      if (error) {
        console.error("Error fetching match data:", error);
        setLoading(false);
        return;
      }

      // Calculate win/loss records
      const playerStats: Record<string, { wins: number; losses: number }> = {};

      matches.forEach((match) => {
        const winner = match.winner_name!;
        const loser = match.loser_name!;

        if (!playerStats[winner]) {
          playerStats[winner] = { wins: 0, losses: 0 };
        }
        if (!playerStats[loser]) {
          playerStats[loser] = { wins: 0, losses: 0 };
        }

        playerStats[winner].wins++;
        playerStats[loser].losses++;
      });

      // Calculate win rates and filter for players with at least 20 matches
      const playerWinRates = Object.entries(playerStats)
        .map(([name, stats]) => {
          const totalMatches = stats.wins + stats.losses;
          const winRate =
            totalMatches > 0 ? (stats.wins / totalMatches) * 100 : 0;
          return {
            name,
            winRate: Math.round(winRate * 100) / 100,
            wins: stats.wins,
            losses: stats.losses,
            totalMatches,
          };
        })
        .filter((player) => player.totalMatches >= 20)
        .sort((a, b) => a.winRate - b.winRate)
        .slice(0, 15);

      setData(playerWinRates);
      setLoading(false);
    }

    fetchPlayerWinRates();
  }, []);

  useEffect(() => {
    if (!chartRef.current || loading || data.length === 0) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: "Top Players by Win Rate",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: any) => {
          const data = params[0];
          const player = data.name;
          const winRate = data.value;
          const playerData = data.data;
          return `${player}<br/>Win Rate: ${winRate}%<br/>Wins: ${playerData.wins}<br/>Losses: ${playerData.losses}<br/>Total: ${playerData.totalMatches}`;
        },
      },
      grid: {
        left: "15%",
        right: "10%",
        bottom: "10%",
        top: "15%",
      },
      xAxis: {
        type: "value",
        min: 0,
        max: 100,
        axisLabel: {
          formatter: "{value}%",
        },
      },
      yAxis: {
        type: "category",
        data: data.map((player) => player.name),
        axisLabel: {
          fontSize: 10,
        },
      },
      series: [
        {
          name: "Win Rate",
          type: "bar",
          data: data.map((player) => ({
            value: player.winRate,
            wins: player.wins,
            losses: player.losses,
            totalMatches: player.totalMatches,
          })),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#3b82f6" },
              { offset: 1, color: "#1d4ed8" },
            ]),
            borderRadius: [0, 4, 4, 0],
          },
        },
      ],
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
        <h3 className="text-lg font-semibold">Top Players by Win Rate</h3>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="h-[500px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div ref={chartRef} className="h-[500px] w-full" />
        )}
      </CardBody>
    </Card>
  );
}
