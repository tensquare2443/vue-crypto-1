<script>
import { watch, nextTick } from "vue";
import CryptoGrid from "@/components/CryptoGrid.vue";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import CoinHistoryModal from "@/components/coin-history-modal/CoinHistoryModal.vue";
import { useCoinHistoryModalStore } from "@/stores";

/**
 * bootstrap css and js imports
 */
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
/**
 * end
 */

export default {
  name: "App",
  components: { CryptoGrid, AppHeader, AppFooter, CoinHistoryModal },
  setup() {
    const coinHistoryModal = useCoinHistoryModalStore();

    watch(coinHistoryModal, async (newValue, oldValue) => {
      await nextTick();

      if (coinHistoryModal.data) {
        const coinHistoryModalElement = new bootstrap.Modal(
          "#coinHistoryModal"
        );
        coinHistoryModalElement.show();
      }
    });

    return { coinHistoryModal };
  },
};
</script>

<template>
  <div class="app__container">
    <CoinHistoryModal v-if="coinHistoryModal.data" />
    <AppHeader />
    <div class="app__content-container">
      <CryptoGrid />
      <AppFooter />
    </div>
  </div>
</template>
