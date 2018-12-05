import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Recipe from "./Recipe";
import Pagination from "./Pagination";
import { perPage } from "../config";

const ALL_RECIPES_QUERY = gql`
  query ALL_RECIPES_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
    recipes(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      name
      description
      ingredients
      instructions
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const RecipesList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

class Recipes extends Component {
  render() {
    return (
      <Center>
        <Query
          query={ALL_RECIPES_QUERY}
          variables={{
            skip: this.props.page * perPage - perPage
          }}
        >
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;
            return (
              <RecipesList>
                {data.recipes.map(recipe => (
                  <Recipe recipe={recipe} key={recipe.id} />
                ))}
              </RecipesList>
            );
          }}
        </Query>
        <Pagination page={this.props.page} />
      </Center>
    );
  }
}

export default Recipes;
export { ALL_RECIPES_QUERY };
