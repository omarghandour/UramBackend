import Team from "../models/teamModel";
// import { Client, Account, ID } from "appwrite";
// const endPoint: any = process.env.APPWRITEENDPOINT;
// const pID: any = process.env.APPWRITEPID;
// const client = new Client().setEndpoint(endPoint).setProject(pID);

const signupTeam = async (body: any, set: any, jwt: any, auth: any) => {
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
    const user = await Team.findOne({ phone });
    if (length < 8) {
      set.status = 400;
      return "Password must be at least 8 characters long";
    }
    if (user) {
      set.status = 400;
      return "User already exists";
    }
    const createTeam = await Team.create({
      phone: phone,
      password: hashedPassword,
    });
    await createTeam.save();

    set.status = 201;
    if (createTeam) {
      // auth.secrets = jwt;
      // auth.value = createTeam.id;
      // auth.httpOnly = true;
      // auth.maxAge = 15 * 24 * 60 * 60;
      // auth.sameSite = "strict";
      auth.set({
        value: await jwt.sign(createTeam.id),
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60,
        sameSite: "none",
        secure: false,
        path: "/",
      });
      return {
        status: 201,
        message: "Team created successfully",
        id: createTeam._id,
        phone: createTeam.phone,
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
      sameSite: "none",
      secure: true,
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
export { signupTeam, loginTeam, verifyPhone };
