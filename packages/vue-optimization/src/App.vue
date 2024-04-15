<template>
    <div>
        <section>1</section>
        <section>
            <div>2</div>
            <lazy-load
                :lazy-component="Example"
                type="observer"
                :component-params="{ content: 'Example A' }"
                :component-events="{
                    'test-event': testEvent,
                }"
            ></lazy-load>
        </section>
        <section>
            <div>3</div>
            <lazy-load
                :lazy-component="Example"
                type="idle"
                :component-params="{ content: 'Example B' }"
                :component-events="{
                    'test-event': testEvent,
                }"
            ></lazy-load>
        </section>
        <section>
            <div>4</div>
            <lazy-load
                :lazy-component="Example"
                type="lazy"
                :component-params="{ content: 'Example C' }"
                :component-events="{
                    'test-event': testEvent,
                }"
            ></lazy-load>
        </section>
        <section>
            <div>5</div>
            <lazy-load
                :lazy-component="Example"
                type="observer"
                :component-params="{ content: 'Example D' }"
                :component-events="{
                    'test-event': testEvent,
                }"
            ></lazy-load>
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
    protected Example = () => import("./components/example/example.vue");

    protected testEvent(content: string) {
        console.log(content);
    }
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
