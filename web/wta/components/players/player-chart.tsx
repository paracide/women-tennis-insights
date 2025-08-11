"use client";

import ReactECharts from "echarts-for-react";

interface PlayerDetails {
  player_id: number;
  name_first: string;
  name_last: string;
  hand: string;
  dob: string;
  height: number;
  latest_rank: number | null;
  latest_points: number | null;
  latest_rank_date: string | null;
}

interface PlayerChartProps {
  player1: PlayerDetails | null;
  player2: PlayerDetails | null;
}

export function PlayerChart({ player1, player2 }: PlayerChartProps) {
  if (!player1 && !player2) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Select players to see chart comparison.
      </div>
    );
  }

  const getOption = () => {
    // Define indicators for the radar chart. Max/Min values should be adjusted based on your data range.
    const indicator = [
      { name: "Height (cm)", max: 200, min: 150 }, // Example range for height
      { name: "Latest Rank", max: 100, min: 1 }, // Lower rank is better, so min is 1 (top rank)
      { name: "Latest Points", max: 15000, min: 0 }, // Example range for points
      // You can add more attributes here, e.g., 'Age', 'Win Rate' etc.
    ];

    const seriesData = [];

    if (player1) {
      seriesData.push({
        value: [
          player1.height || 0,
          player1.latest_rank || indicator[1].max, // Default to max rank if null
          player1.latest_points || 0,
        ],
        name: `${player1.name_first} ${player1.name_last}`,
        areaStyle: {
          opacity: 0.7,
        },
      });
    }

    if (player2) {
      seriesData.push({
        value: [
          player2.height || 0,
          player2.latest_rank || indicator[1].max,
          player2.latest_points || 0,
        ],
        name: `${player2.name_first} ${player2.name_last}`,
        areaStyle: {
          opacity: 0.7,
        },
      });
    }

    return {
      title: {
        text: "Player Attribute Comparison",
        left: "center",
        textStyle: {
          color: "#333",
          fontSize: 18,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: function (params: any) {
          let res = params.name + "<br/>";
          for (let i = 0; i < indicator.length; i++) {
            res += indicator[i].name + ": " + params.value[i] + "<br/>";
          }
          return res;
        },
      },
      legend: {
        data: seriesData.map((d) => d.name),
        bottom: 10,
        textStyle: {
          color: "#555",
        },
      },
      radar: {
        indicator: indicator,
        radius: "65%",
        center: ["50%", "55%"],
        axisName: {
          color: "#333",
          backgroundColor: "#f6f6f6",
          borderRadius: 3,
          padding: [3, 5],
        },
        splitArea: {
          areaStyle: {
            color: ["#f7f7f7", "#fff"],
            shadowColor: "rgba(0, 0, 0, 0.2)",
            shadowBlur: 10,
          },
        },
        axisLine: {
          lineStyle: {
            color: "rgba(0,0,0,0.1)",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(0,0,0,0.1)",
          },
        },
      },
      series: [
        {
          type: "radar",
          data: seriesData,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            width: 2,
          },
          itemStyle: {
            borderWidth: 1,
          },
        },
      ],
    };
  };

  return (
    <div className="w-full h-[450px]">
      <ReactECharts
        option={getOption()}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
