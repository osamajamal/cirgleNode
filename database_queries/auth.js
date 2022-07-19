const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;

function getUserFromId(id) {
    return prisma.users.findFirst({
        where: {
            user_id: id,
        },
    });
};

function getUserFromEmail(email) {
    return prisma.users.findFirst({
        where: {
            user_email: email,
        }
    })
};

function getUserFromPhone(phoneno) {
    return prisma.users.findFirst({
        where: {
            phoneNo : phoneno,
        }
    })
};

function getAdminFromEmail(email) {
    return prisma.admin.findFirst({
        where: {
            admin_email: email,
        }
    });
};

function getAdminFromId(admin_id) {
    return prisma.admin.findFirst({
        where: {
            admin_id,
        }
    });
};



function getUserFromOtpTable(email) {
    return prisma.otp.findFirst({
        where: {
            user_email: email,
        },
    });
};

function deleteOtp(otp_id) {
    return prisma.otp.delete({
        where: {
            otp_id,
        }
    });
}

function getOtp(otp) {
    return prisma.otp.findFirst({
        where: {
            otpcode: otp,
        }
    });
};

function getUserImages(id) {
    return prisma.user_gallery.findFirst({
        where: {
            user_id: id,
        },
    })
}

module.exports = {
    getUserFromEmail,
    getUserFromPhone,
    getOtp,
    getUserFromId,
    getUserImages,
    getUserFromOtpTable,
    deleteOtp,
    getAdminFromEmail,
    getAdminFromId,
};