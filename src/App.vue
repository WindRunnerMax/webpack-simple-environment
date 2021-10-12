<template>
    <div class="example">{{ msg }}</div>
</template>

<script>
export default {
    name: "App",
    data: () => ({
        msg: "Example"
    })
}
</script>

<style scoped>
    .example{
        font-size: 30px;
    }
</style>