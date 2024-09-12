import httpClient from "..";

export const uploadPublicFile = (file: File, folder: string) => {
  const form = new FormData();
  form.append("file", file);
  form.append("category", folder);
  return httpClient.post("/v1/files/upload/public", form, {
    contentType: "multi-form",
  });
};
