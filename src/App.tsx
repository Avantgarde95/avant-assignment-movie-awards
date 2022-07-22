import React from "react";
import styled from "@emotion/styled";
import { Global } from "@emotion/react";

import Ballot from "Templates/Ballot";
import Header from "Templates/Header";
import { globalStyle } from "Styles/Global";

const App = () => (
  <Container>
    <Global styles={globalStyle} />
    <Header />
  </Container>
);

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export default App;
