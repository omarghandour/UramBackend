import User from "../models/adminModel";
let stringValue: any;
const adminCheck = async (jwt: any, set: any, admin: any) => {
  const cookieadmin = await admin.value;

  try {
    if (cookieadmin === undefined || cookieadmin === null) {
      set.status = 401;
      return { message: "Unauthorized", status: 401 };
    }

    const cookieUID = await jwt.verify(cookieadmin);

    for (const key in cookieUID.id) {
      if (
        Object.prototype.hasOwnProperty.call(cookieUID, key) &&
        key !== "exp"
      ) {
        stringValue += cookieUID[key];
      }
    }

    const user = await User.findOne({ id: stringValue });
    console.log(user);

    if (!user || user.role === "judge") {
      set.status = 401;
      return { message: "Unauthorized", status: 401 };
    }
    if (user.role != "admin") {
      set.status = 401;
      return { message: "Unauthorized", status: 401 };
    }
  } catch (error: any) {
    console.log(error);
    set.status = 500;
    return error.message;
  }
  //   const user = await User.find({ role: "admin" });
  //   if (!user) {
  //     set.status = 401;
  //     return { message: "Unauthorized", status: 401 };
  //   }
};
export { adminCheck };
