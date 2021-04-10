import React from "react";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import { appVM } from "./AppVM";
import BookItem from "./components/bookItem/BookItem";
import styled from "styled-components";
import ToolBar from "./components/toolbar/ToolBar";
import Footer from "./components/footer/Footer";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
initializeIcons(/* optional base url */);

const App = (): React.ReactElement => {
  appVM.useBind();
  return (
    <Root>
      <ToolBar />
      <Container>
        {appVM.filteredBooks.map((book) => (
          <BookItem key={book.url} {...book} />
        ))}
        {appVM.isProgress ? (
          <Spinner size={SpinnerSize.large} />
        ) : (
          <React.Fragment />
        )}

        <Footer />
      </Container>
    </Root>
  );
};
const Root = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
`;

export default App;

const Container = styled.div`
  padding-top: 10px;
  padding-left: 2px;
  overflow-y: scroll;
`;
