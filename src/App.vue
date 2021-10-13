<template>
    <div>
        <img src="./static/vue.jpg" alt="" class="vue">
        <img src="./static/vue-large.png" alt="" class="vue-large">
        <div class="example">{{ msg }}</div>
    </div>
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
    .vue{
        width: 100px;
    }
    .vue-large{
        width: 300px;
    }
    .example{
        font-size: 30px;
    }
</style>