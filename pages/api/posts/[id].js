import prisma from "@/lib/prisma";
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
  .post(async (req, res) => {
    const { id } = req.query;
    const { imagePublicIds } = req.body;

    await Promise.all(
      imagePublicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
    );

    await prisma.post.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ msg: "post deleted!" });
  })
  .patch(async (req, res) => {
    const { id } = req.query;
    const { caption, onlyMe } = req.body;

    await prisma.post.update({
      where: {
        id,
      },
      data: {
        caption,
        onlyMe: JSON.parse(onlyMe),
      },
    });

    return res.status(200).json({ msg: "success" });
  });

export default handler;
