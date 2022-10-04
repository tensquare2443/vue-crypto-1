<script>
import { defineComponent, h } from "vue";
import { useCoinHistoryModalStore } from "@/stores";
import { currencyFormatter } from "@/global";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  // Plugin,
} from "chart.js";
import { DateTime } from "luxon";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
);

export default defineComponent({
  name: "LineChart",
  components: {
    Line,
  },
  props: ["coinData"],
  setup(props) {
    const coin = useCoinHistoryModalStore().data;
    console.log("props", props.coinData);
    const chartData = {
      labels: props.coinData.prices.map((price) => {
        const dateAndTime = DateTime.fromMillis(price[0]).toLocaleString(
          DateTime.DATETIME_SHORT
        );

        let date = dateAndTime.split(",")[0];
        date = date.split("/");
        date[2] = date[2].slice(2, 4);
        date = date.join("/");

        let time = dateAndTime.split(", ")[1];
        const hr = time.split(":")[0];
        const meridiem = time.split(" ")[1];
        time = `${hr}${meridiem}`;

        return `${date}, ${time}`;
      }),
      datasets: [
        {
          label: coin.symbol.toUpperCase(),
          backgroundColor: "#3b8eed",
          borderColor: "#3b8eed",
          radius: 0,
          hitRadius: 10,
          data: props.coinData.prices.map((price) => price[1]),
        },
      ],
    };

    const formatAndRoundCurrency = (value) => {
      let formatted = currencyFormatter.format(value);

      if (formatted.includes(".00")) {
        formatted = formatted.split(".")[0];
      }

      return formatted;
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              let value = +context.formattedValue.replaceAll(",", "");

              return formatAndRoundCurrency(value);
            },
          },
          // backgroundColor: "red"
        },
      },
      scales: {
        x: {
          ticks: {
            color: "white"
          },
          grid: {
            color: "#333"
          }
        },
        y: {
          ticks: {
            callback: (value) => formatAndRoundCurrency(value),
            color: "white"
          },
          grid: {
            color: "#333"
          }
        },
      },
    };

    return () =>
      h(Line, {
        chartData,
        chartOptions,
        chartId: "line-chart",
        width: 400,
        height: 500,
        cssClasses: "",
        // styles: () => {},
        // plugins: () => [],
        // chartId: props.chartId,
        // width: props.width,
        // height: props.height,
        // cssClasses: props.cssClasses,
        // styles: props.styles,
        // plugins: props.plugins,
      });
  },
});
</script>
