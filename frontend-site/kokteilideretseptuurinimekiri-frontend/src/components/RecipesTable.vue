<script>
import router from "../router";

export default {
  name: "RecipesTable",
  props: {
    items: Array,
  },
  methods: {
    async deleteRecipe(RecipeID) {
      await await fetch(`http://localhost:8080/recipe/${this.RecipeID}`, {
        method: "DELETE",
      });
    },
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
        <td>
          <router-link>
            <button @click="deleteRecipe(item.RecipeID)">Delete</button>
          </router-link>
        </td>
      </tr>
    </tbody>
  </table>
</template>
