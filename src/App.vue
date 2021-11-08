<template>
    <div>
        <section>1</section>
        <section>
            <div>2</div>
            <lazy-load :lazy-component="blockA" type="observer"></lazy-load>
        </section>
        <section>
            <div>3</div>
            <lazy-load :lazy-component="blockB" type="idle"></lazy-load>
        </section>
        <section>
            <div>4</div>
            <lazy-load :lazy-component="blockC" type="lazy"></lazy-load>
        </section>
        <section>
            <div>5</div>
            <lazy-load :lazy-component="blockD" type="observer"></lazy-load>
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LazyLoad from "./components/lazy-load/lazy-load.vue";
@Component({
    components: { LazyLoad },
})
export default class App extends Vue {
    protected blockA = () => import("./components/example/block-a.vue");
    protected blockB = () => import("./components/example/block-b.vue");
    protected blockC = () => import("./components/example/block-c.vue");
    protected blockD = () => import("./components/example/block-d.vue");
}
</script>

<style lang="scss">
@import "./common/styles.scss";
body {
    padding: 0;
    margin: 0;
}
section {
    margin: 20px 0;
    color: #fff;
    height: 500px;
    background: $color-blue;
}
</style>
