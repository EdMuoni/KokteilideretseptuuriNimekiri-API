<script>
export default {
  name: 'RecipesView',
  
  data() {
    return {
      allRecipes: [],
      loading: true,
      error: null
    };
  },

  async created() {
    await this.fetchRecipes();
  },

  methods: {
    async fetchRecipes() {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await fetch("http://localhost:8080/recipes");
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        
        this.allRecipes = await response.json();
        
      } catch (err) {
        console.error('Error fetching recipes:', err);
        this.error = err.message || 'Failed to load recipes';
      } finally {
        this.loading = false;
      }
    },
    
    viewRecipe(recipeID) {
      this.$router.push({
        name: 'recipe', 
        params: { recipeID: recipeID }  
      });
    }
  }
};
</script>

<template>
  <main class="recipes-container">
    <h1>Cocktail Recipes</h1>
    
    <!-- Loading state -->
    <div v-if="loading" class="loading">
      Loading recipes...
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchRecipes" class="btn-retry">Retry</button>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="allRecipes.length === 0" class="empty">
      <p>No recipes found.</p>
    </div>
    
    <!-- Recipes table -->
    <div v-else class="table-container">
      <table class="recipes-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Beverage Type</th>
            <th>User Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="recipe in allRecipes" :key="recipe.RecipeID">

            <td class="recipe-name">{{ recipe.Name }}</td>

            <td class="recipe-description">{{ recipe.Description }}</td>

            <td>{{ recipe.Beverage }}</td>

            <td class="recipe-score">
              <span class="score-badge">{{ recipe.UserScore }} / 5</span>
            </td>

            <td class="actions">
              <button 
                @click="viewRecipe(recipe.RecipeID)" 
                class="btn-view"
                title="View recipe details"
              >
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
.recipes-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;

}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 32px;
  text-align: center;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
}

.error {
  color: #c33;
}

.btn-retry {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 14px;
}

.btn-retry:hover {
  background: #5568d3;
}

.table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.recipes-table {
  width: 100%;
  border-collapse: collapse;
}

.recipes-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.recipes-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.recipes-table tbody tr {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.recipes-table tbody tr:hover {
  background-color: #f8f9fa;
}

.recipes-table tbody tr:last-child {
  border-bottom: none;
}

.recipes-table td {
  padding: 15px;
}

.recipe-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
}

.recipe-description {
  color: #555;
  max-width: 300px;
}

.recipe-score {
  text-align: center;
}

.score-badge {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.actions {
  text-align: center;
}

.btn-view {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-view:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-view:active {
  transform: translateY(0);
}

/* Responsive design */
@media (max-width: 768px) {
  .recipes-table {
    font-size: 14px;
  }
  
  .recipes-table th,
  .recipes-table td {
    padding: 10px;
  }
  
  .recipe-description {
    max-width: 200px;
  }
}
</style>