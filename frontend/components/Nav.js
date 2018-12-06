import Link from "next/link";
import User from "./User";
import Signout from "./Signout";
import NavStyles from "./styles/NavStyles";

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles data-test="nav">
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
      </NavStyles>
    )}
  </User>
);

export default Nav;
