"use client"

import { useEffect, useState, useRef } from "react"
import * as echarts from "echarts"
import { Card, CardBody, CardHeader } from "@heroui/card"
import { supabase } from "@/lib/supabase"

interface MonthlyData {
  month: string
  matches: number
  tournaments: number
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function MonthlyTournamentActivity() {
  const chartRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMonthlyData() {
      const { data: tournamentData, error } = await supabase
        .from("wta")
        .select("tourney_date, tourney_id")
        .not("tourney_date", "is", null)

      if (error) {
        console.error("Error fetching tournament data:", error)
        setLoading(false)
        return
      }

      // Group by month
      const monthlyStats: Record<number, { matches: number; tournaments: Set<string> }> = {}

      tournamentData.forEach((match) => {
        if (match.tourney_date) {
          const date = new Date(match.tourney_date)
          const month = date.getMonth()

          if (!monthlyStats[month]) {
            monthlyStats[month] = { matches: 0, tournaments: new Set() }
          }

          monthlyStats[month].matches++
          if (match.tourney_id) {
            monthlyStats[month].tournaments.add(match.tourney_id)
          }
        }
      })

      const chartData = MONTHS.map((monthName, index) => ({
        month: monthName,
        matches: monthlyStats[index]?.matches || 0,
        tournaments: monthlyStats[index]?.tournaments.size || 0,
      }))

      setData(chartData)
      setLoading(false)
    }

    fetchMonthlyData()
  }, [])

  useEffect(() => {
    if (!chartRef.current || loading || data.length === 0) return

    const chart = echarts.init(chartRef.current)

    const option = {
      title: {
        text: "Monthly Tournament Activity",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: {
        data: ["Matches", "Tournaments"],
        top: "10%",
      },
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
          data: data.map((item) => item.month),
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Matches",
          position: "left",
        },
        {
          type: "value",
          name: "Tournaments",
          position: "right",
        },
      ],
      series: [
        {
          name: "Matches",
          type: "line",
          yAxisIndex: 0,
          data: data.map((item) => item.matches),
          smooth: true,
          itemStyle: {
            color: "#3b82f6",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
              { offset: 1, color: "rgba(59, 130, 246, 0.1)" },
            ]),
          },
        },
        {
          name: "Tournaments",
          type: "line",
          yAxisIndex: 1,
          data: data.map((item) => item.tournaments),
          smooth: true,
          itemStyle: {
            color: "#ef4444",
          },
          lineStyle: {
            width: 3,
          },
        },
      ],
    }

    chart.setOption(option)

    const handleResize = () => chart.resize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chart.dispose()
    }
  }, [data, loading])

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">Monthly Tournament Activity</h3>
        <p className="text-sm text-default-500">Number of matches and tournaments by month</p>
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
  )
}
