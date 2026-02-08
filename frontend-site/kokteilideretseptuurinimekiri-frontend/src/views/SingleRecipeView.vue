<script>
export default {
  name: 'SingleRecipeView',
  
  data() {
    return {
      thisRecipe: {
        RecipeID: "",
        Name: "",
        Description: "",
        Beverage: "",
        UserScore: 0,
      },
      loading: true,
      error: null
    };
  },

  beforeMount() {
    this.getDetails();
  },

  methods: {
    async getDetails() {
      try {
        this.loading = true;
        this.error = null;
        
        const recipeID = this.$route.params.recipeID;
        
        if (!recipeID) {
          this.error = "No recipe ID provided";
          return;
        }
        
        // Fetch recipe details from backend
        const response = await fetch(`http://localhost:8080/recipes/${recipeID}`);
        
        if (!response.ok) {
          throw new Error(`Recipe not found (${response.status})`);
        }
        
        this.thisRecipe = await response.json();
        
      } catch (err) {
        console.error('Error fetching recipe:', err);
        this.error = err.message || 'Failed to load recipe';
      } finally {
        this.loading = false;
      }
    },
    
    goBack() {
      this.$router.push('/recipes');
    }
  },
};
</script>

<template>
  <div class="recipe-container">
    <!-- Loading state -->
    <div v-if="loading" class="loading">
      Loading recipe details...
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="goBack" class="btn-back">Back to Recipes</button>
    </div>
    
    <!-- Recipe details -->
    <div v-else class="recipe-details">
      <button @click="goBack" class="btn-back">← Back to Recipes</button>
      
      <h1>{{ thisRecipe.Name }}</h1>
      
      <table class="table table-striped">
        <tbody>
          <tr>
            <td class="label">Recipe ID</td>
            <td>{{ thisRecipe.RecipeID }}</td>
          </tr>

          <tr>
            <td class="label">Name</td>
            <td>{{ thisRecipe.Name }}</td>
          </tr>

          <tr>
            <td class="label">Description</td>
            <td>{{ thisRecipe.Description }}</td>
          </tr>

          <tr>
            <td class="label">Beverage Type</td>
            <td>{{ thisRecipe.Beverage }}</td>
          </tr>

          <tr>
            <td class="label">User Score</td>
            <td>{{ thisRecipe.UserScore }} / 5</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.recipe-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #c33;
}

.btn-back {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 14px;
}

.btn-back:hover {
  background: #5568d3;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 32px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
}

.table tr {
  border-bottom: 1px solid #eee;
}

.table tr:last-child {
  border-bottom: none;
}

.table td {
  padding: 15px 20px;
}

.table td.label {
  font-weight: 600;
  color: #555;
  width: 200px;
  background: #f8f9fa;
}

.table-striped tbody tr:nth-child(even) {
  background: #fafafa;
}
</style>