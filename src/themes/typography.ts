import { TextProps as RNTextProps } from "react-native";
import styled from "styled-components/native";

interface CustomTextProps extends RNTextProps {
  color?: string;
  styles?: string;
}

export const typography = {
  // useFonts로 로드된 이름과 동일해야 함
  family: {
    bold: "Bold",
    semiBold: "SemiBold",
    medium: "Medium",
    regular: "Regular",
    light: "Light",
    extraLight: "ExtraLight",
  },

  size: {
    largeTitle: 32, // Bold
    title1: 23, // SemiBold
    title2: 23, // Medium
    title3: 20, // Medium
    headline1: 18, // Medium
    headline2: 16, // Medium
    headline3: 15, // SemiBold
    body1: 14, // SemiBold
    body2: 14, // Medium
    body3: 14, // Regular
    body4: 13, // Medium
    body5: 12, // Medium
    body6: 12, // Regular
  },

  lineHeight: {
    single: 1.2,
    multi: 1.4,
  },
};

// largeTitle: 32, Bold
export const LargeTitle = styled.Text<CustomTextProps>`
  font-size: ${({ theme }) => theme.typography.size.largeTitle}px;
  font-family: ${({ theme }) => theme.typography.family.bold};
  line-height: ${({ theme }) =>
    theme.typography.size.largeTitle * theme.typography.lineHeight.single}px;
  color: ${({ theme, color }) => color || theme.colors.black[100]};
  ${({ styles }) => styles || ""}
`;

// title1: 23, SemiBold
export const Title1 = styled.Text<CustomTextProps>`
  font-size: ${({ theme }) => theme.typography.size.title1}px;
  font-family: ${({ theme }) => theme.typography.family.semiBold};
  line-height: ${({ theme }) =>
    theme.typography.size.title1 * theme.typography.lineHeight.single}px;
  color: ${({ theme, color }) => color || theme.colors.black[100]};
  ${({ styles }) => styles || ""}
`;

// title2: 23, Medium
export const Title2 = styled.Text<CustomTextProps>`
  font-size: ${({ theme }) => theme.typography.size.title2}px;
  font-family: ${({ theme }) => theme.typography.family.medium};
  line-height: ${({ theme }) =>
    theme.typography.size.title2 * theme.typography.lineHeight.single}px;
  color: ${({ theme, color }) => color || theme.colors.black[100]};
  ${({ styles }) => styles || ""}
`;

// title3: 20, Medium
export const Title3 = styled.Text<CustomTextProps>`
  font-size: ${({ theme }) => theme.typography.size.title3}px;
  font-family: ${({ theme }) => theme.typography.family.medium};
  line-height: ${({ theme }) =>
    theme.typography.size.title3 * theme.typography.lineHeight.single}px;
  color: ${({ theme, color }) => color || theme.colors.black[100]};
  ${({ styles }) => styles || ""}
`;

// headline1: 18, Medium
export const Headline1 = styled.Text<CustomTextProps>`
  font-size: ${({ theme }) => theme.typography.size.headline1}px;
  font-family: ${({ theme }) => theme.typography.family.medium};
  line-height: ${({ theme }) =>
    theme.typography.size.headline1 * theme.typography.lineHeight.single}px;
  color: ${({ theme, color }) => color || theme.colors.black[100]};
  ${({ styles }) => styles || ""}
`;

// headline2: 16, Medium
export const Headline2 = styled.Text<CustomTextProps>`
  font-size: ${({ theme }) => theme.typography.size.headline2}px;
  font-family: ${({ theme }) => theme.typography.family.medium};
  line-height: ${({ theme }) =>
    theme.typography.size.headline2 * theme.typography.lineHeight.single}px;
  color: ${({ theme, color }) => color || theme.colors.black[100]};
  ${({ styles }) => styles || ""}
`;

// headline3: 15, SemiBold
export const Headline3 = styled.Text<CustomTextProps>`
  font-size: ${({ theme }) => theme.typography.size.headline3}px;
  font-family: ${({ theme }) => theme.typography.family.semiBold};
  line-height: ${({ theme }) =>
    theme.typography.size.headline3 * theme.typography.lineHeight.single}px;
  color: ${({ theme, color }) => color || theme.colors.black[100]};
  ${({ styles }) => styles || ""}
`;

// body1: 14, SemiBold
export const Body1 = styled.Text<CustomTextProps>`
  font-size: ${({ theme }) => theme.typography.size.body1}px;
  font-family: ${({ theme }) => theme.typography.family.semiBold};
  line-height: ${({ theme }) => theme.typography.size.body1 * theme.typography.lineHeight.single}px;
  color: ${({ theme, color }) => color || theme.colors.black[100]};
  ${({ styles }) => styles || ""}
`;

// body2: 14, Medium
export const Body2 = styled.Text<CustomTextProps>`
  font-size: ${({ theme }) => theme.typography.size.body2}px;
  font-family: ${({ theme }) => theme.typography.family.medium};
  line-height: ${({ theme }) => theme.typography.size.body2 * theme.typography.lineHeight.single}px;
  color: ${({ theme, color }) => color || theme.colors.black[100]};
  ${({ styles }) => styles || ""}
`;

// body3: 14, Regular
export const Body3 = styled.Text<CustomTextProps>`
  font-size: ${({ theme }) => theme.typography.size.body3}px;
  font-family: ${({ theme }) => theme.typography.family.regular};
  line-height: ${({ theme }) => theme.typography.size.body3 * theme.typography.lineHeight.single}px;
  color: ${({ theme, color }) => color || theme.colors.black[100]};
  ${({ styles }) => styles || ""}
`;

// body4: 13, Medium
export const Body4 = styled.Text<CustomTextProps>`
  font-size: ${({ theme }) => theme.typography.size.body4}px;
  font-family: ${({ theme }) => theme.typography.family.medium};
  line-height: ${({ theme }) => theme.typography.size.body4 * theme.typography.lineHeight.single}px;
  color: ${({ theme, color }) => color || theme.colors.black[100]};
  ${({ styles }) => styles || ""}
`;

// body5: 12, Medium
export const Body5 = styled.Text<CustomTextProps>`
  font-size: ${({ theme }) => theme.typography.size.body5}px;
  font-family: ${({ theme }) => theme.typography.family.medium};
  line-height: ${({ theme }) => theme.typography.size.body5 * theme.typography.lineHeight.single}px;
  color: ${({ theme, color }) => color || theme.colors.black[100]};
  ${({ styles }) => styles || ""}
`;

// body6: 12, Regular
export const Body6 = styled.Text<CustomTextProps>`
  font-size: ${({ theme }) => theme.typography.size.body6}px;
  font-family: ${({ theme }) => theme.typography.family.regular};
  line-height: ${({ theme }) => theme.typography.size.body6 * theme.typography.lineHeight.single}px;
  color: ${({ theme, color }) => color || theme.colors.black[100]};
  ${({ styles }) => styles || ""}
`;
