<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: ["statistics"],
  data() {
    return {
      options: {
        legend: {
          display: false,
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
    this.renderChart(
      {
        labels: this.statistics.labels,
        datasets: [
          {
            borderColor: "#0b6cdb",
            pointBackgroundColor: "black",
            borderWidth: 1,
            pointBorderColor: "black",
            backgroundColor: "#0b6cdb",
            data: this.statistics.values,
          },
        ],
      },
      { responsive: true, maintainAspectRatio: false, ...this.options }
    );
  },
};
</script>
