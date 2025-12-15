<script>
export default {
  name: "RecipesTable",
  props: {
    items: Array,
  },
};
</script>

<template>
  <table class="table table-striped">
    <tr>
      <th>Recipe ID</th>
      <th>Recipe Name</th>
    </tr>

    <tr v-for="item in items" :key="item.RecipeID">
      <td>{{ item.RecipeID }}</td>
      <td>{{ item.RecipeName }}</td>
    </tr>
  </table>
</template>
