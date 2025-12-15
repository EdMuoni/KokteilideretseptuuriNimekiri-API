<script>
    import RecipesTable from '../components/RecipesTable.vue';
    export default {
        components: {
            RecipesTable
        }
        data() {
            allRecipes: [];
        },
    async created() {
        this.allRecipes = await (await fetch('http://localhost:8080/recipes')).json()
    }
</script>
<template>
    <main>
        <RecipesTable :recipes="allRecipes" />
    </main>
</template>