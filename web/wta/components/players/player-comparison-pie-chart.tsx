"use client"

import ReactECharts from "echarts-for-react"
import { Card, CardBody, CardHeader } from "@heroui/card"

interface PlayerDetails {
  name_first: string
  name_last: string
}

interface HeadToHeadStats {
  totalMatches: number
  p1Wins: number
  p2Wins: number
  p1WinRate: string
  p2WinRate: string
  surfaceStats: any[] // Simplified for this component
}

interface PlayerComparisonPieChartProps {
  player1Details: PlayerDetails | null
  player2Details: PlayerDetails | null
  headToHeadStats: HeadToHeadStats | null
  loading: boolean
}

export function PlayerComparisonPieChart({
  player1Details,
  player2Details,
  headToHeadStats,
  loading,
}: PlayerComparisonPieChartProps) {
  if (loading) {
    return (
      <Card className="mb-10 shadow-lg">
        <CardHeader className="text-white">Head-to-Head Win Rate</CardHeader>
        <CardBody className="p-6">
          <div className="text-center text-lg text-blue-600 animate-pulse">Loading head-to-head stats...</div>
        </CardBody>
      </Card>
    )
  }

  if (!player1Details || !player2Details || !headToHeadStats || headToHeadStats.totalMatches === 0) {
    return (
      <Card className="mb-10 shadow-lg">
        <CardHeader className="text-white">Head-to-Head Win Rate</CardHeader>
        <CardBody className="p-6">
          <p className="text-center text-muted-foreground py-4">
            No head-to-head matches found or players not selected.
          </p>
        </CardBody>
      </Card>
    )
  }

  const option = {
    title: {
      text: "Head-to-Head Win Rate",
      left: "center",
      textStyle: {
        color: "#fff", // White color for title
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: [
        `${player1Details.name_first} ${player1Details.name_last}`,
        `${player2Details.name_first} ${player2Details.name_last}`,
      ],
      textStyle: {
        color: "#fff", // White color for legend text
      },
    },
    series: [
      {
        name: "Wins",
        type: "pie",
        radius: "50%",
        data: [
          {
            value: headToHeadStats.p1Wins,
            name: `${player1Details.name_first} ${player1Details.name_last}`,
          },
          {
            value: headToHeadStats.p2Wins,
            name: `${player2Details.name_first} ${player2Details.name_last}`,
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          color: "#fff", // White color for labels
        },
        labelLine: {
          lineStyle: {
            color: "#fff", // White color for label lines
          },
        },
      },
    ],
  }

  return (
    <Card className="mb-10 shadow-lg">
      <CardHeader className="text-white">Head-to-Head Win Rate</CardHeader>
      <CardBody className="p-6">
        <ReactECharts option={option} style={{ height: "300px", width: "100%" }} />
      </CardBody>
    </Card>
  )
}
