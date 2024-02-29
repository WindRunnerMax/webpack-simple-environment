<template>
    <div>
        <component
            :is="renderComponent"
            v-bind="componentParams"
            v-on="componentEvents"
        ></component>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class LazyLoad extends Vue {
    @Prop({ type: Function, required: true })
    lazyComponent!: () => Vue;
    @Prop({ type: String, required: true })
    type!: "observer" | "idle" | "lazy";
    @Prop({ type: Object, default: () => ({}) })
    componentParams!: Record<string, unknown>;
    @Prop({ type: Object, default: () => ({}) })
    componentEvents!: Record<string, unknown>;

    protected observer: IntersectionObserver | null = null;
    protected renderComponent: (() => Vue) | null = null;

    protected mounted() {
        this.init();
    }

    private init() {
        if (this.type === "observer") {
            // 存在`window.IntersectionObserver`
            // https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API
            if (window.IntersectionObserver) {
                this.observer = new IntersectionObserver(entries => {
                    entries.forEach(item => {
                        // `intersectionRatio`为目标元素的可见比例，大于`0`代表可见
                        // 在这里也有实现策略问题 例如加载后不解除`observe`而在不可见时销毁等
                        // https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserverEntry
                        if (item.intersectionRatio > 0 || item.isIntersecting) {
                            this.loadComponent();
                            // 加载完成后将其解除`observe`
                            this.observer?.unobserve(item.target);
                        }
                    });
                });
                this.observer.observe(this.$el.parentElement || this.$el);
            } else {
                // 直接加载
                this.loadComponent();
            }
        } else if (this.type === "idle") {
            // 存在`requestIdleCallback`
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (window.requestIdleCallback) {
                requestIdleCallback(this.loadComponent, { timeout: 3 });
            } else {
                // 直接加载
                this.loadComponent();
            }
        } else if (this.type === "lazy") {
            // 存在`Promise`
            if (window.Promise) {
                Promise.resolve().then(this.loadComponent);
            } else {
                // 降级使用`setTimeout`
                setTimeout(this.loadComponent);
            }
        } else {
            throw new Error(`type: "observer" | "idle" | "lazy"`);
        }
    }

    private loadComponent() {
        this.renderComponent = this.lazyComponent;
        this.$emit("loaded");
    }

    protected destroyed() {
        this.observer && this.observer.disconnect();
    }
}
</script>
