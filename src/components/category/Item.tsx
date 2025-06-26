import React from "react";
import { SvgProps } from "react-native-svg";
import styled from "styled-components/native";
import CategoryText from "./Text";

import {
  AnimalIcon,
  ChatIcon,
  CouponIcon,
  DocumentIcon,
  EtcIcon,
  LocationIcon,
  MusicIcon,
  PersonIcon,
  ReservationIcon,
  ShoppingIcon,
} from "@/assets/icons/categories/_index";

type ItemProps = {
  iconKey: string;
  title: string;
  imageUri: string | null;
  count: number;
  onPress?: () => void;
  disabled?: boolean;
};

const iconMap: Record<string, React.FC<SvgProps>> = {
  shopping: ShoppingIcon,
  document: DocumentIcon,
  reservation: ReservationIcon,
  location: LocationIcon,
  coupon: CouponIcon,
  chat: ChatIcon,
  music: MusicIcon,
  animal: AnimalIcon,
  person: PersonIcon,
  etc: EtcIcon,
};

export default function Item({
  iconKey,
  title,
  imageUri,
  count,
  onPress,
  disabled = false,
}: ItemProps) {
  const IconComponent = iconMap[iconKey];

  return (
    <Container onPress={onPress} disabled={disabled}>
      <ImageWrapper>
        {imageUri ? (
          <CategoryImage source={{ uri: imageUri }} resizeMode="cover" />
        ) : (
          <IconComponent width={40} height={40} />
        )}
      </ImageWrapper>
      <CategoryText title={title} count={count} />
    </Container>
  );
}

const Container = styled.TouchableOpacity`
  width: 30%;
  margin: 1.5%;
`;

const ImageWrapper = styled.View`
  width: 100%;
  aspect-ratio: 1;
  border: 0.5px solid #7b7b7b;
  background-color: ${({ theme }) => theme.colors.white[100]};
  justify-content: center;
  align-items: center;
`;

const CategoryImage = styled.Image`
  width: 100%;
  height: 100%;
`;
