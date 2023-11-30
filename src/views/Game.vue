<template>
  <main class="main">
    <div class="hud">
      <div class="hud-container">
        <div class="score-point">
          <span class="text">MOVES</span>
          <span class="num">{{ board.moves }}</span>
        </div>
        <div class="timepoint">
          <span class="text">TIME</span>
          <span class="num">{{ formattedTime }}</span>
        </div>
      </div>
    </div>
    <div class="game">
      <GameBoard @win="handleWin" :board="board" :playing="playing" />
      <GameOverlay :paused="!playing" @resume="pauseHandler" />
      <div class="menu">
        <div class="button-container">
          <button v-if="started" @click="pauseHandler" class="btn">
            <span v-if="playing">Pause</span>
            <span v-else>Resume</span>
          </button>
          <button @click="startGame" class="btn">Reset</button>
          <button @click="submitScore" class="btn">Submit Score</button>
        </div>
      </div>
    </div>

    <div id="leaderboard-container">
      <table id="leaderboard-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Time</th>
            <th>Moves</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in leaderboardData" :key="index">
            <td>{{ entry.userId }}</td>
            <td>
              {{ isNaN(entry.time) ? entry.time : customTime(entry.time) }}
            </td>
            <td>{{ entry.moves }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script>
import {
  boardFactory,
  randomizeBoard,
} from "/Users/atulkumar/Desktop/15puzzle/src/game-src/board.js";
import GameBoard from "/Users/atulkumar/Desktop/15puzzle/src/components/game-board.vue";
import GameOverlay from "/Users/atulkumar/Desktop/15puzzle/src/components/GameOverlay.vue";
import store from "/Users/atulkumar/Desktop/15puzzle/src/store/store.js";
export default {
  components: { GameBoard, GameOverlay },
  data() {
    return {
      board: [],
      playing: false,
      started: false,
      time: 0,
      interval: null,
      user: Math.ceil(
        Math.random() * 50 + Math.random() * 500 + Math.random() * 5000
      ),
      gameWon: false,
    };
  },
  methods: {
    startGame() {
      console.log("board", this.board);
      this.time = 0;
      clearInterval(this.interval);

      randomizeBoard(65, this.board);

      this.started = true;
      this.playing = true;
      this.interval = setInterval(this.incrementTimer, 1000);
    },
    pauseHandler() {
      if (this.playing) {
        this.playing = false;
        clearInterval(this.interval);
        this.saveGameState();
      } else {
        this.playing = true;
        this.interval = setInterval(this.incrementTimer, 1000);
      }
    },
    incrementTimer() {
      this.time++;
    },
    handleWin() {
      alert("You Win");
      this.started = false;
      this.playing = false;
      this.gameWon = true;
      this.submitScore(); // win wali
      clearInterval(this.interval);
    },
    padTime(time) {
      return time < 10 ? `0${time}` : time;
    },
    customTime(currTime) {
      const minutes = Math.floor(currTime / 60);
      const seconds = currTime % 60;
      return `${this.padTime(minutes)}:${this.padTime(seconds)}`;
    },
    async submitScore() {
      const leaderboardData = {
        userId: `user-${this.user}`,
        time: this.time,
        moves: this.board.moves,
      };

      await this.$store.dispatch("submitScore", leaderboardData);

      this.fetchLeaderboardData();
      this.gameWon = false;
      this.pauseHandler();
    },

    async fetchLeaderboardData() {
      await this.$store.dispatch("fetchLeaderboardData");
    },

    saveGameState() {
      const gameState = {
        board: JSON.parse(JSON.stringify(this.board)),
        playing: this.playing,
        started: this.started,
        time: this.time,
        user: this.user,
        gameWon: this.gameWon,
      };

      localStorage.setItem("gameState", JSON.stringify(gameState));
    },
    loadGameState() {
      const savedState = localStorage.getItem("gameState");
      if (savedState) {
        const gameState = JSON.parse(savedState);

        this.board = JSON.parse(JSON.stringify(gameState.board));
        this.playing = gameState.playing;
        this.started = gameState.started;
        this.time = gameState.time || 0;
        this.user = gameState.user;
        this.gameWon = gameState.gameWon;

        if (this.playing) {
          this.interval = setInterval(this.incrementTimer, 1000);
        }
      }
    },

    beforeUnmount() {
      clearInterval(this.interval);
    },
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.time / 60);
      const seconds = this.time % 60;
      return `${this.padTime(minutes)}:${this.padTime(seconds)}`;
    },
    leaderboardData() {
      return this.$store.state.leaderboardData;
    },
  },
  mounted() {
    this.loadGameState();
    if (!this.started) {
      this.board = boardFactory(4);
    }
  },
};
</script>

<style lang="scss">
@import "/Users/atulkumar/Desktop/15puzzle/src/assets/base.scss";

main {
  min-height: 100vh;
  height: fit-content;
  width: 100vw;
  background-color: rgba(187, 167, 167, 0.11);
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .hud {
    color: #333;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    width: 80%;

    .hud-container {
      display: flex;
      justify-content: start;
    }
  }
  .game {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80%;
  }

  .menu {
    width: 90%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .button-container {
    margin-left: 23%;
  }

  .btn {
    border: 0.1rem solid #333;
    border-radius: 50px;
    background-color: rgba(187, 167, 167, 0.11);
    flex-basis: 50%;
    color: #333;
    font-size: 0.6rem;
    margin: 1rem;
    cursor: pointer;
    width: 150px;
    &:hover {
      background-color: #a41414;
      color: white;
      transition: 0.3s ease;
    }
  }

  a {
    text-decoration: none;
    color: #333;
    font-size: 14px;
    bottom: 0;
  }
  .score-point,
  .timepoint {
    width: 110px;
    height: 60px;
    border-radius: 5px;
    background-color: rgba(158, 170, 255, 0.37);

    margin-right: 20px;
  }

  .text {
    display: block;
    text-align: center;
    font-weight: bold;
    font-size: 21px;
    padding-top: 7px;
  }

  .num {
    display: block;
    text-align: center;
    font-size: 20px;
  }

  #leaderboard-container {
    text-align: center;
    margin: 20px auto;
    width: 40vw;
  }

  #leaderboard-table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  #leaderboard-table th {
    background-color: #f2f2f2;
    color: #333;
    font-weight: bold;
    padding: 10px;
    text-align: center;
  }

  #leaderboard-table th,
  #leaderboard-table td {
    border: 1px solid #ccc;
    padding: 8px;
  }

  #leaderboard-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  #leaderboard-table tbody tr:nth-child(odd) {
    background-color: #ffffff;
  }

  #leaderboard-container h2 {
    margin-top: 0;
  }

  #leaderboard-table tbody td {
    color: #333;
  }

  #leaderboard-table td {
    padding: 8px;
  }

  // media managing
  @media (min-width: 750px) {
    .btn {
      flex-basis: 40%;
      height: 40px;
      font-size: 1.2rem;
    }
  }
}
</style>
