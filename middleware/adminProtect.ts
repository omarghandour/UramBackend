import User from "../models/adminModel";

const adminCheck = async (jwt: any, set: any, auth: any) => {
  const a0uth = await auth.value;
  const cookieUID = await jwt.verify(auth.value);

  let stringValue: any = "";
  for (const key in cookieUID) {
    if (Object.prototype.hasOwnProperty.call(cookieUID, key) && key !== "exp") {
      stringValue += cookieUID[key];
    }
  }
  if (stringValue === "") {
    set.status = 401;
    return { message: "Unauthorized", status: 401 };
  }
  try {
    const user = await User.findOne({ stringValue });
    if (!user) {
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
