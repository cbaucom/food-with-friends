import Link from "next/link";
import styled from "styled-components";
import Router from "next/router";
import NProgress from "nprogress";
import Nav from "./Nav";
import Search from "./Search";

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const Logo = styled.h1`
  font-size: 2rem;
  margin-left: 2rem;
  position: relative;
  z-index: 2;
  transform: skew(-20deg);
  @media (max-width: 420px) {
    font-size: 1.25rem;
  }
  @media (max-width: 550px) {
    font-size: 1.5rem;
  }
  a {
    height: 100%;
    padding: 1rem 3rem;
    display: flex;
    align-items: center;
    position: relative;
    background: ${props => props.theme.navy};
    color: white;
    text-transform: uppercase;
    text-decoration: none;
    @media (max-width: 400px) {
      padding: 1rem;
      font-size: 1.25rem;
    }
  }
  @media (max-width: 1300px) {
    margin: 0;
    text-align: center;
  }
`;

const StyledHeader = styled.header`
  .bar {
    /* border-bottom: 10px solid ${props => props.theme.navy}; */
    background-color: ${props => props.theme.navy};
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-around;
    align-items: stretch;
    @media (max-width: 1300px) {
      /* grid-template-columns: 1fr;
      justify-content: center; */
    }
  }
  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid ${props => props.theme.lightgrey};
  }
`;

const Header = () => (
  <StyledHeader>
    <div className="bar">
      <Logo>
        <Link href="/">
          <a>Food with Friends</a>
        </Link>
      </Logo>
      <Nav />
    </div>
    <div className="sub-bar">
      <Search />
    </div>
  </StyledHeader>
);

export default Header;
