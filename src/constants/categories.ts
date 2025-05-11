export const CATEGORY_TITLES: { [key: string]: string } = {
  shopping: "쇼핑&구매",
  document: "문서&정보",
  reservation: "거래&예약",
  location: "장소",
  coupon: "쿠폰",
  chat: "대화기록",
  music: "노래",
  animal: "동물",
  person: "인물",
  etc: "기타",
};

//TODO: 백엔드 response 맞추기용 -> 추후 의논
export const ALBUM_NAME_TO_KEY: Record<string, keyof typeof CATEGORY_TITLES> = {
  기타: "etc",
  쇼핑: "shopping",
  문서: "document",
  예약: "reservation",
  장소: "location",
  쿠폰: "coupon",
  대화기록: "chat",
  노래: "music",
  동물: "animal",
  인물: "person",
};

export const ALBUM_ID_TO_KEY: Record<number, keyof typeof CATEGORY_TITLES> = {
  1: "etc",
  2: "shopping",
  3: "document",
  4: "reservation",
  5: "location",
  6: "coupon",
  7: "chat",
  8: "music",
  9: "animal",
  0: "person",
};
