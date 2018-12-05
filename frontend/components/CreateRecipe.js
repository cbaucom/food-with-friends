import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import Error from "./ErrorMessage";

const CREATE_RECIPE_MUTATION = gql`
  mutation CREATE_RECIPE_MUTATION(
    $name: String!
    $ingredients: [String!]
    $instructions: [String!]
    $image: String
    $largeImage: String
  ) {
    createRecipe(
      name: $name
      ingredients: $ingredients
      instructions: $instructions
      image: $image
      largeImage: $largeImage
    ) {
      id
      name
      ingredients
      instructions
    }
  }
`;

class CreateRecipe extends Component {
  state = {
    name: "",
    ingredient: "",
    ingredients: [],
    instruction: "",
    instructions: [],
    image: "",
    largeImage: ""
  };

  onChange = (key, value) => {
    this.setState({ [key]: value });
  };

  uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "food-with-friends");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/crbaucom/image/upload",
      {
        method: "POST",
        body: data
      }
    );

    const file = await res.json();
    console.log(file);
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  };

  addInstruction = () => {
    if (this.state.instruction === "") return;
    const instructions = this.state.instructions;
    instructions.push(this.state.instruction);
    this.setState({
      instructions,
      instruction: ""
    });
  };
  addIngredient = () => {
    if (this.state.ingredient === "") return;
    const ingredients = this.state.ingredients;
    ingredients.push(this.state.ingredient);
    this.setState({
      ingredients,
      ingredient: ""
    });
  };

  render() {
    return (
      <Mutation mutation={CREATE_RECIPE_MUTATION} variables={this.state}>
        {(createRecipe, { loading, error }) => (
          <div>
            <h2>Create Recipe</h2>

            <Form
              data-test="form"
              onSubmit={async e => {
                // Stop the form from submitting
                e.preventDefault();
                // call the mutation
                const res = await createRecipe();
                // change them to the single recipe page
                console.log(res);
                Router.push({
                  pathname: "/recipe",
                  query: { id: res.data.createRecipe.id }
                });
              }}
            >
              <Error error={error} />
              <fieldset disabled={loading} aria-busy={loading}>
                <p>Recipe Name:</p>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  required
                  value={this.state.name}
                  onChange={evt => this.onChange("name", evt.target.value)}
                />

                <div>
                  <p>Recipe Ingredients:</p>
                  {this.state.ingredients.map((ingredient, i) => (
                    <p key={i}>{ingredient}</p>
                  ))}
                </div>

                <input
                  type="text"
                  value={this.state.ingredient}
                  onChange={evt =>
                    this.onChange("ingredient", evt.target.value)
                  }
                  placeholder="Ingredient"
                />
                <button onClick={this.addIngredient}>Add Ingredient</button>

                <div>
                  <p>Recipe Instructions:</p>
                  {this.state.instructions.map((instruction, i) => (
                    <p key={i}>{`${i + 1}. ${instruction}`}</p>
                  ))}
                </div>

                <input
                  type="text"
                  value={this.state.instruction}
                  onChange={evt =>
                    this.onChange("instruction", evt.target.value)
                  }
                  placeholder="Instruction"
                />
                <button onClick={this.addInstruction}>Add Instruction</button>

                <div>
                  <label htmlFor="file">
                    Image
                    <input
                      type="file"
                      id="file"
                      name="file"
                      placeholder="Upload an image"
                      required
                      onChange={this.uploadFile}
                    />
                    {this.state.image && (
                      <img
                        width="200"
                        src={this.state.image}
                        alt="Upload Preview"
                      />
                    )}
                  </label>
                </div>
                <div>
                  <button type="submit" className="submitButton">
                    Add Recipe
                  </button>
                </div>
              </fieldset>
            </Form>
          </div>
        )}
      </Mutation>
    );
  }
}

export default CreateRecipe;
export { CREATE_RECIPE_MUTATION };
