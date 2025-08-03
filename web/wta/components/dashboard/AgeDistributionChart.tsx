"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Card, CardBody, CardHeader } from "@heroui/card";

interface AgeData {
  ageRange: string;
  winners: number;
  losers: number;
}

export default function AgeDistributionChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<AgeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgeData() {
      const res = await fetch("/api/wta/ageData");
      const ageStats: AgeData[] = await res.json();
      setData(ageStats);
      setLoading(false);
    }
    fetchAgeData();
  }, []);

  useEffect(() => {
    if (!chartRef.current || loading || data.length === 0) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross", label: { backgroundColor: "#6a7985" } },
      },
      legend: { data: ["Winners", "Losers"], top: "10%" },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "20%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: data.map((item) => item.ageRange),
        },
      ],
      yAxis: [{ type: "value" }],
      series: [
        {
          name: "Winners",
          type: "line",
          stack: "Total",
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(16, 185, 129, 0.6)" },
              { offset: 1, color: "rgba(16, 185, 129, 0.1)" },
            ]),
          },
          emphasis: { focus: "series" },
          data: data.map((item) => item.winners),
          smooth: true,
          itemStyle: { color: "#10b981" },
        },
        {
          name: "Losers",
          type: "line",
          stack: "Total",
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(239, 68, 68, 0.6)" },
              { offset: 1, color: "rgba(239, 68, 68, 0.1)" },
            ]),
          },
          emphasis: { focus: "series" },
          data: data.map((item) => item.losers),
          smooth: true,
          itemStyle: { color: "#ef4444" },
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
      <CardHeader className="w-full">
        <h3 className="text-lg font-semibold">Age Distribution</h3>
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
