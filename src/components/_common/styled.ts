import styled from "styled-components/native";

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 19px 18px;
  height: 70px;
  background-color: ${({ theme }) => theme.colors.white[100]};
`;
