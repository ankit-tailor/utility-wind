import React from "react";
import "./styles/index.css";

const App = () => {
  return (
    <button
      flex={1}
      bg="green-500"
      items="center"
      justify="center"
      px="4"
      py="3.5"
      hover={{
        bg: "green-600",
      }}
    >
      Hello world
    </button>
  );
};

export default App;
