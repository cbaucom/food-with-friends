import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ALL_RECIPES_QUERY } from "./Recipes";

const DELETE_RECIPE_MUTATION = gql`
  mutation DELETE_RECIPE_MUTATION($id: ID!) {
    deleteRecipe(id: $id) {
      id
    }
  }
`;

class DeleteRecipe extends Component {
  update = (cache, payload) => {
    // manually update the cache on the client, so it matches the server
    // 1. Read the cache for the recipes we want
    const data = cache.readQuery({ query: ALL_RECIPES_QUERY });
    console.log(data, payload);
    // 2. Filter the deleted recipeout of the page
    data.recipes = data.recipes.filter(
      recipe => recipe.id !== payload.data.deleteRecipe.id
    );
    // 3. Put the recipes back!
    cache.writeQuery({ query: ALL_RECIPES_QUERY, data });
  };
  render() {
    return (
      <Mutation
        mutation={DELETE_RECIPE_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
      >
        {(deleteRecipe, { error }) => (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this recipe?")) {
                deleteRecipe().catch(err => {
                  alert(err.message);
                });
              }
            }}
          >
            {this.props.children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default DeleteRecipe;
