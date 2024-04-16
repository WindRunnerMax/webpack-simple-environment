<template>
  <div>
    <div>{{ msg }}</div>
    <div>count: {{ count }}</div>
    <div>double-count: {{ doubleCount }}</div>
    <button @click="multCount(3)">count => count*3</button>
  </div>
</template>

<script>
import { onMounted, reactive, computed } from "vue";
export default {
  name: "App",
  components: {},
  setup: () => {
    /* 定义data */
    const data = reactive({
      msg: "Hello World",
      count: 1,
    });

    /* 处理生命周期 */
    onMounted(() => {
      console.log("Mounted");
    });

    /* 处理computed */
    const computeds = {
      doubleCount: computed(() => data.count * 2),
    };

    /* 定义methods */
    const methods = {
      multCount: function (n) {
        data.count = data.count * n;
      },
    };

    /* 返回数据 */
    return Object.assign(data, computeds, methods);
  },
};
</script>

<style>
</style>
