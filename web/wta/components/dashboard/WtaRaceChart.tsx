"use client"

import { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import type { EChartsOption } from "echarts"

type PlayerData = {
  name: string
  value: number
}

type RaceFrame = {
  date: string
  players: PlayerData[]
}

type Metadata = {
  [name: string]: {
    ioc: string
    emoji: string
    color: string
  }
}

export default function WtaRaceChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const [data, setData] = useState<RaceFrame[]>([])
  const [meta, setMeta] = useState<Metadata>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/data/top10.json")
      if (!response.ok) throw new Error("加载失败")
      const json = await response.json()

      setMeta(json.metadata || {})
      setData(json.data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return

    chartInstance.current = echarts.init(chartRef.current, undefined, {
      renderer: "svg"
    })
    let currentIndex = 0

    const updateChart = () => {
      const current = data[currentIndex]
      const sorted = [...current.players]
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)

      const yLabels = sorted.map((p) => {
        const m = meta[p.name]
        return `${m.emoji} ${p.name}`
      })


      const option: EChartsOption = {
        title: {
          text: "WTA Top Players Ranking Race",
          subtext: current.date,
          left: "center",
          textStyle: {
            fontSize: 22,
            fontWeight: "bold",
          },
          subtextStyle: {
            fontSize: 14,
            color: "#888",
          },
        },
        grid: {
          top: 100,
          bottom: 50,
          left: 200,
          right: 100,
        },
        xAxis: {
          type: "value",
          max: "dataMax",
          axisLabel: {
            formatter: "{value}",
          },
          splitLine: {
            show: true,
            lineStyle: { color: "#eee" },
          },
        },
        yAxis: {
          type: "category",
          data: yLabels,
          inverse: true,
          axisLabel: {
            fontSize: 12,
            formatter: (val: string) => val.length > 18 ? val.slice(0, 18) + "..." : val,
          },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        series: [
          {
            type: "bar",
            data: sorted.map((p) => ({
              value: p.value,
              itemStyle: {
                color: meta[p.name]?.color ?? "#999",
              },
            })),
            label: {
              show: true,
              position: "right",
              formatter: "{c}",
              fontWeight: "bold",
            },
            barWidth: "60%",
            animationDuration: 500,
            animationEasing: "cubicOut",
          },
        ],
        animationDuration: 500,
        animationEasing: "cubicOut",
      }

      chartInstance.current?.setOption(option)
    }

    updateChart()

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % data.length
      updateChart()
    }, 500)

    const resize = () => chartInstance.current?.resize()
    window.addEventListener("resize", resize)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resize)
      chartInstance.current?.dispose()
    }
  }, [data, meta])

  function countryCodeToEmoji(code: string): string {
    return code
      .toUpperCase()
      .replace(/./g, char =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      )
  }

  if (loading) {
    return (
      <div className="w-full h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center text-gray-600">加载数据中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center text-red-600">
          加载失败: {error}
          <br />
          <button onClick={loadData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[600px] p-4">
      <div ref={chartRef} className="w-full h-[600px] border rounded shadow" />
    </div>
  )
}
