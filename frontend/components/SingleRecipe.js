import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Error from "./ErrorMessage";
import styled from "styled-components";
import Head from "next/head";

const SingleRecipeStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 400px;
  @media (max-width: 550px) {
    grid-template-rows: repeat(auto-fit, minmax(75px, auto));
    /* grid-template-columns: repeat(auto-fit, minmax(75px, 350px)); */
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
    ul {
      margin-top: 0;
    }
  }
`;

const SINGLE_RECIPE_QUERY = gql`
  query SINGLE_RECIPE_QUERY($id: ID!) {
    recipe(where: { id: $id }) {
      id
      name
      ingredients
      instructions
      largeImage
    }
  }
`;
class SingleRecipe extends Component {
  render() {
    return (
      <Query
        query={SINGLE_RECIPE_QUERY}
        variables={{
          id: this.props.id
        }}
      >
        {({ error, loading, data }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>;
          if (!data.recipe) return <p>No Item Found for {this.props.id}</p>;
          const recipe = data.recipe;
          return (
            <SingleRecipeStyles>
              <Head>
                <title>{recipe.name} | Food with Friends</title>
              </Head>
              <img src={recipe.largeImage} alt={recipe.name} />
              <div className="details">
                <h2>{recipe.name}</h2>
                Ingredients
                <ul>
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
                Instructions
                <ul>
                  {recipe.instructions.map((instruction, i) => (
                    <li key={i}>{instruction}</li>
                  ))}
                </ul>
              </div>
            </SingleRecipeStyles>
          );
        }}
      </Query>
    );
  }
}

export default SingleRecipe;
export { SINGLE_RECIPE_QUERY };
