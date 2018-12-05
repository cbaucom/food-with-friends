import Recipes from "../components/Recipes";

const Home = props => (
  <div>
    <Recipes page={parseFloat(props.query.page) || 1} />
  </div>
);

export default Home;
