import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Router from "next/router";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const UPDATE_PW_MUTATION = gql`
  mutation UPDATE_PW_MUTATION($password: String!, $confirmPassword: String!) {
    updatePassword(password: $password, confirmPassword: $confirmPassword) {
      id
      email
      name
    }
  }
`;

class Account extends Component {
  state = {
    password: "",
    confirmPassword: ""
  };
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <Mutation
        mutation={UPDATE_PW_MUTATION}
        variables={{
          password: this.state.password,
          confirmPassword: this.state.confirmPassword
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(update, { error, loading, called }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await update();
              this.setState({ password: "", confirmPassword: "" });
              Router.push("/recipes");
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Update Your Password</h2>
              <Error error={error} />
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>

              <label htmlFor="confirmPassword">
                Confirm Your Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="confirmPassword"
                  value={this.state.confirmPassword}
                  onChange={this.saveToState}
                />
              </label>

              <button type="submit">Update Your Password!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Account;
