import User from "../models/adminModel";
// let stringValue: any;
const adminCheck = async (jwt: any, set: any, admin: any) => {
  const cookieadmin = await admin.value;

  // try {
  //   if (cookieadmin === undefined || cookieadmin === null) {
  //     set.status = 401;
  //     return { message: "Unauthorized", status: 401 };
  //   }

  //   const cookieUID = await jwt.verify(cookieadmin);
  //   const id = cookieUID.id;

  //   const user = await User.findById(id);

  //   if (!user) {
  //     set.status = 401;
  //     return { message: "Unauthorized", status: 401 };
  //   }
  //   if (user.role != "admin") {
  //     set.status = 401;
  //     return { message: "Unauthorized, you are not admin", status: 401 };
  //   }
  // } catch (error: any) {
  //   console.log(error);
  //   set.status = 500;
  //   return error.message;
  // }
};
export { adminCheck };
