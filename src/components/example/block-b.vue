<template>
    <div>Block B</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class BlockB extends Vue {
    protected created() {
        console.warn("Block B Loaded");
    }
}
</script>
