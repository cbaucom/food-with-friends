import styled from "styled-components";

const NavStyles = styled.ul`
  background-color: #023767;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: end;
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
    @media (max-width: 400px) {
			padding: 1rem;
			font-size: 1.25rem;
    }
  }
  /* &:before {
    content: "";
    width: 2px;
    background: ${props => props.theme.lightgrey};
    height: 100%;
    left: 0;
    position: absolute;
    transform: skew(-20deg);
    top: 0;
    bottom: 0;
  } */
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
  @media (max-width: 1300px) {
    width: 100%;
    justify-content: end;
    font-size: 2rem;
  }
`;

export default NavStyles;
