<template>
    <div @click="$emit('test-event', content)">{{ content }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class BlockA extends Vue {
    @Prop({ required: true, type: String })
    content!: string;

    protected created() {
        console.warn(this.content);
    }
}
</script>
