<template>
  <div v-if="paused" class="overlay">
    <div class="overlay-content">
      <h2>Game Paused</h2>
      <button @click="resumeGame">Resume</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["paused"],
  methods: {
    resumeGame() {
      this.$emit("resume");
    },
  },
};
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay-content {
  background: white;
  padding: 20px;
  text-align: center;
  border-radius: 5px;
}
</style>
