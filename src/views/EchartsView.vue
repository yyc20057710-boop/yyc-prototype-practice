<script setup>
import * as echarts from "echarts";
import { onBeforeUnmount, onMounted, ref } from "vue";

const pieChartEl = ref(null);
const radarChartEl = ref(null);
const barChartEl = ref(null);
const lineChartEl = ref(null);
const chartInstances = [];

const seriesData = [
  { value: 335, name: "华东" },
  { value: 310, name: "华北" },
  { value: 234, name: "华南" },
  { value: 210, name: "西南" },
  { value: 176, name: "西北" },
  { value: 98, name: "东北" },
];

onMounted(() => {
  const pieChart = echarts.init(pieChartEl.value);
  pieChart.setOption({
    title: { text: "地区数据（饼图）" },
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "55%",
        data: seriesData,
      },
    ],
  });

  const radarChart = echarts.init(radarChartEl.value);
  radarChart.setOption({
    title: { text: "地区能力（雷达图）" },
    tooltip: {},
    legend: { data: ["本期", "上期"] },
    radar: {
      indicator: [
        { name: "销售", max: 6500 },
        { name: "管理", max: 16000 },
        { name: "信息技术", max: 30000 },
        { name: "客服", max: 38000 },
        { name: "研发", max: 52000 },
      ],
    },
    series: [
      {
        type: "radar",
        data: [
          { value: [4300, 10000, 28000, 35000, 50000], name: "本期" },
          { value: [5000, 14000, 28000, 31000, 42000], name: "上期" },
        ],
      },
    ],
  });

  const barChart = echarts.init(barChartEl.value);
  barChart.setOption({
    title: { text: "地区对比（柱状图）" },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
    xAxis: {
      type: "category",
      data: seriesData.map((d) => d.name),
      axisTick: { alignWithLabel: true },
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "数值",
        type: "bar",
        barWidth: "42%",
        data: seriesData.map((d) => d.value),
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#83bff6" },
            { offset: 0.5, color: "#188df0" },
            { offset: 1, color: "#188df0" },
          ]),
        },
      },
    ],
  });

  const lineChart = echarts.init(lineChartEl.value);
  lineChart.setOption({
    title: { text: "月度趋势（折线图）" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["1月", "2月", "3月", "4月", "5月", "6月"],
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "华东",
        type: "line",
        smooth: true,
        data: [120, 132, 101, 134, 190, 230],
      },
      {
        name: "华南",
        type: "line",
        smooth: true,
        data: [220, 182, 191, 234, 290, 330],
      },
    ],
  });

  chartInstances.push(pieChart, radarChart, barChart, lineChart);
  window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
  chartInstances.forEach((chart) => chart?.dispose());
});

function onResize() {
  chartInstances.forEach((chart) => chart?.resize());
}
</script>

<template>
  <div class="wrap">
    <h2>echarts</h2>
    <div class="grid">
      <div ref="pieChartEl" class="chart" />
      <div ref="radarChartEl" class="chart" />
      <div ref="barChartEl" class="chart chart-full" />
      <div ref="lineChartEl" class="chart chart-full" />
    </div>
  </div>
</template>

<style scoped>
.wrap {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.chart {
  width: 100%;
  height: 360px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}
.chart-full {
  grid-column: 1 / -1;
}
</style>
