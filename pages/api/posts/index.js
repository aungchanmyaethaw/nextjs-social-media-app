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
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("not found");
  },
})
  .use(upload.array("images"))
  .post(async (req, res) => {
    const { caption, onlyMe, authorId } = req.body;

    if (!caption) {
      return res.status(400).json({ msg: " caption is required!" });
    }

    if (!authorId) {
      return res.status(400).json({ msg: "authorId is required!" });
    }

    const uploader = async (path) => await cloudinary.uploader.upload(path);

    const { id: postId } = await prisma.post.create({
      data: {
        caption: caption,
        onlyMe: JSON.parse(onlyMe),
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });

    const imageUrls = [];
    const imageFiles = req.files;

    for (const file of imageFiles) {
      const { path } = file;
      const result = await uploader(path);
      imageUrls.push({ url: result.secure_url, publicId: result.public_id });
    }

    for (const url of imageUrls) {
      await prisma.image.create({
        data: {
          url: url.url,
          publicId: url.publicId,
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
