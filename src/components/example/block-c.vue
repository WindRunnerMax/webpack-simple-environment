<template>
    <div>Block C</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class BlockC extends Vue {
    protected created() {
        console.warn("Block C Loaded");
    }
}
</script>
