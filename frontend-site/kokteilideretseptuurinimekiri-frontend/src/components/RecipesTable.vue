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
    <thead>
      <tr>
        <th>Recipe ID</th>
        <th>Name</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="item in items" :key="item.RecipeID">
        <td>{{ item.RecipeID }}</td>
        <td>{{ item.Name }}</td>
        <td>
          <router-link
            :to="{ name: 'recipe', params: { seekID: item.RecipeID } }"
          >
            <button>View Details</button>
          </router-link>
        </td>
      </tr>
    </tbody>
  </table>
</template>
