import React from "react";

import { BookItemModel } from "./BookItemModel";
import styled from "styled-components";
import { Rating } from "@fluentui/react/lib/Rating";
import { Link } from "@fluentui/react/lib/Link";
import { IconButton } from "@fluentui/react";
import { appVM } from "../../AppVM";

const BookItem = (props: BookItemModel): React.ReactElement => {
  return (
    <Root>
      <Container>
        <InnerContainer>
          <Link href={props.url} target="_blank">
            <Thumbnail src={props.src} />
          </Link>
          <RightArea>
            {props.isUnlimited ? (
              <div>
                <Kindle>Kindle</Kindle>
                <span>unlimited</span>
              </div>
            ) : (
              <React.Fragment />
            )}
            <div>著者</div>
            <Authors>
              {props.authors.map((x, i) => (
                <AuthorRow key={x.name + i}>
                  {x.url ? (
                    <Link href={x.url} target="_blank">
                      {x.name}
                    </Link>
                  ) : (
                    <span>{x.name}</span>
                  )}
                  <MuteAuthorButton
                    iconProps={{ iconName: "Cancel" }}
                    title="NG著者に追加"
                    onClick={() => {
                      appVM.toolBarVM.settingsVM.addMuteAuthor(x.name);
                    }}
                  />
                </AuthorRow>
              ))}
            </Authors>
            <Price>価格: {props.price}</Price>

            {props.star === 0 ? (
              <React.Fragment />
            ) : (
              <Rating min={1} max={5} rating={props.star} readOnly={true} />
            )}
          </RightArea>
        </InnerContainer>
        <Title>
          <Link href={props.url} target="_blank">
            {props.title}
          </Link>
        </Title>
      </Container>
    </Root>
  );
};

export default React.memo(BookItem);

const Kindle = styled.span`
  color: orange;
`;

const Authors = styled.div`
  padding-left: 4px;
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
`;

const MuteAuthorButton = styled(IconButton)`
  width: 20px;
  height: 20px;
  padding: 0;
  margin-left: 2px;
  color: #999;
  &:hover {
    color: #c00;
  }
  i {
    font-size: 10px;
  }
`;

const Price = styled.div`
  margin-top: 10px;
`;

const RightArea = styled.div`
  padding-left: 4px;
`;

const Thumbnail = styled.img`
  width: 151px;
  height: 218px;
`;

const Title = styled.div`
  overflow-y: hidden;
  padding-right: 10px;
  background-color: #eef;
`;

const Root = styled.div`
  display: inline-block;
  width: 300px;
  border-style: solid;
  border-width: 1px;
  border-color: #ddd;
  margin: 2px;
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: 218px 60px;
`;

const InnerContainer = styled.div`
  display: grid;
  grid-template-columns: 151px 1fr;
`;
