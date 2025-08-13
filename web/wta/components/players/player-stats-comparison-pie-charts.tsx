"use client";

import ReactECharts from "echarts-for-react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import type { JSX } from "react";

interface PlayerDetails {
  name_first: string;
  name_last: string;
  ace_avg_last_10_matches: number | null;
  df_avg_last_10_matches: number | null;
  first_in_avg_last_10_matches: number | null;
  first_won_avg_last_10_matches: number | null;
  svpt_avg_last_10_matches: number | null;
  bp_faced_avg_last_10_matches: number | null;
  bp_saved_avg_last_10_matches: number | null;
  win_rate_last_10_matches: number | null;
}

interface PlayerStatsComparisonPieChartsProps {
  player1Details: PlayerDetails | undefined;
  player2Details: PlayerDetails | undefined;
}

export function PlayerStatsComparisonPieCharts({
  player1Details,
  player2Details,
}: PlayerStatsComparisonPieChartsProps) {
  if (!player1Details || !player2Details) {
    return (
      <Card className="mb-10 shadow-lg">
        <CardHeader className="text-white">
          Player Statistics Comparison
        </CardHeader>
        <CardBody className="p-6">
          <p className="text-muted-foreground">
            Select two players to compare their statistics.
          </p>
        </CardBody>
      </Card>
    );
  }

  const getPieOption = (
    chartTitle: string,
    data: { value: number; name: string }[],
  ) => ({
    title: {
      text: chartTitle,
      left: "center",
      textStyle: {
        color: "#fff",
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: data.map((item) => item.name),
      textStyle: {
        color: "#fff",
      },
    },
    series: [
      {
        name: chartTitle,
        type: "pie",
        radius: "50%",
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          color: "#fff",
        },
        labelLine: {
          lineStyle: {
            color: "#fff",
          },
        },
      },
    ],
  });

  const charts: JSX.Element[] = [];

  const p1Name = `${player1Details.name_first} ${player1Details.name_last}`;
  const p2Name = `${player2Details.name_first} ${player2Details.name_last}`;

  // Helper to create a chart if values are valid
  const addChart = (
    title: string,
    p1Value: number | null,
    p2Value: number | null,
    isPercentage = false,
  ) => {
    if (p1Value === null || p2Value === null) return;

    let val1 = p1Value;
    let val2 = p2Value;

    // If it's a percentage (0-1 range), convert to actual percentage points for display
    if (isPercentage) {
      val1 = p1Value * 100;
      val2 = p2Value * 100;
    }

    const total = val1 + val2;

    if (total > 0) {
      charts.push(
        <div key={title} className="w-full md:w-1/2 lg:w-1/3 p-2">
          <ReactECharts
            option={getPieOption(title, [
              { value: val1, name: p1Name },
              { value: val2, name: p2Name },
            ])}
            style={{ height: "250px", width: "100%" }}
          />
        </div>,
      );
    }
  };

  // Add charts for each comparable statistic
  addChart(
    "Win Rate (Last 10 Matches)",
    player1Details.win_rate_last_10_matches,
    player2Details.win_rate_last_10_matches,
    true, // This is a percentage (0-1)
  );

  addChart(
    "Ace Avg (Last 10 Matches)",
    player1Details.ace_avg_last_10_matches,
    player2Details.ace_avg_last_10_matches,
  );

  addChart(
    "DF Avg (Last 10 Matches)",
    player1Details.df_avg_last_10_matches,
    player2Details.df_avg_last_10_matches,
  );

  addChart(
    "First Serve In Rate (Last 10 Matches)",
    player1Details.first_in_avg_last_10_matches,
    player2Details.first_in_avg_last_10_matches,
  );

  addChart(
    "First Serve Points Won Rate (Last 10 Matches)",
    player1Details.first_won_avg_last_10_matches,
    player2Details.first_won_avg_last_10_matches,
    true, // This is a percentage (0-1)
  );

  addChart(
    "Break Points Faced (Last 10 Matches)",
    player1Details.bp_faced_avg_last_10_matches,
    player2Details.bp_faced_avg_last_10_matches,
  );

  addChart(
    "Break Points Saved (Last 10 Matches)",
    player1Details.bp_saved_avg_last_10_matches,
    player2Details.bp_saved_avg_last_10_matches,
  );

  // SVPT Avg is not suitable for a direct pie chart comparison as it's an average, not a sum of parts.

  return (
    <Card className="mb-10 shadow-lg">
      <CardHeader className="text-white">
        Player Statistics Comparison
      </CardHeader>
      <CardBody className="p-6">
        <div className="flex flex-wrap -m-2">
          {charts.length > 0 ? (
            charts
          ) : (
            <p className="text-center text-muted-foreground w-full py-4">
              No comparable statistics available for these players.
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
