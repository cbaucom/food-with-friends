import CreateRecipe from "../components/CreateRecipe";
import PleaseSignIn from "../components/PleaseSignIn";

const Add = props => (
  <div>
    <PleaseSignIn>
      <CreateRecipe />
    </PleaseSignIn>
  </div>
);

export default Add;
