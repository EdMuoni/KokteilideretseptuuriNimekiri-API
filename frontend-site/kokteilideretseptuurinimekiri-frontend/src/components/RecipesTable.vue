<script>
import router from "../router";

export default {
  name: "RecipesTable",
  props: {
    items: Array,
  },
  methods: {
    async deleteRecipe(RecipeID) {
      try {
        const response = await fetch(`http://localhost:8080/recipes/${RecipeID}`, {
          method: "DELETE",
        });

        if (response.ok || response.status === 204) {
          const index = this.items.findIndex(
            (item) => item.RecipeID === RecipeID
          );

          if (index > -1) {
            this.items.splice(index, 1);
          }
          
          console.log(`Recipe ${RecipeID} deleted successfully!`);
        } else {
          console.error("Failed to delete recipe:", response.status);
        }
      } catch (error) {
        console.error("Error deleting recipe:", error);
        alert("An error occurred while deleting the recipe.");
      }
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
        <th>Actions</th>
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
            <button class="btn btn-primary">View Details</button>
          </router-link>
        </td>
        <td>
          <button 
            @click="deleteRecipe(item.RecipeID)" 
            class="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>