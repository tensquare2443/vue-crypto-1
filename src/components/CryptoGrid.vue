<script>
import { reactive, ref, inject } from "vue";
import CoinNameCellRenderer from "./CoinNameCellRenderer.vue";
import { DateTime } from "luxon";
import { currencyFormatter } from "@/global";
import { useLastUpdatedStore } from "@/stores";

export default {
  name: "CryptoGrid",
  components: { CoinNameCellRenderer },
  setup() {
    const axios = inject("axios");
    const gridApi = ref(null);
    const gridColumnApi = ref(null);

    // const initiallyLoaded = reactive({ value: false });
    const networkError = reactive({ value: false });
    const loading = reactive({ value: false });
    const stillLoading = reactive({ value: false });
    const latestReqTimestamp = reactive({
      value: null,
    });

    const onGridReady = (params) => {
      gridApi.value = params.api;
      gridColumnApi.value = params.columnApi;

      /**
       * defaults sort to 'market_cap' column (descending)
       */
      const columnState = {
        state: [{ colId: "market_cap", sort: "desc" }],
      };

      params.columnApi.applyColumnState(columnState);
      /**
       * end
       */

      const updateData = (data) => {
        const datasource = {
          rowCount: undefined,
          getRows: (params) => {
            const reqParams = {
              vs_currency: "usd",
              page: params.endRow / 100,
            };

            if (params.sortModel.length) {
              /**
               * sort params needed. will set them
               */
              const sortData = params.sortModel[0];
              const sortNamesToSendForColIds = {
                market_cap: "market_cap",
                total_volume: "volume",
                name: "id",
              };

              reqParams.order = `${sortNamesToSendForColIds[sortData.colId]}_${
                sortData.sort
              }`;
              /**
               * end
               */
            }

            networkError.value = false;
            loading.value = true;

            let reqTimestamp = +new Date();
            latestReqTimestamp.value = reqTimestamp;

            setTimeout(() => {
              if (loading.value && reqTimestamp === latestReqTimestamp.value) {
                stillLoading.value = true;
              }
            }, 5000);

            axios
              .get(`/coins/markets?vs_currency=usd`, {
                params: reqParams,
              })
              .then((res) => {
                const coins = res.data;

                if (coins.length) {
                  const lastUpdatedStore = useLastUpdatedStore();
                  const lastUpdated = DateTime.fromISO(
                    coins[0].last_updated
                  ).toLocaleString(DateTime.DATETIME_SHORT);

                  lastUpdatedStore.$patch({ data: lastUpdated });
                }

                params.successCallback(coins);
              })
              .catch(() => {
                networkError.value = true;
              })
              .finally(() => {
                loading.value = false;
                stillLoading.value = false;
                // initiallyLoaded.value = true;
              });
          },
        };

        params.api.setDatasource(datasource);
      };

      updateData([]);
    };

    const getValueInUsd = (params, field, options) => {
      const coin = params.data;

      if (!coin) return null;

      const value = coin[field];

      let formatted = currencyFormatter.format(value);

      if (options) {
        if (options.roundToDollar) {
          if (formatted.includes(".")) {
            formatted = formatted.split(".")[0];
          }
        }
      }

      return formatted;
    };

    const columnDefs = reactive({
      value: [
        {
          field: "name",
          headerName: "Coin",
          pinned: window.innerWidth >= 576 ? "left" : false,
          cellRenderer: "CoinNameCellRenderer",
          cellClass: ["coin-cell__container", "px-0"],
          sortable: true,
        },
        {
          field: "current_price",
          headerName: "Price",
          valueGetter: (params) => getValueInUsd(params, "current_price"),
        },
        {
          field: "price_change_percentage_24h",
          headerName: "24h Price Change",
          valueGetter: (params) => {
            const coin = params.data;

            if (!coin) return null;

            if (!coin.price_change_percentage_24h) {
              return "0.00%";
            }

            return `${coin.price_change_percentage_24h.toFixed(2)}%`;
          },
        },
        {
          field: "total_volume",
          headerName: "24h Volume",
          valueGetter: (params) =>
            getValueInUsd(params, "total_volume", { roundToDollar: true }),
          sortable: true,
        },
        {
          field: "market_cap",
          headerName: "Market Cap",
          valueGetter: (params) =>
            getValueInUsd(params, "market_cap", { roundToDollar: true }),
          sortable: true,
        },
        {
          field: "high_24h",
          headerName: "24h High",
          valueGetter: (params) => getValueInUsd(params, "high_24h"),
        },
        {
          field: "low_24h",
          headerName: "24h Low",
          valueGetter: (params) => getValueInUsd(params, "high_24h"),
        },
        {
          field: "ath",
          headerName: "All-Time High",
          valueGetter: (params) => getValueInUsd(params, "ath"),
        },
      ],
    });
    const defaultColDef = { sortable: false };

    return {
      onGridReady,
      columnDefs,
      defaultColDef,
      rowModelType: "infinite",
      cacheBlockSize: 100,
      rowBuffer: 0,
      rowSelection: "multiple",
      maxConcurrentDatasourceRequests: 1,
      maxBlocksInCache: 10,
      loading,
      stillLoading,
      networkError,
    };
  },
};
</script>

<template>
  <div style="height: 100%; position: relative">
    <AgGridVue
      class="ag-theme-alpine-dark"
      style="height: 100%; width: 100%"
      :columnDefs="columnDefs.value"
      :defaultColDef="defaultColDef"
      :rowModelType="rowModelType"
      :cacheBlockSize="cacheBlockSize"
      :rowBuffer="rowBuffer"
      :rowSelection="rowSelection"
      :cacheOverflowSize="2"
      :maxBlocksInCache="maxBlocksInCache"
      :maxConcurrentDatasourceRequests="maxConcurrentDatasourceRequests"
      animateRows="true"
      @grid-ready="onGridReady"
    />
    <div
      v-if="loading.value || networkError.value"
      class="grid-loading__container text-center pt-5 px-2 position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
    >
      <div v-if="loading.value">
        <div class="spinner-border text-secondary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div
          :class="{ invisible: !stillLoading.value }"
          class="mt-2"
          style="color: white"
        >
          Still fetching CoinGecko data...
          <br />
          CoinGecko throttles requests when there are too many. If it's taking
          too long, maybe try making fewer requests.
        </div>
      </div>
      <div v-else-if="networkError.value">
        There has been a CoinGecko API network error. Too many requests have
        been made. Please try again in a few minutes.
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ag-theme-alpine-dark {
  .ag-root-wrapper {
    border-radius: 5px;
  }
}
.grid-loading__container {
  border-radius: 5px;
  top: 0px;
  background-color: rgb(34, 34, 34, 0.7);
}
</style>
