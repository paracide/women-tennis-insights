"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Card, CardBody, CardHeader } from "@heroui/card";
import prisma from "@/lib/prisma";

interface DurationData {
  range: string;
  count: number;
}

export default function MatchDurationChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<DurationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDurationData() {
      const matchData = await prisma.wta.findMany({
        where: {
          minutes: {
            not: null,
            gt: 0,
          },
        },
        select: {
          minutes: true,
        },
      });

      // Create duration ranges (in minutes)
      const durationRanges = [
        { range: "0-60", min: 0, max: 60 },
        { range: "61-90", min: 61, max: 90 },
        { range: "91-120", min: 91, max: 120 },
        { range: "121-150", min: 121, max: 150 },
        { range: "151-180", min: 151, max: 180 },
        { range: "181+", min: 181, max: Number.POSITIVE_INFINITY },
      ];

      const durationStats = durationRanges.map(({ range, min, max }) => {
        const count = matchData.filter(
          (match) =>
            match.minutes && match.minutes >= min && match.minutes <= max,
        ).length;

        return {
          range,
          count,
        };
      });

      setData(durationStats);
      setLoading(false);
    }

    fetchDurationData();
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
          return `${data.name} minutes<br/>Matches: ${data.value}`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: data.map((item) => item.range),
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: "value",
        name: "Number of Matches",
      },
      series: [
        {
          name: "Matches",
          type: "bar",
          data: data.map((item) => item.count),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#8b5cf6" },
              { offset: 1, color: "#6366f1" },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.3)",
            },
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
        <h3 className="text-lg font-semibold">Match Duration Distribution</h3>
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
