const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const trimRequest = require("trim-request");
const { getUserFromId } = require("../database_queries/auth");
const { getEnv } = require("../config");
const {
  getError,
  getSuccessData,
  deleteUploadedImage,
} = require("../helper_functions/helpers");
const { uploadFile } = require("../s3_bucket/s3_bucket");


router.post("/addGalleryImages",[trimRequest.all, uploadImage],async (req, res) => {
    try {
      console.log("addGalleryImages");
      console.log("req", req);
      console.log("req.files", req.files);
      console.log("req.files?.gallery", req.files?.["gallery"]);
      if (!req.files?.["gallery"]) {
        return res.status(404).send(getError("Please send images"));
      }
      const files = [];
      const user_id = req.user.user_id;
      const findUser = await getUserFromId(user_id);
      if (!findUser) {
        deleteUploadedImage(req);
        return res.status(404).send(getError("User not found"));
      }
      const countUserPictures = await prisma.users.findMany({
        where: {
          user_id,
        },
        select: {
          _count: {
            select: {
              user_pictures: true,
            },
          },
        },
      });
      if (req.file_error) {
        deleteUploadedImage(req);
        return res.status(404).send(getError(req.file_error));
      }
      const chkReqImages = req.files?.["gallery"]?.length;
      const allowedImages = countUserPictures[0]._count.user_pictures + chkReqImages;
      if (allowedImages > 10) {
        deleteUploadedImage(req);
        return res
          .status(404)
          .send(getError("You cannot select more than 10 pictures."));
      }
      // gallery code for uploading gallery
      // if (req.files?.["gallery"]) {
      //   req.files?.["gallery"].forEach((file) => {
      //     const fileName = file ? file.filename : null;
      //     if (fileName) {
      //       files.push({
      //         user_id,
      //         picture_url: fileName,
      //       });
      //     }
      //   });
      // }
      // s3 bucket for gallery update
      if (req.files?.["gallery"]) {
        for (const file of req.files["gallery"]) {
          if (file) {
            let {Location} = await uploadFile(file);
            files.push({
              user_id,
              picture_url: Location,
            });
          }
        }
      }
      console.log("files", files);
      const updateGallery = await prisma.user_gallery.createMany({
        data: files,
      });
      console.log("updateGallery::", updateGallery);
      if (updateGallery)
        return res.status(200).send(getSuccessData("Upload successfull."));
    } catch (err) {
      if (err & err.message) {
        return res.status(404).send(getError(err.message));
      }
      return res.status(404).send(getError(err));
    }
  }
);

module.exports = router;
