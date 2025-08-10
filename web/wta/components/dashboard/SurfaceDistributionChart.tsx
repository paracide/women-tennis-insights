"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Card, CardBody, CardHeader } from "@heroui/card";

interface SurfaceData {
  name: string;
  value: number;
}

export default function SurfaceDistributionChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<SurfaceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSurfaceData() {
      const res = await fetch("/api/wta/surfaceData");
      const chartData: SurfaceData[] = await res.json();
      setData(chartData);
      setLoading(false);
    }

    fetchSurfaceData();
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
          name: "Surface",
          type: "pie",
          radius: "50%",
          center: ["50%", "60%"],
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          itemStyle: {
            borderRadius: 8,
            borderColor: "#fff",
            borderWidth: 2,
          },
        },
      ],
      color: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"],
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
        <h3 className="text-lg font-semibold">
          Tournament Surface Distribution
        </h3>
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
