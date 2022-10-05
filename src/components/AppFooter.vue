<script>
import { useLastUpdatedStore } from "@/stores";

export default {
  setup() {
    const lastUpdated = useLastUpdatedStore();

    return { lastUpdated };
  },
};
</script>

<template>
  <div class="app-footer d-flex align-items-center justify-content-center justify-content-sm-between">
    <div class="d-none d-sm-block" :class="{ invisible: !lastUpdated.data }">
      Last Updated: {{ lastUpdated.data || "" }}
    </div>
    <div class="d-flex align-items-center">
      <div>
        <a href="https://www.coingecko.com/en/api/documentation" target="_blank"
          >CoinGecko</a
        >
      </div>
      <img
        class="app-footer__logo"
        src="https://static.coingecko.com/s/thumbnail-d5a7c1de76b4bc1332e48227dc1d1582c2c92721b5552aae76664eecb68345c9.png"
        alt=""
      />
      <div>&nbsp;|&nbsp;</div>
      <div>
        <a href="https://github.com/tensquare2443/vue-crypto-1" target="_blank"
          >View Repo</a
        >
      </div>
      <img
        class="app-footer__logo"
        src="/github.png"
        alt=""
      />
    </div>
  </div>
</template>

<style>
.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
.app-footer__logo {
  width: 24px;
  margin-left: 6px;
}
</style>
