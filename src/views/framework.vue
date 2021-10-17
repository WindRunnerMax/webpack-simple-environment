<template>
    <div>
        <section>
            <img src="../static/vue.jpg" alt="" class="vue" />
            <img src="../static/vue-large.png" alt="" class="vue-large" />
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

<script>
import { mapState } from "vuex";
export default {
    name: "FrameWork",
    data: () => ({
        msg: "Example",
    }),
    computed: mapState({
        text: state => state.text,
    }),
    methods: {
        toast: function () {
            window?.alert("ExampleMessage");
        },
        setVuexValue: function () {
            this.$store.commit("setText", "New Value");
        },
    },
};
</script>

<style scoped lang="scss">
@import "../common/styles.scss";
.vue {
    width: 100px;
}
.vue-large {
    width: 300px;
}
.example {
    color: $color-blue;
    font-size: 30px;
}
section {
    margin: 10px;
}
</style>
