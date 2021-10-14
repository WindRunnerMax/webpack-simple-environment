<template>
    <div>
        <img src="./static/vue.jpg" alt="" class="vue">
        <img src="./static/vue-large.png" alt="" class="vue-large">
        <div class="example">{{ msg }}</div>
        <button @click="toast">按钮</button>
    </div>
</template>

<script>
export default {
    name: "App",
    data: () => ({
        msg: "Example"
    }),
    methods: {
        toast: function(){
            window?.alert("ExampleMessage");
        }
    }
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