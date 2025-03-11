import "styled-components/native";
import { theme } from "./index";

type ThemeType = typeof theme; // theme 객체의 타입을 추출

declare module "styled-components/native" {
  export interface DefaultTheme extends ThemeType {}
}
