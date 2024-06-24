import User from "../models/adminModel";
import Team from "../models/teamModel";
// import { Client, Account, ID } from "appwrite";
// const endPoint: any = process.env.APPWRITEENDPOINT;
// const pID: any = process.env.APPWRITEPID;
// const client = new Client().setEndpoint(endPoint).setProject(pID);
const ENVIRONMENT = process.env.NODE_ENV || "development";

const signupTeam = async (
  body: any,
  set: any,
  jwt: any,
  auth: any,
  admin: any
) => {
  const phone = body.phone;
  const password = body.password;
  // USE BCRYPT

  const salt: any = process.env.SALT;
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: +salt, // number between 4-31
  });
  try {
    const length: number = password.length;
    const Admin = await User.findOne({ phone });
    const user = await Team.findOne({ phone });
    if (length < 8) {
      set.status = 400;
      return "Password must be at least 8 characters long";
    }
    const hash: any = user?.password;
    const adminHash = Admin?.password;
    if (Admin) {
      const isMatch = await Bun.password.verify(password, adminHash || "");
      if (!Admin || !isMatch) {
        set.status = 400;
        return "Invalid username or password";
      } else {
        admin.set({
          value: await jwt.sign(Admin.id),
          httpOnly: true,
          maxAge: 15 * 24 * 60 * 60,
          secure: true,
          sameSite: "lax",
          path: "/",
        });
        return {
          message: "Logged in successfully",
          user: user,
          cookie: auth,
        };
        set.status = 200;
      }
    }
    if (user) {
      const isMatch = await Bun.password.verify(password, hash || "");
      if (!user || !isMatch) {
        set.status = 400;
        return "Invalid username or password";
      } else {
        auth.set({
          value: await jwt.sign(user.id),
          httpOnly: true,
          maxAge: 15 * 24 * 60 * 60,
          secure: true,
          sameSite: "lax",
          path: "/",
        });
        return {
          message: "Logged in successfully",
          user: user,
          cookie: auth,
        };
        set.status = 200;
      }
    }
    const createTeam = await Team.create({
      phone: phone,
      password: hashedPassword,
    });
    await createTeam.save();

    set.status = 201;
    if (createTeam) {
      auth.set({
        value: await jwt.sign(createTeam.id),
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60,
        secure: ENVIRONMENT === "production",
        sameSite: ENVIRONMENT === "production" ? "none" : "lax",
        path: "/",
      });
      return {
        status: 201,
        message: "Team created successfully",
        data: createTeam,
        cookie: auth,
      };
    }
  } catch (error: any) {
    set.status = 500;

    return error.message;
  }
};
const verifyPhone = async (body: any, set: any, jwt: any, auth: any) => {
  const phone = body.phone;

  const userId = body.userId;
  const secret = body.secret;
  // const account = new Account(client);

  try {
    // const session = await account.createSession(userId, secret);
  } catch (error: any) {
    set.status = 500;
    return error.message;
  }
};
const loginTeam = async (jwt: any, body: any, set: any, auth: any) => {
  const phone = body.phone;
  const password = body.password;
  try {
    const team = await Team.findOne({ phone });

    const hash: any = team?.password;
    const isMatch = await Bun.password.verify(password, hash || "");
    if (!team || !isMatch) {
      set.status = 400;
      return "Invalid username or password";
    }
    const cookieUID = await jwt.verify(auth.value, team.id);
    let stringValue: any = "";
    for (const key in cookieUID) {
      if (
        Object.prototype.hasOwnProperty.call(cookieUID, key) &&
        key !== "exp"
      ) {
        stringValue += cookieUID[key];
      }
    }
    if (stringValue === team.id) {
      set.status = 400;
      return "User already logged in";
    }
    auth.set({
      value: await jwt.sign(team.id),
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60,
      secure: ENVIRONMENT === "production",
      sameSite: ENVIRONMENT === "production" ? "none" : "lax",
      path: "/",
    });

    return {
      message: "Logged in successfully",
      id: team._id,
      name: team.name,
      phone: team.phone,
      profilePic: team.profilePic,
      teamLeader: team.teamLeader,
      teamMembers: team.teamMembers,
    };
    set.status = 200;
  } catch (error: any) {
    set.status = 500;
    return error.message;
  }
};

const getTeam = async (body: any, set: any, jwt: any) => {
  const id = body.id;
  if (id === "Guest") {
    set.status = 200;
    return {
      team: "Guest",
    };
  }
  const token = await jwt.verify(id);
  let stringValue: string = "";
  for (const key in token) {
    if (Object.prototype.hasOwnProperty.call(token, key) && key !== "exp") {
      stringValue += token[key];
    }
  }

  try {
    const team = await Team.findOne({ _id: stringValue });
    if (!team) {
      set.status = 404;
      return "Team not found";
    }
    return { team };
    set.status = 200;
  } catch (error: any) {
    set.status = 500;
    return error.message;
  }
};

const updateTeam = async (body: any, set: any, jwt: any) => {
  const id = body.id;
  const name = body.name;
  const profilePic = body.profilePic;
  const teamLeader = body.teamLeader;
  // const teamMembers = body.teamMembers;
  const password = body.password;

  const token = await jwt.verify(id);
  let stringValue: string = "";
  for (const key in token) {
    if (Object.prototype.hasOwnProperty.call(token, key) && key !== "exp") {
      stringValue += token[key];
    }
  }
  const salt: any = process.env.SALT;
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: +salt, // number between 4-31
  });
  try {
    const team = await Team.findOne({ _id: id });
    if (!team) {
      set.status = 404;
      return "Team not found";
    }
    team.name = name;
    team.profilePic = profilePic;
    team.teamLeader = teamLeader;
    team.password = hashedPassword;
    // team.teamMembers = teamMembers;

    await team.save();
    set.status = 200;
    return {
      message: "Team updated successfully",
      team,
    };
  } catch (error: any) {
    set.status = 500;
    return error.message;
  }
};
export { signupTeam, loginTeam, verifyPhone, getTeam, updateTeam };
