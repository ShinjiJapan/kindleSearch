import React from "react";
import styled from "styled-components";
import { appVM } from "../../AppVM";
import { TextField } from "office-ui-fabric-react/lib/components/TextField/TextField";
const LocalMuteWord = (): React.ReactElement => {
  const viewModel = appVM.searchPanelContentVM.localMuteWordVM;
  viewModel.useBind();
  return <MuteTextField {...viewModel} />;
};

export default React.memo(LocalMuteWord);

const MuteTextField = styled(TextField)`
  margin-left: 10px;
  margin-right: 4px;
`;
