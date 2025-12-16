<script>
export default {
  // components: {
  //     thisRecipe: {
  //     RecipeID: "",
  //     Name: "",
  //     Description: "",
  //     Beverage: "",
  //     UserScore: 0,
  //   },
  // },
  props: {
    seekID: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      thisRecipe: {
        RecipeID: "",
        Name: "TwistedSister",
        Description: "desc",
        Beverage: "Alcoholical",
        UserScore: 2.5,
      },
    };
  },

  beforeMount() {
    this.getDetails();
  },

  methods: {
    async getDetails() {
      //   const response = await fetch(
      //     `http://localhost:8080/recipes/${this.seekID}`
      //   );
      this.thisRecipe = await (
        await fetch(`http://localhost:8080/recipe/${this.seekID}`)
      ).json();
      //   this.thisRecipe = await response.json();
    },
  },
};
</script>

<template>
  <table class="table table-striped">
    <tr>
      <td>Recipe ID</td>
      <td>{{ thisRecipe.RecipeID }}</td>
    </tr>

    <tr>
      <td>Name</td>
      <td>{{ thisRecipe.Name }}</td>
    </tr>

    <tr>
      <td>Description</td>
      <td>{{ thisRecipe.Description }}</td>
    </tr>

    <tr>
      <td>Beverage</td>
      <td>{{ thisRecipe.Beverage }}</td>
    </tr>

    <tr>
      <td>User Score</td>
      <td>{{ thisRecipe.UserScore }}</td>
    </tr>
  </table>
</template>
