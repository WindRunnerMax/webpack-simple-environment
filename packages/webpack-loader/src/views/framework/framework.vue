<template>
  <div>
    <section>
      <img src="../../static/vue.jpg" alt="" class="vue" />
      <img src="../../static/vue-large.png" alt="" class="vue-large" />
      <div class="example">{{ msg }}</div>
      <button @click="toast">Alert</button>
    </section>
    <section>
      <router-link to="/tab-a">TabA</router-link>
      <router-link to="/tab-b">TabB</router-link>
      <router-view />
    </section>
    <section>
      <button @click="setVuexValue">Set Vuex Value</button>
      <div>{{ text }}</div>
    </section>
  </div>
</template>
