import prisma from "@/lib/prisma";
import { upload } from "@/middlewares/getFormData";
import nc from "next-connect";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("not found");
  },
})
  .use(upload.array("images"))
  .post(async (req, res) => {
    const uploader = async (path) => await cloudinary.uploader.upload(path);
    const { postId } = req.body;

    const imageUrls = [];
    const imageFiles = req.files;

    for (const file of imageFiles) {
      const { path } = file;
      const result = await uploader(path);
      imageUrls.push(result.secure_url);
    }

    for (const url of imageUrls) {
      await prisma.image.create({
        data: {
          url: url,
          post: {
            connect: {
              id: postId,
            },
          },
        },
      });
    }
    return res.status(201).json({ msg: "success" });
  });

export default handler;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
