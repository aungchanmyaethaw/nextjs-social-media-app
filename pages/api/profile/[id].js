import { upload } from "@/middlewares/getFormData";
import nc from "next-connect";

import { v2 as cloudinary } from "cloudinary";
import prisma from "@/lib/prisma";

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
  .use(upload.single("image"))
  .patch(async (req, res) => {
    const { username } = req.body;
    const { id } = req.query;
    const uploader = async (path) => await cloudinary.uploader.upload(path);
    if (!username) {
      return res.status(400).json({ msg: " username is required!" });
    }

    if (req.file) {
      const result = await uploader(req.file.path);

      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          username: username,
          image: result.secure_url,
        },
      });
    } else {
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          username: username,
        },
      });
    }

    res.status(200).json({ msg: "data updated" });
  });

export default handler;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
