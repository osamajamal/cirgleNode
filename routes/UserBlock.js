const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const trimRequest = require("trim-request");
const {
    blockProfileValidation
} = require("../joiValidation/validate");
const {
    getError,
    getSuccessData
} = require("../helper_functions/helpers");
const {
    getUserFromId
} = require("../database_queries/auth");
const { userBlock } = require("../socket/socket");

router.post("/blockUser", trimRequest.all, async (req, res) => {
    try {
        const {
            error,
            value
        } = blockProfileValidation(req.body);
        if (error) {
            return res.status(404).send(getError(error.details[0].message));
        }
        const blocker_id = req.user.user_id;
        const {
            blocked_id
        } = value;
        const chkBlocked = await getUserFromId(blocked_id);
        if (!chkBlocked) {
            return res.status(404).send(getError("This user is not in our records."));
        }
        const isUserBlocked = await prisma.blockProfile.findFirst({
            where: {
                blocker_id,
                blocked_id,
            },
        });
        if (isUserBlocked) {
            return res.status(404).send(getError("user already blocked"));
        }
        if (blocked_id == blocker_id) {
            return res.status(404).send(getError("Action not perform on same ID"));
        }
        await prisma.blockProfile.create({
            data: {
                blocker_id,
                blocked_id,
            },
        });
        userBlock(blocker_id, blocked_id, true);
        return res.status(200).send(getSuccessData("You blocked this user successfully"));
    } catch (catchError) {
        if (catchError && catchError.message) {
            return res.status(404).send(getError(catchError.message));
        }
        return res.status(404).send(getError(catchError));
    }
});

router.post("/unblockUser", trimRequest.all, async (req, res) => {
    try {
        const {
            error,
            value
        } = blockProfileValidation(req.body);
        if (error) {
            return res.status(404).send(getError(error.details[0].message));
        }
        const blocker_id = req.user.user_id;
        const {
            blocked_id
        } = value;

        if (blocker_id == blocked_id) {
            return res.status(404).send(getError("Action not perform on same ID"));
        }

        const isUserIBlocked = await prisma.blockProfile.findFirst({
            where: {
                blocker_id,
                blocked_id,
            },
        });
        if (!isUserIBlocked) {
            return res.status(404).send(getError("Record does not Exist"));
        } else {
            await prisma.blockProfile.delete({
                where: {
                    id: isUserIBlocked.id,
                },
            });
        }
        userBlock(blocker_id, blocked_id, false);
        return res.status(200).send(getSuccessData("You Unblock this user successfully"));
    } catch (catchError) {
        if (catchError && catchError.message) {
            return res.status(404).send(getError(catchError.message));
        }
        return res.status(404).send(getError(catchError));
    }
});

router.get("/blockedUsersList", trimRequest.all, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const showBlockedUsers = await prisma.blockProfile.findMany({
            where: {
                blocker_id: user_id,
            },
            select: {
                id: true,
                blocker_id: true,
                blocked_id: true,
                blocked: {
                    select: {
                        user_id: true,
                        fname: true,
                        lname: true,
                        profile_picture: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            }
        });
        return res.status(200).send(showBlockedUsers);
    } catch (error) {
        if (error) {
            return res.status(404).send(getError(error));
        }
    }
});


module.exports = router;