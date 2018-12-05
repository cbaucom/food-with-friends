import Account from "../components/Account";
import PleaseSignIn from "../components/PleaseSignIn";
import styled from "styled-components";

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const AccountPage = props => (
  <Columns>
    <PleaseSignIn>
      <Account />
    </PleaseSignIn>
  </Columns>
);

export default AccountPage;
