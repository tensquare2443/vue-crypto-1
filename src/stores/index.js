import { defineStore } from "pinia";
import { ref } from "vue";

export const useCoinHistoryModalStore = defineStore("coinHistoryModal", () => {
  let data = ref(null);
  
  return { data };
});

export const useLastUpdatedStore = defineStore("lastUpdated", () => {
  let data = ref(null);
  
  return { data };
});