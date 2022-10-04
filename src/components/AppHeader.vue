<script>
import { useCoinHistoryModalStore } from "@/stores";

export default {
  setup() {
    const coinHistoryModal = useCoinHistoryModalStore();

    return { coinHistoryModal };
  },
};
</script>

<template>
  <nav>
    <h1 class="green">Vue 3 Cryptocurrency Prices</h1>
  </nav>
</template>
