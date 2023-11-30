import { createStore } from "vuex";

export default createStore({
  state: {
    leaderboardData: [],
  },
  mutations: {
    setLeaderboardData(state, data) {
      state.leaderboardData = data;
    },
  },
  actions: {
    async fetchLeaderboardData({ commit }) {
      try {
        const response = await fetch("http://localhost:4000/leaderboard");
        const data = await response.json();
        commit("setLeaderboardData", data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    },
    async submitScore({ state, commit }, leaderboardData) {
      try {
        const response = await fetch("http://localhost:4000/leaderboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(leaderboardData),
        });

        const result = await response.json();
        console.log(result);

        commit("setLeaderboardData", [
          ...state.leaderboardData,
          leaderboardData,
        ]);
      } catch (error) {
        console.error("Error submitting score:", error);
      }
    },
  },
});
