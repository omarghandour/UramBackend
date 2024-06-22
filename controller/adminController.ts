import User from "../models/adminModel";
import Team from "../models/teamModel";

// Predefined admin credentials
const adminUsername = "UramIt";
const adminPassword = "UramITEG";

// Create the predefined admin user if not exists
const createAdminUser = async () => {
  const adminUser = await User.findOne({ phone: adminUsername });
  if (!adminUser) {
    const salt: any = process.env.SALT;
    const hashedPassword = await Bun.password.hash(adminPassword, {
      algorithm: "bcrypt",
      cost: +salt, // number between 4-31
    });
    const admin = new User({
      name: adminUsername,
      phone: adminUsername,
      password: hashedPassword,
      role: "admin",
    });
    await admin.save();
    console.log("Admin user created");
  }
};
createAdminUser();
const registerUser = async (jwt: any, body: any, set: any, admin: any) => {
  const name = body.name;
  const phone = body.phone;
  const password = body.password;
  const salt: any = process.env.SALT;
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: +salt, // number between 4-31
  });
  try {
    const user: any = await User.findOne({ phone });

    if (user) {
      set.status = 400;
      return "User already exists";
    }
    const userAdmin = new User({
      name,
      phone,
      password: hashedPassword,
      role: "admin",
    });
    userAdmin.save();
    const id = userAdmin.id;

    const token = await jwt.sign({ id });
    admin.set({
      value: token,
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60,
      sameSite: "strict",
      secure: true,
      path: "/",
    });
    set.status = 200;
    return { message: "User created", status: 200 };
  } catch (error: any) {
    console.log(error.message);

    return error.message;
  }
};
const loginUser = async (body: any, set: any, jwt: any, admin: any) => {
  const phone = body.phone;
  const password = body.password;
  const user: any = await User.findOne({ phone });

  if (!user) {
    set.status = 400;
    return "Phone number or password is incorrect";
  }
  const match = await Bun.password.verify(password, user.password);
  if (!match) {
    set.status = 400;
    return "Phone number or password is incorrect";
  }

  const id: any = user.id;
  try {
    const token = await jwt.sign({ id });

    admin.set({
      value: token,
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60,
      sameSite: "strict",
      secure: true,
      path: "/",
    });
    set.status = 200;
    return { message: "Authorized", status: 200 };
  } catch (error: any) {
    return error.message;
  }
};
const addJudge = async (jwt: any, body: any, set: any, admin: any) => {
  const name = body.name;
  const phone = body.phone;
  const password = body.password;
  const salt: any = process.env.SALT;
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: +salt, // number between 4-31
  });
  const judge = await User.findOne({ phone });

  try {
    if (judge) {
      set.status = 400;
      return "Judge already exists";
    }
    const userJudge = new User({
      name,
      phone,
      password: hashedPassword,
      role: "judge",
    });
    userJudge.save();

    set.status = 200;
    return { message: "Judge created", status: 200, judge: { userJudge } };
  } catch (error: any) {
    return error.message;
  }
};
const createTeam = async (jwt: any, body: any, set: any, admin: any) => {
  const name = body.name;
  const phone = body.phone;
  const password = body.password;
  const salt: any = process.env.SALT;
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: +salt, // number between 4-31
  });
  const team = await Team.findOne({ phone });

  try {
    if (team) {
      set.status = 400;
      return "Team already exists";
    }
    const userTeam = new Team({
      name,
      phone,
      password: hashedPassword,
    });
    userTeam.save();
    const id: any = userTeam.id;
    set.status = 200;
    return {
      message: "Team created",
      status: 200,
      team: { userTeam },
      id: userTeam.id,
    };
  } catch (error: any) {
    return error.message;
  }
};
const loginJudge = async (jwt: any, body: any, set: any, admin: any) => {
  const phone = body.phone;
  const password = body.password;
  if (
    phone === undefined ||
    phone === null ||
    password === undefined ||
    password === null
  ) {
    set.status = 400;
    return "Phone number or password is incorrect";
  }
  const judge: any = await User.findOne({ phone });
  if (!judge) {
    set.status = 400;
    return "Phone number or password is incorrect";
  }
  const id: any = judge.id;
  const match = await Bun.password.verify(password, judge.password);
  if (!match) {
    set.status = 400;
    return "Phone number or password is incorrect";
  }
  const token = await jwt.sign({ id });

  admin.set({
    value: token,
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60,
    sameSite: "strict",
    secure: true,
    path: "/",
  });
  set.status = 200;
  return {
    message: "Authorized",
    status: 200,
    judge: { judge },
    id: judge.id,
  };
};
export { registerUser, loginUser, addJudge, createTeam, loginJudge };
