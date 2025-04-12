import { InfoIcon, MoveFileIcon, TrashGreyIcon } from "@/assets/icons/_index";

export type DropdownMode = "trash" | "move" | "info" | "delete" | "restore";
export type DropdownItem = {
  label: string;
  icon: React.FC<{ style?: any }>;
  mode: DropdownMode;
};

export const dropdownItems: DropdownItem[] = [
  {
    label: "휴지통 이동",
    icon: TrashGreyIcon,
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
  {
    label: "사진 삭제",
    icon: TrashGreyIcon,
    mode: "delete",
  },
  {
    label: "사진 복구",
    icon: MoveFileIcon,
    mode: "restore",
  },
];
