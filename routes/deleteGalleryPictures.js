const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const fs = require("fs");
const{getImageId} = require("../joiValidation/validate")
const {
    getError,
    getSuccessData,
    deleteExistigImg,
} = require("../helper_functions/helpers");
const { deleteFile } = require("../s3_bucket/s3_bucket");

router.post("/deleteGalleryPicture", async (req, res) => {
    const { error, value } = getImageId(req.body);
    if (error) {
        return res.status(404).send(getError(error.details[0].message));
    }
    const { imageId } = value;
    try {
        const getImagesOfUser = await prisma.user_gallery.findFirst({
            where: {
                gallery_id: imageId,
                user_id: req.user.user_id,
            },
        });
        if (!getImagesOfUser) return res.status(404).send(getError("Image Not Found"));
        // const file = deleteExistigImg(getImagesOfUser.picture_url);
        const file = await deleteFile(getImagesOfUser.picture_url);
        const delImg = await prisma.user_gallery.delete({
            where: {
                gallery_id: getImagesOfUser.gallery_id,
            },
        });
        return res.status(200).send(getSuccessData("Deleted"));
    }
    catch (err) {
        if (err & err.message ) {
            return res.status(404).send(getError(err.message))
        }
        return res.status(404).send(getError(err));
    }
});


module.exports = router;