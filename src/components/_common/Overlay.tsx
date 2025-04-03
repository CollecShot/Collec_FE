import styled from "styled-components/native";

const Overlay: React.FC<{}> = () => {
  return <OverlayComponent />;
};

const OverlayComponent = styled.View`
  position: absolute;
  top: 3px;
  left: 3px;
  right: 3px;
  bottom: 3px;
  border-width: 1.5px;
  border-color: #fc4646;
  background-color: #fc464626;
  z-index: 1;
`;

export default Overlay;
