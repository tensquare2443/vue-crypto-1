<script>
import { useCoinHistoryModalStore } from "@/stores";
import { onMounted, reactive, ref, watch } from "vue";
import { DateTime } from "luxon";
import axios from "axios";
import CoinHistoryChart from "./CoinHistoryChart.vue";

export default {
  components: { CoinHistoryChart },
  setup() {
    const coinHistoryModal = useCoinHistoryModalStore();

    let start = DateTime.now().minus({ days: 30 }).toISO().split("");
    start.splice(11, 12, "00:00:00.000");
    start = start.join("");

    let end = DateTime.now().toISO().split("");
    end.splice(11, 12, "23:59:59.000");
    end = end.join("");

    const maxDate = ref(end);
    const dateRange = reactive({
      value: { start, end },
    });
    const networkError = reactive({
      value: false,
    });
    const loading = reactive({
      value: false,
    });
    const stillLoading = reactive({
      value: false,
    });
    const coin = coinHistoryModal.data;
    let coinData = reactive({ value: null });

    const getCoinData = () => {
      console.log("getCoinData");
      const coinHistoryModalElement =
        document.getElementById("coinHistoryModal");

      coinHistoryModalElement.addEventListener("hidden.bs.modal", (event) => {
        coinHistoryModal.$patch({ data: null });
      });
      const reqParams = {
        vs_currency: "usd",
        from: DateTime.fromISO(dateRange.value.start).toSeconds(),
        to: DateTime.fromISO(dateRange.value.end).toSeconds(),
      };

      coinData.value = null;
      networkError.value = false;
      loading.value = true;
      setTimeout(() => {
        if (loading.value) {
          stillLoading.value = true;
        }
      }, 5000);

      axios
        .get(`/coins/${coin.id}/market_chart/range`, {
          params: reqParams,
        })
        .then((res) => {
          coinData.value = res.data;
        })
        .catch(() => {
          networkError.value = true;
        })
        .finally(() => {
          loading.value = false;
          stillLoading.value = false;
        });
    };

    onMounted(() => {
      getCoinData();
    });

    watch(dateRange, async () => {
      const range = dateRange.value;

      if (typeof range.start === "object") {
        range.start = DateTime.fromJSDate(range.start).toISO();
        range.end = DateTime.fromJSDate(range.end).toISO();

        getCoinData();
      }
    });

    return {
      coin,
      maxDate,
      dateRange,
      coinData,
      DateTime,
      loading,
      stillLoading,
      networkError,
    };
  },
};
</script>

<template>
  <div class="modal modal-xl fade px-3" id="coinHistoryModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <div class="d-flex align-items-center">
            <div style="width: 26px; margin-right: 8px">
              <img :src="coin.image" alt="" class="w-100" />
            </div>
            <div style="margin-right: 4px">
              <h5 class="modal-title" id="coinHistoryModalLabel">
                {{ coin.name }}
              </h5>
            </div>
            <div>({{ coin.symbol.toUpperCase() }})</div>
          </div>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-end mb-3">
            <v-date-picker
              v-model="dateRange.value"
              is-range
              is-dark
              :min-date="DateTime.fromISO('2000-01-01').toISO()"
              :max-date="maxDate"
            >
              <template v-slot="{ inputValue, showPopover }">
                <div class="d-flex justify-content-center align-items-center">
                  <div class="position-relative">
                    <input
                      :value="inputValue.start"
                      class="px-2 py-1 w-32 datepicker__input start-input"
                    />
                    <input
                      :value="inputValue.end"
                      class="px-2 py-1 w-32 datepicker__input"
                    />
                    <div class="datepicker__input-cover" @click="showPopover" />
                  </div>
                  <div>
                    <button
                      @click="showPopover"
                      class="btn btn-primary datepicker__input end-input"
                      style="border-width: 0"
                    >
                      <font-awesome-icon icon="calendar-day" />
                    </button>
                  </div>
                </div>
              </template>
            </v-date-picker>
          </div>
          <div style="height: 500px">
            <CoinHistoryChart
              style="height: 100%"
              v-if="coinData.value"
              :coinData="coinData.value"
            />
            <div
              v-if="loading.value || networkError.value"
              class="text-center pt-5"
            >
              <template v-if="loading.value">
                <div class="spinner-border text-secondary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div :class="{ invisible: !stillLoading.value }" class="mt-2">
                  Still fetching CoinGecko data...
                </div>
              </template>
              <div v-else-if="networkError.value">
                There has been a CoinGecko API network error. Too many requests
                have been made. Please try again in a few minutes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.modal-content {
  background-color: var(--vt-c-black-soft) !important;

  .modal-title {
    color: var(--vt-c-green);
  }

  .modal-body {
    .datepicker__input-cover {
      position: absolute;
      top: 0;
      background-color: transparent;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }

  .modal-header {
    border-color: var(--app-border-color);
  }
}

.datepicker__input {
  border-width: 2px;
  border-color: transparent;
}
.datepicker__input.start-input {
  border-right: 1px solid grey;
  border-radius: 5px 0 0 5px !important;
}
.datepicker__input.end-input {
  border-radius: 0 5px 5px 0 !important;
}

.vc-container {
  background-color: var(--vt-c-black-soft) !important;
  border-color: #333 !important;
  box-shadow: 0px 5px 5px #151515;
}
.vc-nav-popover-container {
  background-color: var(--vt-c-black-soft) !important;
  color: white !important;
}
.vc-nav-title {
  color: white !important;

  &:hover {
    background-color: #d2d2d2 !important;
  }
}
</style>
