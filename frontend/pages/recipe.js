import SingleRecipe from "../components/SingleRecipe";

const Recipe = props => (
  <div>
    <SingleRecipe id={props.query.id} />
  </div>
);

export default Recipe;
