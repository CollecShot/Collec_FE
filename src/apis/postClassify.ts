import api from "./instance";

export interface ClassifyRequest {
  photoId: number;
  deviceUID: string;
}

export interface ClassifyResponse {
  data: {
    photoId: number;
    /* …서버가 반환하는 필드들… */
  };
  message: string;
  status: number;
}

export async function classifyPhoto(payload: ClassifyRequest): Promise<ClassifyResponse> {
  const res = await api.post<ClassifyResponse>("/photo/classify", payload);
  return res.data;
}
