import Team from "../models/teamModel";
import { Client, Account, ID } from "appwrite";
const endPoint: any = process.env.APPWRITEENDPOINT;
const pID: any = process.env.APPWRITEPID;
const client = new Client().setEndpoint(endPoint).setProject(pID);

const signupTeam = async (body: any, set: any, jwt: any, auth: any) => {
  const phone = body.phone;

  try {
    const user = await Team.findOne({ phone });
    if (user) {
      set.status = 400;
      return "User already exists";
    }
    //  app write
    const account = new Account(client);

    const token = await account.createPhoneToken(ID.unique(), phone);
    set.status = 200;
    return token;
  } catch (error: any) {
    set.status = 500;

    return error.message;
  }
};
const verifyPhone = async (body: any, set: any, jwt: any, auth: any) => {
  const name = body.name;
  const phone = body.phone;
  const teamLeader = body.teamLeader;
  const profilePic = body.profilePic;
  const password = body.password;
  // USE BCRYPT
  const salt: any = process.env.SALT;
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: +salt, // number between 4-31
  });
  const userId = body.userId;
  const secret = body.secret;
  const account = new Account(client);

  try {
    const session = await account.createSession(userId, secret);
    if (session) {
      const createTeam = await Team.create({
        name: name,
        phone: phone,
        password: hashedPassword,
        teamLeader: teamLeader,
        profilePic: profilePic,
      });
      await createTeam.save();

      const pic = createTeam.profilePic;
      set.status = 201;
      if (createTeam) {
        auth.secrets = jwt;
        auth.value = createTeam.id;
        auth.httpOnly = true;
        auth.maxAge = 15 * 24 * 60 * 60;
        auth.sameSite = "strict";
        return {
          id: createTeam._id,
          name: createTeam.name,
          profilePic: pic,
          teamLeader: createTeam.teamLeader,
          teamMembers: createTeam.teamMembers,
        };
      }
    }
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
    auth.set({
      value: await jwt.sign(team.id),
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60,
      sameSite: "strict",
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
