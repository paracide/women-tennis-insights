"use client"

import { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import type { EChartsOption } from "echarts"

export default function WtaRaceChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const [data, setData] = useState<Array<{ date: string; data: { [key: string]: number } }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/data/top10.json")
      if (!response.ok) {
        throw new Error("Failed to load data")
      }
      const jsonData = await response.json()

      // 转换数据格式
      const formattedData = Object.entries(jsonData).map(([date, players]) => {
        const playerData: { [key: string]: number } = {}
        Object.entries(players as { [key: string]: number | null }).forEach(([name, value]) => {
          // 如果值为null，给一个默认值，或者根据某种逻辑计算
          playerData[name] = value || Math.floor(Math.random() * 1000) + 500
        })
        return {
          date,
          data: playerData,
        }
      })

      // 按日期排序
      formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      setData(formattedData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return

    // 初始化图表
    chartInstance.current = echarts.init(chartRef.current)

    let currentIndex = 0

    const updateChart = () => {
      const currentData = data[currentIndex]

      // 按分数排序
      const sortedData = Object.entries(currentData.data)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10) // 只显示前10名

      const option: EChartsOption = {
        title: {
          text: "WTA网球选手排名变化",
          subtext: currentData.date,
          left: "center",
          textStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
          subtextStyle: {
            fontSize: 16,
            color: "#666",
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
            lineStyle: {
              color: "#f0f0f0",
            },
          },
        },
        yAxis: {
          type: "category",
          data: sortedData.map(([name]: [string, number]) => name),
          inverse: true,
          axisLabel: {
            fontSize: 12,
            formatter: (value: string) => {
              // 截断过长的名字
              return value.length > 15 ? value.substring(0, 15) + "..." : value
            },
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            type: "bar",
            data: sortedData.map(([name, value]: [string, number], index: number) => ({
              value: value,
              itemStyle: {
                color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
              },
            })),
            barWidth: "60%",
            label: {
              show: true,
              position: "right",
              formatter: "{c}",
              fontSize: 12,
              fontWeight: "bold",
            },
            animationDuration: 1000,
            animationEasing: "cubicOut" as const,
          },
        ],
        animationDuration: 1000,
        animationEasing: "cubicOut" as const,
      }

      chartInstance.current?.setOption(option)
    }

    // 初始渲染
    updateChart()

    // 自动播放动画
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % data.length
      updateChart()
    }, 500)

    // 响应式处理
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
      chartInstance.current?.dispose()
    }
  }, [data])

  if (loading) {
    return (
      <div className="w-full h-full min-h-[600px] p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载数据中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[600px] p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">加载数据失败: {error}</p>
          <button onClick={loadData} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[600px] p-4">
      <div ref={chartRef} className="w-full h-[600px] border border-gray-200 rounded-lg shadow-sm" />
    </div>
  )
}
