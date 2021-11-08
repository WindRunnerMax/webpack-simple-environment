<template>
    <div>Block D</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class BlockD extends Vue {
    protected created() {
        console.warn("Block D Loaded");
    }
}
</script>
