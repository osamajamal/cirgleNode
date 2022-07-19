const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const trimRequest = require("trim-request");
const { filterValidation } = require("../joiValidation/validate");
const {
  getError,
  getSuccessData,
  getDistanceFromLatLonInKm,
} = require("../helper_functions/helpers");
var _ = require("lodash");
const { AdminApproval } = require("@prisma/client");
const { parseInt } = require("lodash");

// router.post("/UpdateMyFilters", trimRequest.all, async (req, res) => {
//   const body = req.body;
//   try {
//     const user_id = req.user.user_id;
//     const {
//       error,
//       value
//     } = filterValidation(body);
//     if (error) {
//       return res.status(404).send(getError(error.details[0].message));
//     }

//     const {
//       interested_in: _interested_in,
//       start_age: _start_age,
//       last_age: _last_age,
//       start_height: _start_height,
//       end_height: _end_height,
//       childern: _childern,
//       other_filter: _other_filter
//     } = value;

//     const interested_in = _interested_in.toLowerCase()
//     const start_age = _start_age.toLowerCase()
//     const last_age = _last_age.toLowerCase()
//     const start_height = _start_height.toLowerCase()
//     const end_height = _end_height.toLowerCase()
//     const childern = _childern.toLowerCase()
//     const other_filter = _other_filter.toLowerCase()

//     const my_filters = {
//       interested_in,
//       start_age,
//       last_age,
//       start_height,
//       end_height,
//       childern,
//       other_filter,
//     }
//     const isExist = await prisma.filters.findFirst({
//       where: {
//         user_id,
//       }
//     })
//     if (isExist) {
//       await prisma.filters.update({
//         where: {
//           id: isExist.id
//         },
//         data: {
//           filters: JSON.stringify(my_filters),
//         }
//       });
//     } else {
//       await prisma.filters.create({
//         data: {
//           user_id,
//           filters: JSON.stringify(my_filters),
//         }
//       });
//     }
//     return res.status(200).send(getSuccessData("Filters added successfully"));
//   } catch (err) {
//     if (err & err.message) {
//       return res.status(404).send(getError(err.message));
//     }
//     return res.status(404).send(getError(err));
//   }
// });

// router.get("/GetMyFilters", trimRequest.all, async (req, res) => {
//   try {
//     const user_id = req.user.user_id;

//     const my_filters = await prisma.filters.findFirst({
//       where: {
//         user_id,
//       }
//     })
//     if (!my_filters) {
//       return res.status(404).send(getError("No, filters exist Please update your filters"));
//     }

//     my_filters.filters = JSON.parse(my_filters.filters)
//     return res.status(200).send(getSuccessData(my_filters));
//   } catch (err) {
//     if (err & err.message) {
//       return res.status(404).send(getError(err.message));
//     }
//     return res.status(404).send(getError(err));
//   }
// });

