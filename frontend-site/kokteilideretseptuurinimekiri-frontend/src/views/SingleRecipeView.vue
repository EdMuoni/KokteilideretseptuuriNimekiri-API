<script>
export default {
  name: 'SingleRecipeView',
  
  data() {
    return {
      // Recipe data
      thisRecipe: {
        RecipeID: "",
        Name: "",
        Description: "",
        Beverage: "",
        UserScore: 0,
      },
      
      // Comments and ratings for this recipe
      userRatings: [],
      
      // Currently logged-in user (null if not logged in)
      currentUser: null,
      
      // New comment form data
      newComment: {
        UserScore: 5,
        UserComment: ""
      },
      
      // Loading states
      loading: true,
      loadingRatings: false,
      
      // Error handling
      error: null,
      submittingComment: false
    };
  },

  async beforeMount() {
    console.log('[SingleRecipeView] Component mounting...');
    await this.getCurrentUser();
    await this.getDetails();
    await this.getUserRatings();
  },

  methods: {
    //Fetch the current logged-in user from session
    async getCurrentUser() {
      try {
        console.log('[Auth] Checking user session...');
        
        const response = await fetch('http://localhost:8080/sessions/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('[Auth] Session endpoint response status:', response.status);
        
        if (response.ok) {
          this.currentUser = await response.json();
          console.log('[Auth] User logged in:', {
            UserID: this.currentUser.UserID,
            UserName: this.currentUser.UserName || this.currentUser.DisplayName,
            IsAdmin: this.currentUser.IsAdmin
          });
        } else {
          console.warn('[Auth] Not logged in - status', response.status);
          this.currentUser = null;
        }
      } catch (err) {
        console.error('[Auth] Session check failed:', err.message);
        this.currentUser = null;
      }
    },

    // Fetch recipe details from backend
    async getDetails() {
      try {
        this.loading = true;
        this.error = null;
        
        const recipeID = this.$route.params.recipeID;
        console.log('[Recipe] Fetching recipe ID:', recipeID);
        
        if (!recipeID) {
          this.error = "No recipe ID provided";
          return;
        }
        
        const response = await fetch(`http://localhost:8080/recipes/${recipeID}`);
        
        if (!response.ok) {
          throw new Error(`Recipe not found (${response.status})`);
        }
        
        this.thisRecipe = await response.json();
        console.log('[Recipe] Loaded successfully:', this.thisRecipe.Name);
        
      } catch (err) {
        console.error('[Recipe] Error fetching recipe:', err);
        this.error = err.message || 'Failed to load recipe';
      } finally {
        this.loading = false;
      }
    },

    // Fetch all user ratings for this recipe
    async getUserRatings() {
      try {
        this.loadingRatings = true;
        
        const recipeID = this.$route.params.recipeID;
        console.log('[Ratings] Fetching ratings for recipe:', recipeID);
        
        // Fetch all ratings from backend
        const response = await fetch('http://localhost:8080/UserRatings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch ratings');
        }
        
        const allRatings = await response.json();
        console.log('[Ratings] Total ratings in database:', allRatings.length);
        
        // Filter ratings for this specific recipe
        // Convert both IDs to strings and trim for comparison
        this.userRatings = allRatings.filter(rating => {
          const ratingRecipeID = String(rating.RecipeID).trim().toLowerCase();
          const currentRecipeID = String(recipeID).trim().toLowerCase();
          return ratingRecipeID === currentRecipeID;
        });
        
        console.log('[Ratings] Found', this.userRatings.length, 'ratings for this recipe');
        
        // Fetch username for each rating
        for (let rating of this.userRatings) {
          try {
            const userResponse = await fetch(`http://localhost:8080/users/${rating.UserID}`);
            if (userResponse.ok) {
              const user = await userResponse.json();
              rating.UserName = user.UserName;
            } else {
              rating.UserName = 'Unknown User';
            }
          } catch (err) {
            console.error('[Ratings] Error fetching user for rating:', err);
            rating.UserName = 'Unknown User';
          }
        }
        
        console.log('[Ratings] All ratings loaded with usernames');
        
      } catch (err) {
        console.error('[Ratings] Error fetching ratings:', err);
      } finally {
        this.loadingRatings = false;
      }
    },

    // Submit a new comment/rating
    async submitComment() {
      if (!this.currentUser) {
        alert('Please log in to submit a comment');
        return;
      }

      if (!this.newComment.UserComment.trim()) {
        alert('Please enter a comment');
        return;
      }

      try {
        this.submittingComment = true;

        const newRating = {
          UserID: this.currentUser.UserID,
          RecipeID: this.thisRecipe.RecipeID,
          UserScore: parseInt(this.newComment.UserScore),
          UserComment: this.newComment.UserComment.trim()
        };

        console.log('[Submit] Submitting new rating:', newRating);

        const response = await fetch('http://localhost:8080/UserRatings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newRating)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('[Submit] Failed:', errorData);
          throw new Error(errorData.error || 'Failed to submit comment');
        }

        console.log('[Submit] Comment submitted successfully');

        // Reset form
        this.newComment = {
          UserScore: 5,
          UserComment: ""
        };

        // Reload ratings to show the new comment
        await this.getUserRatings();
        
        alert('Comment submitted successfully!');

      } catch (err) {
        console.error('[Submit] Error:', err);
        alert('Failed to submit comment: ' + err.message);
      } finally {
        this.submittingComment = false;
      }
    },

    async deleteComment(ratingID) {
      if (!confirm('Are you sure you want to delete this comment?')) {
        return;
      }

      try {
        console.log('[Delete] Deleting rating ID:', ratingID);
        
        const response = await fetch(`http://localhost:8080/UserRatings/${ratingID}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete comment');
        }

        console.log('[Delete] Comment deleted successfully');

        // Reload ratings
        await this.getUserRatings();
        
        alert('Comment deleted successfully!');

      } catch (err) {
        console.error('[Delete] Error:', err);
        alert('Failed to delete comment: ' + err.message);
      }
    },

    canDeleteComment(rating) {
      if (!this.currentUser) return false;
      
      return this.currentUser.UserID === rating.UserID || 
             this.currentUser.IsAdmin === true;
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
      <button @click="goBack" class="btn-back">Back to Recipes</button>
      
      <h1>{{ thisRecipe.Name }}</h1>
      
      <!-- Recipe Information Table -->
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
            <td class="label">Average Score</td>
            <td>{{ thisRecipe.UserScore }} / 5</td>
          </tr>
        </tbody>
      </table>

      <!-- USER COMMENTS SECTION -->
      <div class="comments-section">
        <h2>User Comments & Ratings</h2>

        <!-- Add Comment Form (only for logged-in users) -->
        <div v-if="currentUser" class="add-comment-form">
          <h3>Add Your Comment</h3>
          
          <div class="form-group">
            <label for="score">Your Score:</label>
            <select v-model.number="newComment.UserScore" id="score" class="form-control">
              <option :value="1">1 / 5</option>
              <option :value="2">2 / 5</option>
              <option :value="3">3 / 5</option>
              <option :value="4">4 / 5</option>
              <option :value="5">5 / 5</option>
            </select>
          </div>

          <div class="form-group">
            <label for="comment">Your Comment:</label>
            <textarea 
              v-model="newComment.UserComment" 
              id="comment" 
              class="form-control"
              rows="4"
              placeholder="Share your thoughts about this recipe..."
            ></textarea>
          </div>

          <button 
            @click="submitComment" 
            class="btn-submit"
            :disabled="submittingComment"
          >
            {{ submittingComment ? 'Submitting...' : 'Submit Comment' }}
          </button>
        </div>

        <!-- Comments List -->
        <div class="comments-list">
          <div v-if="loadingRatings" class="loading-comments">
            Loading comments...
          </div>

          <div v-else-if="userRatings.length === 0" class="no-comments">
            <p>No comments yet. Be the first to comment!</p>
            <p class="debug-info">RecipeID: {{ thisRecipe.RecipeID }}</p>
          </div>

          <div v-else>
            <div 
              v-for="rating in userRatings" 
              :key="rating.UserRatingID"
              class="comment-card"
            >
              <div class="comment-header">
                <div class="user-info">
                  <span class="username">{{ rating.UserName }}</span>
                  <span class="score-badge">{{ rating.UserScore }} / 5</span>
                </div>
                
                <button 
                  v-if="canDeleteComment(rating)"
                  @click="deleteComment(rating.UserRatingID)"
                  class="btn-delete"
                  title="Delete comment"
                >
                  Delete
                </button>
              </div>

              <div class="comment-body">
                <p>{{ rating.UserComment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-container {
  max-width: 900px;
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
  margin-bottom: 40px;
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

/* COMMENTS SECTION */
.comments-section {
  margin-top: 40px;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.comments-section h2 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 24px;
  border-bottom: 3px solid #667eea;
  padding-bottom: 10px;
}

/* ADD COMMENT FORM */
.add-comment-form {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.add-comment-form h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 18px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  font-family: inherit;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.btn-submit {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-submit:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* LOGIN MESSAGE */
.login-message {
  text-align: center;
  padding: 30px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  margin-bottom: 30px;
}

.login-message p {
  color: #856404;
  font-size: 16px;
  margin: 10px 0;
}

.debug-info {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}

/* COMMENTS LIST */
.comments-list {
  margin-top: 30px;
}

.loading-comments,
.no-comments {
  text-align: center;
  padding: 40px;
  color: #777;
  font-size: 16px;
}

.comment-card {
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.comment-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.username {
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
}

.score-badge {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.btn-delete {
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.btn-delete:hover {
  background: #c82333;
  transform: scale(1.05);
}

.comment-body p {
  color: #555;
  line-height: 1.6;
  margin: 0;
  font-size: 15px;
}

/* Responsive design */
@media (max-width: 768px) {
  .recipe-container {
    padding: 10px;
  }

  .comments-section {
    padding: 20px;
  }

  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .user-info {
    width: 100%;
  }

  .btn-delete {
    align-self: flex-end;
  }
}
</style>
