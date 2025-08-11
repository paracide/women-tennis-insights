"use client"

import ReactECharts from "echarts-for-react"
import { Card, CardBody, CardHeader } from "@heroui/card"

interface PlayerDetails {
  player_id: number
  name_first: string
  name_last: string
  ioc: string
  hand: string
  dob: string
  height: number
  latest_rank: number | null
  latest_points: number | null
  latest_rank_date: string | null
  ace_avg_last_10_matches: number | null
  df_avg_last_10_matches: number | null
  first_in_avg_last_10_matches: number | null
  first_won_avg_last_10_matches: number | null
  svpt_avg_last_10_matches: number | null
  bp_faced_avg_last_10_matches: number | null
  bp_saved_avg_last_10_matches: number | null
  win_rate_last_10_matches: number | null
}

interface PlayerStatsPieChartsProps {
  playerDetails: PlayerDetails | null
  title: string
}

export function PlayerStatsPieCharts({ playerDetails, title }: PlayerStatsPieChartsProps) {
  if (!playerDetails) {
    return (
      <Card className="flex-1 min-w-[300px] shadow-lg">
        <CardHeader>{title}</CardHeader>
        <CardBody className="p-6">
          <p className="text-muted-foreground">Select a player to see detailed stats.</p>
        </CardBody>
      </Card>
    )
  }

  const getPieOption = (chartTitle: string, data: { value: number; name: string }[]) => ({
    title: {
      text: chartTitle,
      left: "center",
      textStyle: {
        color: "#fff",
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: data.map((item) => item.name),
      textStyle: {
        color: "#fff",
      },
    },
    series: [
      {
        name: chartTitle,
        type: "pie",
        radius: "50%",
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          color: "#fff",
        },
        labelLine: {
          lineStyle: {
            color: "#fff",
          },
        },
      },
    ],
  })

  const charts = []

  // 1. Win Rate Last 10 Matches
  if (playerDetails.win_rate_last_10_matches !== null) {
    const winRate = playerDetails.win_rate_last_10_matches * 100
    const lossRate = 100 - winRate
    charts.push(
      <div key="win-rate" className="w-full md:w-1/2 lg:w-1/3 p-2">
        <ReactECharts
          option={getPieOption("Win Rate (Last 10 Matches)", [
            { value: winRate, name: "Wins" },
            { value: lossRate, name: "Losses" },
          ])}
          style={{ height: "250px", width: "100%" }}
        />
      </div>,
    )
  }

  // 2. First In Avg Last 10 Matches
  if (playerDetails.first_in_avg_last_10_matches !== null) {
    const firstIn = playerDetails.first_in_avg_last_10_matches
    const firstOut = 100 - firstIn
    charts.push(
      <div key="first-in" className="w-full md:w-1/2 lg:w-1/3 p-2">
        <ReactECharts
          option={getPieOption("First Serve In Rate (Last 10 Matches)", [
            { value: firstIn, name: "First Serve In" },
            { value: firstOut, name: "First Serve Out" },
          ])}
          style={{ height: "250px", width: "100%" }}
        />
      </div>,
    )
  }

  // 3. First Won Avg Last 10 Matches
  if (playerDetails.first_won_avg_last_10_matches !== null) {
    const firstWon = playerDetails.first_won_avg_last_10_matches * 100
    const firstLost = 100 - firstWon
    charts.push(
      <div key="first-won" className="w-full md:w-1/2 lg:w-1/3 p-2">
        <ReactECharts
          option={getPieOption("First Serve Points Won Rate (Last 10 Matches)", [
            { value: firstWon, name: "First Serve Points Won" },
            { value: firstLost, name: "First Serve Points Lost" },
          ])}
          style={{ height: "250px", width: "100%" }}
        />
      </div>,
    )
  }

  // 4. BP Saved Avg Last 10 Matches
  if (playerDetails.bp_faced_avg_last_10_matches !== null && playerDetails.bp_saved_avg_last_10_matches !== null) {
    const bpFaced = playerDetails.bp_faced_avg_last_10_matches
    const bpSaved = playerDetails.bp_saved_avg_last_10_matches
    const bpLost = bpFaced - bpSaved

    if (bpFaced > 0) {
      charts.push(
        <div key="bp-saved" className="w-full md:w-1/2 lg:w-1/3 p-2">
          <ReactECharts
            option={getPieOption("Break Points Saved (Last 10 Matches)", [
              { value: bpSaved, name: "Break Points Saved" },
              { value: bpLost, name: "Break Points Lost" },
            ])}
            style={{ height: "250px", width: "100%" }}
          />
        </div>,
      )
    }
  }

  // 5. Ace Avg vs DF Avg Last 10 Matches (combined)
  if (playerDetails.ace_avg_last_10_matches !== null && playerDetails.df_avg_last_10_matches !== null) {
    const aceAvg = playerDetails.ace_avg_last_10_matches
    const dfAvg = playerDetails.df_avg_last_10_matches
    const total = aceAvg + dfAvg
    if (total > 0) {
      charts.push(
        <div key="ace-df" className="w-full md:w-1/2 lg:w-1/3 p-2">
          <ReactECharts
            option={getPieOption("Aces vs. Double Faults (Last 10 Matches)", [
              { value: aceAvg, name: "Aces" },
              { value: dfAvg, name: "Double Faults" },
            ])}
            style={{ height: "250px", width: "100%" }}
          />
        </div>,
      )
    }
  }

  return (
    <Card className="mb-10 shadow-lg">
      <CardHeader className="text-white">{title}</CardHeader>
      <CardBody className="p-6">
        <div className="flex flex-wrap -m-2">
          {charts.length > 0 ? (
            charts
          ) : (
            <p className="text-center text-muted-foreground w-full py-4">No relevant stats available for charts.</p>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
