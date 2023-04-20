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
  .use(upload.any())
  .post(async (req, res) => {
    const { caption, onlyMe, authorId } = req.body;

    console.log(req.body);

    if (!caption) {
      return res.status(400).json({ msg: " caption is required!" });
    }

    if (!authorId) {
      return res.status(400).json({ msg: "authorId is required!" });
    }

    const result = await cloudinary.uploader.upload(req.files[0].path);

    await prisma.post.create({
      data: {
        caption: caption,
        image: result.secure_url,
        onlyMe: JSON.parse(onlyMe),
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });

    return res
      .status(201)
      .json({ data: { caption, image: result.secure_url, onlyMe } });
  });

export default handler;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
