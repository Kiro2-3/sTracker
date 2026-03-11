<template>
  <div class="w-full h-full">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
<script setup>
import { Doughnut } from 'vue-chartjs';
import { computed } from 'vue';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, Filler);
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  colors: {
    type: Array,
    required: false,
    default: () => []
  }
});

const chartData = computed(() => ({
  labels: props.data.map(item => item.label),
  datasets: [
    {
      data: props.data.map(item => item.value),
      backgroundColor: props.colors.length ? props.colors : [
        '#6366f1', '#a21caf', '#f59e42', '#22c55e', '#ef4444', '#0ea5e9', '#fbbf24', '#eab308', '#f472b6', '#818cf8'
      ],
      borderWidth: 0,
      borderRadius: 12,
      spacing: 4,
      hoverOffset: 6,
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
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
      callbacks: {
        label(context) {
          const value = Number(context.parsed || 0).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          return `${context.label}: ₱${value}`;
        },
      },
    },
  }
};
</script>
<style scoped>
</style>