router.post("/ShowFilteredUsers", trimRequest.all, async (req, res) => {
  // console.log("response from body:::",req.body);
  try {
    const user_id = req.user.user_id;
    var user = req.user;
    const my_lat = user.latitude;
    const my_lon = user.longitude;
    const { error, value } = filterValidation(req.body);
    if (error) {
      return res.status(404).send(getError(error.details[0].message));
    }
    if (user?.account_types == "free") {
      return res.status(404).send(getError("You are free user! please purchase plan to continue."));
    }
    let {
      interested_in: _interested_in,
      start_age,
      end_age,
      childern: _childern,
      other_filter: _other_filter,
      other_info: _other_info,
      looking_for_something: _looking_for_something,
    } = value;

    const interested_in = _interested_in?.toLoweCase();
    const childern = _childern?.toLoweCase();
    const other_filter = _other_filter.toLoweCase();
    const other_info = _other_info.toLoweCase();
    const looking_for_something = _looking_for_something.toLoweCase();
    // let first_age = parseInt(start_age);
    // let last_age = parseInt(end_age);

    // const chkFilters = await prisma.filters.findFirst({
    //   where: {
    //     user_id,
    //   },
    // });
    // chkFilters.filters = JSON.parse(chkFilters.filters);
    // const filters = chkFilters.filters;
    // console.log(filters);
    // if (!chkFilters) {
    //   return res.status(404).send(getError("You haven't select any filter."));
    // }
    // if (interested_in == "everyone") {
    //   interested_in = null;
    //   console.log("interested_in", interested_in);
    //   }
    if (interested_in == "everyone") {
      const filteredUsers = await prisma.users.findMany({
        where: {
          NOT: [
            {
              user_id,
            },
            {
              user_blocked_me: {
                some: {
                  blocker_id: user_id,
                },
              },
            },
            {
              user_i_block: {
                some: {
                  blocked_id: user_id,
                },
              },
            },
          ],
          OR: [
            {
              birthday: {
                lte: start_age ? start_age : 0,
                gte: end_age ? end_age : 0,
              },
            },
            {
              have_kids: childern,
            },
            {
              smoking: other_filter,
            },
            {
              other_info,
            },
            {
              looking_for_something,
            },
            {
              is_registered: true,
            },
            {},
          ],
          admin_approval: AdminApproval.APPROVED,
          is_registered: true,
        },
        select: {
          user_id: true,
          fname: true,
          lname: true,
          profile_picture: true,
          country: true,
          nationality: true,
          gender: true,
          city: true,
          latitude: true,
          longitude: true,
          education: true,
          height: true,
          birthday: true,
          online_status: true,
          online_status_time: true,
          show_private_pictures: true,
          account_types: true,
          user_pictures: {
            select: {
              gallery_id: true,
              picture_url: true,
            },
            orderBy: {
              updated_at: "desc",
            },
          },
          user_passions: {
            select: {
              passions_id: true,
              passions: true,
            },
          },
          likes: {
            where: {
              to_id: user_id,
            },
          },
          likers: {
            where: {
              from_id: user_id,
            },
          },
          i_super_likes: {
            where: {
              to_id: user_id,
            },
          },
          super_likes_on_me: {
            where: {
              from_id: user_id,
            },
          },
        },
        orderBy: [
          {
            online_status: "asc",
          },
          {
            online_status_time: "desc",
          },
        ],
      });

      filteredUsers?.forEach((arr) => {
        if (arr.latitude && arr.longitude) {
          arr.distance = getDistanceFromLatLonInKm(
            arr.latitude,
            arr.longitude,
            my_lat,
            my_lon
          );
        }
        if (arr?.likers?.length > 0) {
          arr.is_liked = true;
          delete arr.likers;
        } else {
          arr.is_liked = false;
          delete arr.likers;
        }
        if (arr?.super_likes_on_me?.length > 0) {
          arr.is_super_liked = true;
          delete arr.super_likes_on_me;
        } else {
          arr.is_super_liked = false;
          delete arr.super_likes_on_me;
        }
      });
      const sorted_users = _.orderBy(
        filteredUsers,
        ["distance", "online_status"],
        ["asc", "desc"]
      );
      return res.status(200).send(getSuccessData(sorted_users));
    }
    const filteredUsers = await prisma.users.findMany({
      where: {
        NOT: [
          {
            user_id,
          },
          {
            user_blocked_me: {
              some: {
                blocker_id: user_id,
              },
            },
          },
          {
            user_i_block: {
              some: {
                blocked_id: user_id,
              },
            },
          },
        ],
        OR: [
          {
            birthday: {
              lte: start_age ? start_age : 0,
              gte: end_age ? end_age : 0,
            },
          },
          {
            gender: interested_in ? interested_in : null,
          },
          {
            have_kids: childern ? childern : null,
          },
          {
            smoking: other_filter ? other_filter : null,
          },
          {
            other_info,
          },
          {
            looking_for_something,
          }
        ],
        admin_approval: AdminApproval.APPROVED,
        is_registered: true,
      },
      select: {
        user_id: true,
        fname: true,
        lname: true,
        profile_picture: true,
        country: true,
        nationality: true,
        gender: true,
        city: true,
        latitude: true,
        longitude: true,
        education: true,
        height: true,
        birthday: true,
        online_status: true,
        online_status_time: true,
        show_private_pictures: true,
        account_types: true,
        user_pictures: {
          select: {
            gallery_id: true,
            picture_url: true,
          },
          orderBy: {
            updated_at: "desc",
          },
        },
        user_passions: {
          select: {
            passions_id: true,
            passions: true,
          },
        },
        likes: {
          where: {
            to_id: user_id,
          },
        },
        likers: {
          where: {
            from_id: user_id,
          },
        },
        i_super_likes: {
          where: {
            to_id: user_id,
          },
        },
        super_likes_on_me: {
          where: {
            from_id: user_id,
          },
        },
      },
      orderBy: [
        {
          online_status: "asc",
        },
        {
          online_status_time: "desc",
        },
      ],
    });

    filteredUsers?.forEach((arr) => {
      if (arr.latitude && arr.longitude) {
        arr.distance = getDistanceFromLatLonInKm(
          arr.latitude,
          arr.longitude,
          my_lat,
          my_lon
        );
      }
      if (arr?.likers?.length > 0) {
        arr.is_liked = true;
        delete arr.likers;
      } else {
        arr.is_liked = false;
        delete arr.likers;
      }
      if (arr?.super_likes_on_me?.length > 0) {
        arr.is_super_liked = true;
        delete arr.super_likes_on_me;
      } else {
        arr.is_super_liked = false;
        delete arr.super_likes_on_me;
      }
    });
    const sorted_users = _.orderBy(
      filteredUsers,
      ["distance", "online_status"],
      ["asc", "desc"]
    );
    return res.status(200).send(getSuccessData(sorted_users));
  } catch (error) {
    if (error) {
      return res.status(404).send(getError(error));
    }
  }
});

//
module.exports = router;
