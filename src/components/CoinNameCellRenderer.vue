<script>
import { useCoinHistoryModalStore } from "@/stores";

export default {
  setup(props) {
    const coin = props.params.data;

    if (!coin) return;

    const name = coin.name;
    const symbol = coin.symbol.toUpperCase();
    const logo = coin.image;
    const coinHistoryModal = useCoinHistoryModalStore();
    const openCoinHistoryModal = function () {
      if (window.innerWidth < 576) return;

      coinHistoryModal.$patch({ data: coin });
    };

    return { coin, name, symbol, logo, coinHistoryModal, openCoinHistoryModal };
  },
};
</script>

<template>
  <div v-if="coin" class="coin-cell" @click="openCoinHistoryModal">
    <div class="coin-cell__logo-container">
      <img :src="logo" alt="logo" class="coin-cell__logo" />
    </div>
    <div class="coin__name">{{ name }}</div>
    <div class="small">({{ symbol }})</div>
  </div>
</template>

<style lang="scss">
.coin-cell__container {
  @media (min-width: 576px) {
    cursor: pointer;
    &:hover {
      color: var(--vt-c-green);

      .coin__name {
        text-decoration: underline;
      }
    }
  }
}

.coin-cell {
  display: flex;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;

  .coin-cell__logo-container {
    width: 20px;
    margin-right: 8px;

    .coin-cell__logo {
      width: 100%;
    }
  }

  .coin__name {
    padding-right: 4px;
  }
}
</style>
