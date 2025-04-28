import api from "./instance";

export async function registerDevice(deviceUID: string) {
  const response = await api.post("/users/register", { deviceUID });

  if (response.status !== 201) {
    throw new Error(`Failed to register device. Status: ${response.status}`);
  }

  return response.data;
}
