"use client";

import ReactECharts from "echarts-for-react";
import { format } from "date-fns";

interface RankingData {
  ranking_date: string | null;
  rank: number | null;
  points: number | null;
}

interface PlayerRankingChartProps {
  player1Name: string | null;
  player1RankingHistory: RankingData[];
  player2Name: string | null;
  player2RankingHistory: RankingData[];
}

export function PlayerRankingChart({
  player1Name,
  player1RankingHistory,
  player2Name,
  player2RankingHistory,
}: PlayerRankingChartProps) {
  const getOption = () => {
    const dates = Array.from(
      new Set([
        ...player1RankingHistory.map((d) => d.ranking_date),
        ...player2RankingHistory.map((d) => d.ranking_date),
      ]),
    )
      .filter(Boolean)
      .sort() as string[]; // Get all unique dates and sort them

    const player1Ranks = dates.map((date) => {
      const data = player1RankingHistory.find((d) => d.ranking_date === date);
      return data ? data.rank : null;
    });

    const player2Ranks = dates.map((date) => {
      const data = player2RankingHistory.find((d) => d.ranking_date === date);
      return data ? data.rank : null;
    });

    // Determine min/max rank for Y-axis
    const allRanks = [...player1Ranks, ...player2Ranks].filter(
      (rank) => rank !== null,
    ) as number[];
    const minRank = allRanks.length > 0 ? Math.min(...allRanks) : 1;
    const maxRank = allRanks.length > 0 ? Math.max(...allRanks) : 100;

    return {
      tooltip: {
        trigger: "axis",
        formatter: function (params: any) {
          let res = `Date: ${params[0].name}<br/>`;
          params.forEach((item: any) => {
            res += `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>`;
            res += `${item.seriesName}: Rank ${item.value !== null ? item.value : "N/A"}<br/>`;
          });
          return res;
        },
      },
      legend: {
        data: [player1Name, player2Name].filter(Boolean),
        bottom: 10,
        textStyle: {
          color: "#555",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: dates,
        axisLabel: {
          interval: Math.ceil(dates.length / 10), // Show fewer labels if too many dates
          formatter: function (value: string) {
            return format(new Date(value), "yyyy"); // Format date for display
          },
        },
      },
      yAxis: {
        type: "value",
        name: "Rank",
        inverse: true, // Lower rank is better, so invert the axis
        min: 0, // Changed: Start from 0 to give space above rank 1
        max: 100,
        axisLabel: {
          formatter: "Rank {value}",
        },
        splitNumber: 5, // Ensure enough split lines
      },
      series: [
        {
          name: player1Name,
          type: "line",
          data: player1Ranks,
          emphasis: {
            focus: "series",
          },
          itemStyle: {
            color: "#4CAF50", // Green for player 1
          },
        },
        {
          name: player2Name,
          type: "line",
          data: player2Ranks,
          emphasis: {
            focus: "series",
          },
          itemStyle: {
            color: "#2196F3", // Blue for player 2
          },
        },
      ].filter((s) => s.name !== null), // Filter out series if player is not selected
    };
  };

  if (!player1Name && !player2Name) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Select players to see ranking trend.
      </div>
    );
  }

  return (
    <div className="w-full h-[450px]">
      <ReactECharts
        option={getOption()}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
