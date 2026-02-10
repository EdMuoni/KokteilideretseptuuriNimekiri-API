<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'AdminView',
  
  setup() {
    const router = useRouter();
    
    // State
    const currentUser = ref(null);
    const recipes = ref([]);
    const loading = ref(true);
    const error = ref(null);
    
    // Form state
    const showAddForm = ref(false);
    const editingRecipe = ref(null);
    const formData = ref({
      Name: '',
      Description: '',
      Beverage: '',
      UserScore: 5
    });
    
    // Computed
    const isAdmin = computed(() => currentUser.value?.IsAdmin === true);
    
    // Check if user is admin
    const checkAdminAccess = async () => {
      try {
        const response = await fetch('http://localhost:8080/sessions/me', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          router.push('/login');
          return false;
        }
        
        currentUser.value = await response.json();
        
        if (!currentUser.value.IsAdmin) {
          alert('Access denied. Admin privileges required.');
          router.push('/recipes');
          return false;
        }
        
        return true;
      } catch (err) {
        console.error('Admin check failed:', err);
        router.push('/login');
        return false;
      }
    };
    
    // Fetch all recipes
    const fetchRecipes = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        const response = await fetch('http://localhost:8080/recipes');
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        
        recipes.value = await response.json();
        
      } catch (err) {
        console.error('Error fetching recipes:', err);
        error.value = 'Failed to load recipes';
      } finally {
        loading.value = false;
      }
    };
    
    // Create new recipe
    const createRecipe = async () => {
      try {
        if (!validateForm()) return;
        
        const response = await fetch('http://localhost:8080/recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData.value)
        });
        
        if (!response.ok) {
          throw new Error('Failed to create recipe');
        }
        
        alert('Recipe created successfully!');
        resetForm();
        await fetchRecipes();
        
      } catch (err) {
        console.error('Error creating recipe:', err);
        alert('Failed to create recipe: ' + err.message);
      }
    };
    
    // Start editing a recipe
    const startEdit = (recipe) => {
      editingRecipe.value = recipe.RecipeID;
      formData.value = {
        Name: recipe.Name,
        Description: recipe.Description,
        Beverage: recipe.Beverage,
        UserScore: recipe.UserScore
      };
      showAddForm.value = true;
    };
    
    // Update existing recipe
    const updateRecipe = async () => {
      try {
        if (!validateForm()) return;
        
        const response = await fetch(`http://localhost:8080/recipes/${editingRecipe.value}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData.value)
        });
        
        if (!response.ok) {
          throw new Error('Failed to update recipe');
        }
        
        alert('Recipe updated successfully!');
        resetForm();
        await fetchRecipes();
        
      } catch (err) {
        console.error('Error updating recipe:', err);
        alert('Failed to update recipe: ' + err.message);
      }
    };
    
    // Delete recipe
    const deleteRecipe = async (recipeID, recipeName) => {
      if (!confirm(`Are you sure you want to delete "${recipeName}"? This action cannot be undone.`)) {
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:8080/recipes/${recipeID}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete recipe');
        }
        
        alert('Recipe deleted successfully!');
        await fetchRecipes();
        
      } catch (err) {
        console.error('Error deleting recipe:', err);
        alert('Failed to delete recipe: ' + err.message);
      }
    };
    
    // Form validation
    const validateForm = () => {
      if (!formData.value.Name.trim()) {
        alert('Please enter a recipe name');
        return false;
      }
      if (!formData.value.Description.trim()) {
        alert('Please enter a description');
        return false;
      }
      if (!formData.value.Beverage.trim()) {
        alert('Please enter a beverage type');
        return false;
      }
      if (formData.value.UserScore < 0 || formData.value.UserScore > 5) {
        alert('Score must be between 0 and 5');
        return false;
      }
      return true;
    };
    
    // Reset form
    const resetForm = () => {
      showAddForm.value = false;
      editingRecipe.value = null;
      formData.value = {
        Name: '',
        Description: '',
        Beverage: '',
        UserScore: 5
      };
    };
    
    // Handle form submission
    const handleSubmit = () => {
      if (editingRecipe.value) {
        updateRecipe();
      } else {
        createRecipe();
      }
    };
    
    // Initialize
    onMounted(async () => {
      const hasAccess = await checkAdminAccess();
      if (hasAccess) {
        await fetchRecipes();
      }
    });
    
    return {
      currentUser,
      recipes,
      loading,
      error,
      showAddForm,
      editingRecipe,
      formData,
      isAdmin,
      fetchRecipes,
      startEdit,
      deleteRecipe,
      handleSubmit,
      resetForm
    };
  }
};
</script>

<template>
  <div class="admin-panel">
    <div class="admin-header">
      <h1>Admin Panel - Recipe Management</h1>
      <button 
        v-if="!showAddForm" 
        @click="showAddForm = true" 
        class="btn-add"
      >
        + Add New Recipe
      </button>
    </div>
    
    <!-- Add/Edit Recipe Form -->
    <div v-if="showAddForm" class="form-container">
      <div class="form-header">
        <h2>{{ editingRecipe ? 'Edit Recipe' : 'Add New Recipe' }}</h2>
        <button @click="resetForm" class="btn-close">×</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="recipe-form">
        <div class="form-group">
          <label for="name">Recipe Name *</label>
          <input 
            v-model="formData.Name" 
            type="text" 
            id="name"
            placeholder="e.g., Mojito"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="description">Description *</label>
          <textarea 
            v-model="formData.Description" 
            id="description"
            rows="4"
            placeholder="Describe the recipe..."
            required
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="beverage">Beverage Type *</label>
            <input 
              v-model="formData.Beverage" 
              type="text" 
              id="beverage"
              placeholder="e.g., Rum-based"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="score">Base Score (0-10) *</label>
            <input 
              v-model.number="formData.UserScore" 
              type="number" 
              id="score"
              min="0"
              max="10"
              step="0.1"
              required
            />
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn-submit">
            {{ editingRecipe ? 'Update Recipe' : 'Create Recipe' }}
          </button>
          <button type="button" @click="resetForm" class="btn-cancel">
            Cancel
          </button>
        </div>
      </form>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      Loading recipes...
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchRecipes" class="btn-retry">Retry</button>
    </div>
    
    <!-- Recipes Table -->
    <div v-else class="recipes-section">
      <h2>All Recipes ({{ recipes.length }})</h2>
      
      <div v-if="recipes.length === 0" class="empty-state">
        <p>No recipes found. Add your first recipe!</p>
      </div>
      
      <div v-else class="table-container">
        <table class="recipes-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Beverage Type</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="recipe in recipes" :key="recipe.RecipeID">
              <td class="recipe-name">{{ recipe.Name }}</td>
              <td class="recipe-description">{{ recipe.Description }}</td>
              <td>{{ recipe.Beverage }}</td>
              <td class="recipe-score">
                <span class="score-badge">{{ recipe.UserScore }} / 10</span>
              </td>
              <td class="actions">
                <button 
                  @click="startEdit(recipe)" 
                  class="btn-edit"
                  title="Edit recipe"
                >
                  Edit
                </button>
                <button 
                  @click="deleteRecipe(recipe.RecipeID, recipe.Name)" 
                  class="btn-delete"
                  title="Delete recipe"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-panel {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 3px solid #667eea;
}

.admin-header h1 {
  color: #2c3e50;
  font-size: 32px;
  margin: 0;
}

.btn-add {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-add:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

/* Form Styles */
.form-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 40px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #eee;
}

.form-header h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 24px;
}

.btn-close {
  background: none;
  border: none;
  font-size: 36px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  line-height: 1;
  transition: color 0.3s;
}

.btn-close:hover {
  color: #333;
}

.recipe-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.btn-submit {
  flex: 1;
  background: #667eea;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-submit:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-cancel {
  flex: 1;
  background: white;
  color: #666;
  border: 2px solid #ddd;
  padding: 14px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #f5f5f5;
  border-color: #999;
}

/* Recipes Section */
.recipes-section {
  margin-top: 40px;
}

.recipes-section h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 24px;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #777;
}

.error {
  color: #dc3545;
}

.btn-retry {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

/* Table Styles */
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
  white-space: nowrap;
}

.btn-edit,
.btn-delete {
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  margin: 0 4px;
}

.btn-edit {
  background: #ffc107;
  color: #333;
}

.btn-edit:hover {
  background: #e0a800;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
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
  
  .actions {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .btn-edit,
  .btn-delete {
    width: 100%;
    margin: 0;
  }
}
</style>