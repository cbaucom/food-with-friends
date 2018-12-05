import React from "react";
import Downshift, { resetIdCounter } from "downshift";
import Router from "next/router";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import debounce from "lodash.debounce";
import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

const SEARCH_RECIPES_QUERY = gql`
  query SEARCH_RECIPES_QUERY($searchTerm: String!) {
    recipes(where: { OR: [{ name_contains: $searchTerm }] }) {
      id
      image
      name
    }
  }
`;

function routeToRecipe(recipe) {
  Router.push({
    pathname: "/recipe",
    query: {
      id: recipe.id
    }
  });
}
class AutoComplete extends React.Component {
  state = {
    recipes: [],
    loading: false
  };

  onChange = debounce(async (e, client) => {
    // turn loading on
    this.setState({ loading: true });
    // Manually query apollo client
    const res = await client.query({
      query: SEARCH_RECIPES_QUERY,
      variables: { searchTerm: e.target.value }
    });
    this.setState({
      recipes: res.data.recipes,
      loading: false
    });
  }, 350);

  render() {
    resetIdCounter();
    return (
      <SearchStyles>
        <Downshift
          onChange={routeToRecipe}
          recipeToString={recipe => (recipe === null ? "" : recipe.name)}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex
          }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: "search",
                      placeholder: "Search For A Recipe",
                      id: "search",
                      className: this.state.loading ? "loading" : "",
                      onChange: e => {
                        e.persist();
                        this.onChange(e, client);
                      }
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {this.state.recipes.map((recipe, index) => (
                    <DropDownItem
                      {...getItemProps({ recipe })}
                      key={recipe.id}
                      highlighted={index === highlightedIndex}
                    >
                      <img width="50" src={recipe.image} alt={recipe.name} />
                      {recipe.name}
                    </DropDownItem>
                  ))}
                  {!this.state.recipes.length && !this.state.loading && (
                    <DropDownItem>Nothing Found {inputValue}</DropDownItem>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default AutoComplete;
