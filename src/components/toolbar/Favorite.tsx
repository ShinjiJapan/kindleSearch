import React, { useRef, useEffect } from "react";
import { IconButton } from "@fluentui/react";
import styled from "styled-components";
import { appVM } from "../../AppVM";
import { getCurrentRegion } from "../../config/RegionConfig";

const Favorite = (): React.ReactElement => {
  const viewModel = appVM.toolBarVM.favoriteVM;
  viewModel.useBind();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewModel.isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        viewModel.close();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [viewModel.isOpen]);

  const handleAdd = () => {
    const name = prompt(getCurrentRegion().labels.favoritesPrompt);
    if (name) {
      viewModel.add(name);
    }
  };

  return (
    <Root>
      <div ref={buttonRef}>
        <StarButton
          iconProps={{ iconName: "FavoriteStarFill" }}
          title={getCurrentRegion().labels.favorites}
          onClick={viewModel.toggleOpen}
        />
      </div>
      {viewModel.isOpen && (
        <Panel ref={panelRef}>
          <PanelHeader>{getCurrentRegion().labels.favorites}</PanelHeader>
          <AddButton onClick={handleAdd}>{getCurrentRegion().labels.favoritesAdd}</AddButton>
          <ItemList>
            {viewModel.favorites.map((fav, i) => (
              <Item key={i}>
                <ItemName onClick={() => viewModel.select(i)}>
                  {fav.name}
                </ItemName>
                <IconButton
                  iconProps={{ iconName: "Delete" }}
                  title={getCurrentRegion().labels.delete}
                  onClick={() => viewModel.remove(i)}
                  styles={{ root: { width: 28, height: 28 } }}
                />
              </Item>
            ))}
          </ItemList>
        </Panel>
      )}
    </Root>
  );
};

export default React.memo(Favorite);

const Root = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StarButton = styled(IconButton)`
  color: #e8a000;
  font-size: 18px;
  text-shadow: 0 0 1px #333;
  i {
    -webkit-text-stroke: 0.5px #555;
  }
  &:hover {
    color: #d49000;
  }
`;

const Panel = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 260px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 8px 0;
`;

const PanelHeader = styled.div`
  font-weight: 600;
  font-size: 14px;
  padding: 4px 12px 8px;
  border-bottom: 1px solid #eee;
`;

const ItemList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 4px 2px 12px;
  &:hover {
    background-color: #f3f2f1;
  }
`;

const ItemName = styled.span`
  cursor: pointer;
  flex: 1;
  padding: 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AddButton = styled.div`
  cursor: pointer;
  padding: 4px 12px 8px;
  border-bottom: 1px solid #eee;
  color: #0078d4;
  font-size: 13px;
  &:hover {
    background-color: #f3f2f1;
  }
`;
