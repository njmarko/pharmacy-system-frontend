<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: ["statistics"],
  data() {
    return {
      random: new Math.seedrandom('xd'),
      gradients: [],
      options: {
        legend: {
          display: true,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.yLabel;
            },
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    };
  },
  mounted() {
    const datasets = this.statistics.map((s) => {
      const data = this.getRandomGradient();
      return {
        label: s.name,
        borderColor: "#0b6cdb",
        pointBackgroundColor: data.color,
        borderWidth: 1,
        pointBorderColor: "#0b6cdb",
        backgroundColor: data.gradient,
        data: s.values,
      };
    });

    this.renderChart(
      {
        labels: this.statistics[0].labels,
        datasets: datasets,
      },
      { responsive: true, maintainAspectRatio: false, ...this.options }
    );
  },
  methods: {
    getRandomGradient: function () {
      const gradient = this.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);
        const r = Math.round(this.random.quick() * 255);
        const g = Math.round(this.random.quick() * 255);
        const b = Math.round(this.random.quick() * 255);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.25)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.1)`);
        return {color: `rgba(${r}, ${g}, ${b}, 1)`, gradient: gradient};
    },
  },
};
</script>
