<template>
  <div>
    test <br>
    <button @click="add">count</button>
    <br>
    {{count}}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
const a = {}

console.log(a?.c?.d, 'test');

function add() {
  count.value ++;
}
</script>

<style lang="scss" scoped>
div {
  width: 100%;
  height: 100vh;
  display: grid;
  justify-content: center;
  align-content: center;

  & > button {
    color: #fff
  }
}
</style>