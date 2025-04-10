import { InfoIcon, MoveFileIcon, TrashIcon } from "@/assets/icons/_index";

export type DropdownMode = "trash" | "move" | "info";
export type DropdownItem = {
  label: string;
  icon: React.FC<{ style?: any }>;
  mode: DropdownMode;
};

export const dropdownItems: DropdownItem[] = [
  {
    label: "휴지통 이동",
    icon: TrashIcon,
    mode: "trash",
  },
  {
    label: "파일 이동",
    icon: MoveFileIcon,
    mode: "move",
  },
  {
    label: "상세 정보",
    icon: InfoIcon,
    mode: "info",
  },
];
