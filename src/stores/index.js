import { defineStore } from "pinia";
import { ref } from "vue";

// export const useCounterStore = defineStore({
//   id: "counter",
//   state: () => ({
//     counter: 0,
//   }),
//   getters: {
//     doubleCount: (state) => state.counter * 2,
//   },
//   actions: {
//     increment() {
//       this.counter++;
//     },
//   },
// });

export const useCoinHistoryModalStore = defineStore("coinHistoryModal", () => {
  let data = ref(null);
  
  return { data };
});

export const useLastUpdatedStore = defineStore("lastUpdated", () => {
  let data = ref(null);
  
  return { data };
});