import { updateUser } from "@/services/database/users";
import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { deleteImage } from "@/lib/uploadThing";
import { authOptions } from "../auth/authOptions";

const f = createUploadthing();

// const auth = async (req: Request) => ({ id: "fakeId" }); // Fake auth function)

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "2MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await getServerSession(authOptions);

      if (!session || !session.user?.email) {
        throw new UploadThingError("Unauthorized");
      }

      const email = session.user.email;
      const oldPicture = session.user.image;

      // const user = await auth(req);

      // // If you throw, the user will not be able to upload
      // if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { email, oldPicture };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // This code RUNS ON YOUR SERVER after upload
        const email = metadata.email;
        const oldPicture = metadata.oldPicture;

        console.log(
          `User ${email} has uploaded a new user account image to ${file.url}`,
        );

        const update = {
          $set: {
            profile_picture: file.url,
          },
        };
        const updateUserRes = await updateUser(email, update);

        if (!updateUserRes.success) {
          throw new UploadThingError(updateUserRes.error!);
        }

        // delete old profile picture
        await deleteImage(oldPicture);

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete`4 callback
        return { image: file.url };
      } catch (error) {
        throw error;
      }
    }),
  feedbackFormFileUploader: f({
    image: { maxFileSize: "2MB" },
    pdf: { maxFileSize: "2MB" },
    audio: { maxFileSize: "2MB" },
    video: { maxFileSize: "8MB" },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await getServerSession(authOptions);

      if (!session || !session.user?.email) {
        throw new UploadThingError("Unauthorized");
      }

      const email = session.user.email;

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // This code RUNS ON YOUR SERVER after upload
        const email = metadata.email;

        console.log(
          `User ${email} has uploaded a new file via the feedback form to ${file.url}!`,
        );

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete`4 callback
        return { file: file.url };
      } catch (error) {
        throw error;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
