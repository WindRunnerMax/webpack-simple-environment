<template>
    <div>Block A</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class BlockA extends Vue {
    protected created() {
        console.warn("Block A Loaded");
    }
}
</script>
