import React, { Component } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Title from "./styles/Title";
import RecipeStyles from "./styles/RecipeStyles";
import DeleteRecipe from "../components/DeleteRecipe";
import AddToFavorites from "../components/AddToFavorites";
export default class Recipe extends Component {
  static propTypes = {
    recipe: PropTypes.object.isRequired
  };

  render() {
    // const recipe = this.props.recipe;
    const { recipe } = this.props;
    return (
      <RecipeStyles>
        <Link
          href={{
            pathname: "/recipe",
            query: { id: recipe.id }
          }}
        >
          <a>{recipe.image && <img src={recipe.image} alt={recipe.name} />}</a>
        </Link>
        <Title>
          <Link
            href={{
              pathname: "/recipe",
              query: { id: recipe.id }
            }}
          >
            <a>{recipe.name}</a>
          </Link>
        </Title>
        <p>{recipe.description}</p>

        <div className="buttonList">
          {/* <Link
            href={{
              pathname: "update",
              query: { id: recipe.id }
            }}
          >
            <a>Edit ✏️</a>
          </Link> */}
          <AddToFavorites id={recipe.id} />
          {/* <DeleteRecipe id={recipe.id}>Delete Recipe</DeleteRecipe> */}
        </div>
      </RecipeStyles>
    );
  }
}
