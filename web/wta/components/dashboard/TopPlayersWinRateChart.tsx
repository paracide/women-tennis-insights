"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Card, CardBody, CardHeader } from "@heroui/card";

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
      const res = await fetch("/api/wta/playerWinRate");
      const playerWinRates: PlayerWinRate[] = await res.json();
      setData(playerWinRates);
      setLoading(false);
    }
    fetchPlayerWinRates();
  }, []);

  useEffect(() => {
    if (!chartRef.current || loading || data.length === 0) return;

    const chart = echarts.init(chartRef.current);

    const option = {
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
