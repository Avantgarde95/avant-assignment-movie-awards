import React from "react";
import styled from "@emotion/styled";
import { Global, ThemeProvider } from "@emotion/react";

import Header from "Templates/Header";
import Ballot from "Templates/Ballot";
import { globalStyle } from "Styles/Global";
import { defaultTheme } from "Styles/Theme";

const App = () => (
  <ThemeProvider theme={defaultTheme}>
    <Container>
      <Global styles={globalStyle} />
      <Header />
      <Ballot />
    </Container>
  </ThemeProvider>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: 100%;

  color: ${({ theme }) => theme.color.fontColor};
  background-color: ${({ theme }) => theme.color.pageBackgroundColor};
`;

export default App;
