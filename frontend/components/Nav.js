import Link from "next/link";
import styled from "styled-components";
import User from "./User";
import Signout from "./Signout";

const StyledNav = styled.ul`
  background-color: #023767;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-around;
  font-size: 2rem;
  a,
  button {
    padding: 1rem 3rem;
    display: flex;
    align-items: center;
    position: relative;
    color: #fff;
    text-decoration: none;
    font-size: 1em;
    background: none;
    border: 0;
    cursor: pointer;
    @media (max-width: 700px) {
      font-size: 10px;
      padding: 0 10px;
    }
  }
  &:after {
    height: 2px;
    background: red;
    content: "";
    width: 0;
    position: absolute;
    transform: translateX(-50%);
    transition: width 0.4s;
    transition-timing-function: cubic-bezier(1, -0.65, 0, 2.31);
    left: 50%;
    margin-top: 2rem;
  }
  &:hover,
  &:focus {
    outline: none;
    &:after {
      width: calc(100% - 60px);
    }
  }
`;

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <StyledNav data-test="nav">
        <Link prefetch href="/">
          <a>Home</a>
        </Link>

        <Link prefetch href="/recipes">
          <a>Recipes</a>
        </Link>

        {me && (
          <>
            <Link href="/add">
              <a>Add Recipe</a>
            </Link>

            <Signout />
          </>
        )}
        {!me && (
          <Link href="/login">
            <a>Sign In</a>
          </Link>
        )}
      </StyledNav>
    )}
  </User>
);

export default Nav;
