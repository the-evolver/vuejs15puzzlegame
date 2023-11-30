<script>
import {
  moveCell,
  checkBoardState,
  moveUp,
  moveRight,
  moveLeft,
  moveDown,
} from "../game-src/board";
export default {
  props: ["board", "playing"],

  methods: {
    moveCell,
    moveUp,
    moveRight,
    moveLeft,
    moveDown,

    cellClick(index, board) {
      if (this.playing) {
        this.moveCell(index, board);
        if (checkBoardState(board)) this.$emit("win");
      }
    },
  },
};
</script>

<template>
  <div class="cell-container">
    <div
      v-for="(cellNumber, index) in board.cells"
      :key="cellNumber"
      class="cell"
      @click="cellClick(index, board)"
      @keypress.down="moveDown"
      :class="{ empty: cellNumber === 0, correct: cellNumber === index + 1 }"
    >
      <div v-if="cellNumber > 0" class="number">{{ cellNumber }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/base.scss";

.cell-container {
  width: 500px;
  height: 500px;
  padding: 14px 0px 10px 20px;
  background-color: #317773;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
}

.cell {
  width: 103px;
  height: 103px;
  float: left;
  margin: 6px;
  background-color: #e2d1f9;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  font-weight: bold;
  font-family: "Times New Roman", Times, serif;
  &.empty {
    background-color: rgba(16, 115, 177, 0.11);
  }

  &.correct {
    background-color: #14a44d;
    color: white;
  }
}

@media screen and (max-width: 630px) {
  .cell-container {
    width: 260px;
    height: 260px;
  }

  .cell {
    width: 53px;
    height: 53px;
    font-size: 20px;
  }
}
</style>
