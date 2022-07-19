const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const {
    getEnv
} = require("../config");
const {
    getError,
    getSuccessData,
    deleteExistigImg,
    deleteUploadedImage,
} = require("../helper_functions/helpers");
const trimRequest = require("trim-request");
const { getUserFromId } = require("../database_queries/auth");
const { uploadFile,deleteFile } = require("../s3_bucket/s3_bucket");
const fs = require("fs");

router.post("/updateUserProfilePic", [uploadImage,trimRequest.all], async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const findUser = await getUserFromId(user_id);
        if (!findUser) {
            deleteUploadedImage(req);
            return res.status(404).send(getError("User not found."));
        }
        if (req.file_error) {
            deleteUploadedImage(req);
            return res.status(404).send(getError(req.file_error));
        }
        if (!req.files?.["profile"]) {
            return res.status(404).send(getError("Please select profile first."));
        }
        // const profile_picture = req.files?.["profile"][0].filename ? req.files["profile"][0].filename : null;
         const getExistingImage = findUser.profile_picture;
         if (!getExistingImage) {
             deleteUploadedImage(req);
             return res.status(404).send(getError("Image not found."));
            }
         const replaceImage = await deleteFile(getExistingImage);
         // s3 bucket for profile
            if (req.files?.["profile"]) {
                for (const file of req.files["profile"]) {
                  if (file) {
                    let {Location} = await uploadFile(file);
                    var profile_picture = Location;
                    }
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                }
              }
        const updateImg = await prisma.users.update({
            where: {
                user_id,
            },
            data: {
                profile_picture,
            },
        });
        if (updateImg) {
            return res.status(200).send(getSuccessData("image updated successfull."));
        }
    }
    catch (err) {
        if (err & err.message) {
            deleteFile(profile_picture);
            deleteUploadedImage(req);
            return res.status(404).send(getError(err.message));
        }
        deleteFile(profile_picture);
        deleteUploadedImage(req);
        return res.status(404).send(getError(err));
    }
});

module.exports = router;