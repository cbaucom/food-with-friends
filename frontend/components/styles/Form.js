import styled, { keyframes } from "styled-components";

const loading = keyframes`
  from {
    background-position: 0 0;
    /* rotate: 0; */
  }

  to {
    background-position: 100% 100%;
    /* rotate: 360deg; */
  }
`;

const Form = styled.form`
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
  padding: 20px;
  font-size: 1.5rem;
  line-height: 1.5;
  font-weight: 100;
  display: flex;
  flex-direction: column;
  text-align: left;
  button {
    border: none;
    font-size: 1.25rem;
    background: rgba(0, 0, 0, 0.1);
    width: 250px;
    height: 50px;
    cursor: pointer;
    margin: 15px 0px;
  }
  fieldset {
    border: none;
  }
  input {
    width: 100%;
    outline: none;
    border: none;
    border-bottom: 2px solid #94bae9;
    height: 44px;
    font-size: 18px;
  }
  textarea {
    border: 1px solid #ddd;
    outline: none;
    font-size: 18px;
  }
  .submitButton {
    width: 100%;
    background-color: #94bae9;
    padding: 8px 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.85;
    cursor: pointer;
    :hover: {
      opacity: 1;
    }
  }
`;

Form.displayName = "Form";

export default Form;
