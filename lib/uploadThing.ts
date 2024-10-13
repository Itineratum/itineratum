import { UTApi } from "uploadthing/server";

export const deleteImage = async (image: string | null | undefined) => {
  // code from https://github.com/pingdotgg/uploadthing/issues/683#issuecomment-1984422217
  if (image && image.startsWith("https://utfs.io")) {
    const [_, key] = image.split("/f/");
    await new UTApi().deleteFiles(key);
  }
};
