import { CloseIcon, SearchIcon } from "@/assets/icons/_index";
import React, { useState } from "react";
import { TextInputProps } from "react-native";
import styled from "styled-components/native";

interface SearchBarProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
  placeholder?: string;
  onClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmitEditing,
  placeholder = "어떤 사진이 궁금하신가요?",
  onClear,
  ...rest
}) => {
  const [showClear, setShowClear] = useState(false);

  // 엔터 눌렀을 때 부모의 onSubmitEditing 호출 후 X 아이콘 보여주기
  const handleSubmit = () => {
    onSubmitEditing();
    setShowClear(true);
  };

  // X 아이콘 누르면 텍스트 삭제 후 X 아이콘 숨기기
  const handleClear = () => {
    onChangeText("");
    setShowClear(false);
    if (onClear) {
      onClear();
    }
  };

  return (
    <SearchBarContainer>
      <IconContainer>
        <SearchIcon fill="#fff" />
      </IconContainer>
      <InputContainer>
        <StyledTextInput
          value={value}
          onChangeText={(text: string) => {
            onChangeText(text);
          }}
          placeholder={placeholder}
          placeholderTextColor="#2a2a2a"
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          {...rest}
        />
      </InputContainer>
      {showClear && (
        <ClearIconContainer onPress={handleClear}>
          <CloseIcon />
        </ClearIconContainer>
      )}
    </SearchBarContainer>
  );
};

export default SearchBar;

const SearchBarContainer = styled.View`
  flex-direction: row;
  overflow: hidden;
  width: 100%;
  height: 34px;
  border: 0.8px solid #fc4646;
`;

const IconContainer = styled.View`
  padding: 0 6px;
  justify-content: center;
  align-items: center;
  background-color: #fc4646;
`;

const InputContainer = styled.View`
  flex: 1;
  background-color: #fff;
`;

const StyledTextInput = styled.TextInput`
  flex: 1;
  padding-left: 16px;
  color: #2a2a2a;
  font-size: ${({ theme }) => theme.typography.size.body3}px;
  font-family: ${({ theme }) => theme.typography.family.regular};
`;

const ClearIconContainer = styled.TouchableOpacity`
  margin-right: 6px;
  justify-content: center;
  align-items: center;
`;
