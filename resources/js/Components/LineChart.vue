<template>
  <div class="w-full h-full flex items-center justify-center">
    <div v-if="!hasData" class="text-sm text-base-content/50">Add transactions to see the chart</div>
    <Line v-else :data="chartData" :options="chartOptions" />
  </div>
</template>
<script setup>
import { Line } from 'vue-chartjs';
import { computed } from 'vue';
import 'chart.js/auto';

function makeGradient(context, startColor, endColor) {
  const chart = context.chart;
  const { ctx, chartArea } = chart;

  if (!chartArea) {
    return startColor;
  }

  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);

  return gradient;
}

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const hasData = computed(() => {
  if (!props.data || props.data.length === 0) {
    return false;
  }

  return props.data.some(item => {
    const income = Number(item.income || 0);
    const expense = Number(item.expense || 0);
    return income !== 0 || expense !== 0;
  });
});

const chartData = computed(() => ({
  labels: props.data.map(item => item.date || item.label),
  datasets: [
    {
      label: 'Income',
      data: props.data.map(item => item.income),
      borderColor: '#22c55e',
      backgroundColor: (context) => makeGradient(context, 'rgba(34, 197, 94, 0.28)', 'rgba(34, 197, 94, 0.02)'),
      tension: 0.4,
      fill: true,
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBorderWidth: 3,
      pointHoverBackgroundColor: '#ffffff',
      pointHoverBorderColor: '#22c55e'
    },
    {
      label: 'Expense',
      data: props.data.map(item => item.expense),
      borderColor: '#ef4444',
      backgroundColor: (context) => makeGradient(context, 'rgba(239, 68, 68, 0.24)', 'rgba(239, 68, 68, 0.02)'),
      tension: 0.4,
      fill: true,
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBorderWidth: 3,
      pointHoverBackgroundColor: '#ffffff',
      pointHoverBorderColor: '#ef4444'
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    title: { display: false },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      titleColor: '#f8fafc',
      bodyColor: '#e2e8f0',
      padding: 12,
      cornerRadius: 14,
      displayColors: true,
      callbacks: {
        label(context) {
          const value = Number(context.parsed.y || 0).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          return `${context.dataset.label}: ₱${value}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#94a3b8',
      },
    },
    y: {
      beginAtZero: true,
      border: {
        display: false,
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.16)',
        drawTicks: false,
      },
      ticks: {
        color: '#94a3b8',
        callback(value) {
          return `₱${Number(value).toLocaleString('en-PH')}`;
        },
      },
    },
  },
  elements: {
    line: {
      cubicInterpolationMode: 'monotone',
    },
  },
};
</script>
<style scoped>
</style>
