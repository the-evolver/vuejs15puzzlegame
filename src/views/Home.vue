<template>
  <div class="home-container">
    <h1 class="welcome-text">Welcome to the Puzzle 15 Game!</h1>
    <router-link to="/game" class="start-game-link">Start Game 🧩</router-link>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #282c34;
  color: #ed7a49;
}

.welcome-text {
  font-size: 2rem;
  margin-bottom: 20px;
}

.start-game-link {
  font-size: 1.5rem;
  padding: 10px 20px;
  background-color: #61c2fb;
  color: #282c34;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.start-game-link:hover {
  background-color: #5ff245;
}
</style>

<script>
export default {
  //
};
</script>
