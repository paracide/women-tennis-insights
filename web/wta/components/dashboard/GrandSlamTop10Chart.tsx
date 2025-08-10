"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Card, CardBody, CardHeader } from "@heroui/card";

interface GrandSlamData {
  player_name: string;
  grand_slam_count: number;
  country: string;
}

export default function GrandSlamTop10Chart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<GrandSlamData[]>([]);
  const [loading, setLoading] = useState(true);

  const staticData: GrandSlamData[] = [
    { player_name: "Margaret Court", grand_slam_count: 24, country: "AUS" },
    { player_name: "Serena Williams", grand_slam_count: 23, country: "USA" },
    { player_name: "Steffi Graf", grand_slam_count: 22, country: "GER" },
    { player_name: "Helen Wills Moody", grand_slam_count: 19, country: "USA" },
    {
      player_name: "Martina Navratilova",
      grand_slam_count: 18,
      country: "USA",
    },
    { player_name: "Chris Evert", grand_slam_count: 18, country: "USA" },
    { player_name: "Billie Jean King", grand_slam_count: 12, country: "USA" },
    { player_name: "Maureen Connolly", grand_slam_count: 9, country: "USA" },
    { player_name: "Monica Seles", grand_slam_count: 9, country: "USA" },
    { player_name: "Suzanne Lenglen", grand_slam_count: 8, country: "FRA" },
  ];

  useEffect(() => {
    const sortedData = staticData
      .sort((a, b) => b.grand_slam_count - a.grand_slam_count)
      .slice(0, 10);

    setData(sortedData);
    setLoading(false);
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
          const dataIndex = params[0].dataIndex;
          const player = data[dataIndex];
          return `
            <div style="padding: 8px;">
              <strong>${player.player_name}</strong><br/>
              Grand Slam Titles: ${player.grand_slam_count}<br/>
              Country: ${player.country}
            </div>
          `;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "20%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        name: "Grand Slam Titles",
        minInterval: 1,
      },
      yAxis: {
        type: "category",
        inverse: true,
        data: data.map((item) => item.player_name),
        axisLabel: {
          fontSize: 12,
          interval: 0,
        },
      },

      series: [
        {
          name: "Grand Slam Titles",
          type: "bar",
          data: data.map((item, index) => ({
            value: item.grand_slam_count,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color:
                    index === 0 ? "#ffd700" : index < 3 ? "#c0392b" : "#e74c3c",
                },
                {
                  offset: 1,
                  color:
                    index === 0 ? "#ffed4e" : index < 3 ? "#e74c3c" : "#ff6b6b",
                },
              ]),
            },
          })),
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.3)",
            },
          },
          label: {
            show: true,
            position: "top",
            formatter: (params: any) => {
              return params.value.toString();
            },
            fontSize: 12,
            fontWeight: "bold",
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
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Grand Slam Champions</h3>
        </div>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="h-[500px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-[500px] flex items-center justify-center text-default-500">
            No Grand Slam data available
          </div>
        ) : (
          <div ref={chartRef} className="h-[500px] w-full" />
        )}
      </CardBody>
    </Card>
  );
}
