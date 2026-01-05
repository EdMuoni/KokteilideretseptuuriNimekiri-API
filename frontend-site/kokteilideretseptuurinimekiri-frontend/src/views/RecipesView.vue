<script>
import RecipesTable from "../components/RecipesTable.vue";
export default {
  components: {
    RecipesTable, // Register child component
  },
  data() {
    return {
      allRecipes: [], // Initialize empty array
    };
  },

  // created() runs automatically when the component is created
  async created() {
    this.allRecipes = await (
      await fetch("http://localhost:8080/recipes")
    ).json();
  },
};
</script>

<template>
  <main>
    <RecipesTable :items="allRecipes" />
  </main>
</template>