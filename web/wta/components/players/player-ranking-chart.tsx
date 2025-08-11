"use client";

import ReactECharts from "echarts-for-react";

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
    // 所有日期去重并排序
    const dates = Array.from(
      new Set([
        ...player1RankingHistory.map((d) => d.ranking_date),
        ...player2RankingHistory.map((d) => d.ranking_date),
      ]),
    )
      .filter(Boolean)
      .sort() as string[];

    // dataset_raw 数据格式：[ranking_date, player, rank]
    const rawData: (string | number | null)[][] = [];
    dates.forEach((date) => {
      if (player1Name) {
        const p1 = player1RankingHistory.find((d) => d.ranking_date === date);
        rawData.push([date, player1Name, p1?.rank ?? null]);
      }
      if (player2Name) {
        const p2 = player2RankingHistory.find((d) => d.ranking_date === date);
        rawData.push([date, player2Name, p2?.rank ?? null]);
      }
    });

    // 所有球员
    const players = [player1Name, player2Name].filter(Boolean) as string[];

    // 为每个球员生成 dataset + series
    const datasetWithFilters: any[] = [];
    const seriesList: any[] = [];

    players.forEach((player) => {
      const datasetId = "dataset_" + player;
      datasetWithFilters.push({
        id: datasetId,
        fromDatasetId: "dataset_raw",
        transform: {
          type: "filter",
          config: {
            and: [{ dimension: "player", "=": player }],
          },
        },
      });
      seriesList.push({
        type: "line",
        datasetId,
        showSymbol: false,
        name: player,
        endLabel: {
          show: true,
          formatter: (params: any) => {
            return `${params.value[1]}: Rank ${params.value[2] ?? "N/A"}`;
          },
        },
        labelLayout: {
          moveOverlap: "shiftY",
        },
        emphasis: {
          focus: "series",
        },
        encode: {
          x: "ranking_date",
          y: "rank",
          label: ["player", "rank"],
          itemName: "ranking_date",
          tooltip: ["rank"],
        },
      });
    });

    return {
      animationDuration: 8000, // 动画总时长
      animationEasing: "linear",
      dataset: [
        {
          id: "dataset_raw",
          source: [["ranking_date", "player", "rank"], ...rawData],
        },
        ...datasetWithFilters,
      ],
      tooltip: {
        order: "valueAsc",
        trigger: "axis",
        formatter: (params: any) => {
          let res = `Date: ${params[0].name}<br/>`;
          params.forEach((item: any) => {
            res += `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>`;
            res += `${item.seriesName}: Rank ${item.value[2] ?? "N/A"}<br/>`;
          });
          return res;
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
        name: "Rank",
        inverse: true, // 排名越小越高
        min: 0,
        max: 100,
      },
      grid: {
        right: 120,
      },
      series: seriesList,
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
    <div className="w-full h-[500px]">
      <ReactECharts
        option={getOption()}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
