import User from "../models/adminModel";
import Team from "../models/teamModel";
import Notification from "../models/notification";
import Challenge from "../models/challengeModel";
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
    throw new Error("Phone number or password is incorrect");
  }
  const match = await Bun.password.verify(password, user.password);
  if (!match) {
    set.status = 400;
    throw new Error("Phone number or password is incorrect");
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
    return { message: "Authorized", status: 200, cookie: admin };
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
  const profilePic = body.profilePic;
  const teamLeader = body.teamLeader;
  const teamMembers = body.teamMembers;
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
      profilePic,
      teamLeader,
      teamMembers,
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
const getJudge = async (jwt: any, body: any, set: any, admin: any) => {
  const id = body.id;
  // if (id === "Guest") {
  //   set.status = 200;
  //   return {
  //     team: "Guest",
  //   };
  // }
  const token = await jwt.verify(id);
  let stringValue: string = "";
  for (const key in token) {
    if (Object.prototype.hasOwnProperty.call(token, key) && key !== "exp") {
      stringValue += token[key];
    }
  }

  try {
    const team = await User.findOne({ _id: stringValue });
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
const CreateNotification = async (jwt: any, body: any, set: any) => {
  const name = body.name;
  const description = body.description;
  const photo = body.photo;
  console.log(body);

  try {
    if (photo && photo !== undefined && photo.length > 0) {
      const notification = new Notification({
        name: name,
        description: description,
        photo: photo,
      });
      notification.save();
      set.status = 201;
      return { message: "Notification created", status: 201 };
    }
    const notification = new Notification({
      name: name,
      description: description,
    });
    notification.save();
    set.status = 201;
    return { message: "Notification created", status: 201 };
  } catch (error: any) {
    return error.message;
  }
};
const getTeams = async (set: any) => {
  try {
    const teams = await Team.find({});
    set.status = 200;
    return { teams };
  } catch (error: any) {
    set.status = 500;
    return error.message;
  }
};
const CreateChallenge = async (body: any, set: any, jwt: any) => {
  const name = body.name;
  const type = body.type;
  try {
    const challenge = new Challenge({
      name: name,
      type: type,
    });
    challenge.save();
    set.status = 201;
    return { message: "Challenge created", status: 201 };
  } catch (error) {}
};
const getChallenge = async (body: any, set: any) => {
  const id = body.id;
  try {
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      set.status = 404;
      return "Challenge not found";
    }
    set.status = 200;
    return { challenge };
  } catch (error: any) {
    set.status = 500;
    return error.message;
  }
};
const Dashboard = async (params: any, set: any) => {
  const ChallengeId = params.id;
  try {
    const team = await Team.find({ challenge: ChallengeId })
      .sort({ rating: -1 })
      .exec();
    console.log(team);
    set.status = 200;
    return team;
  } catch (error: any) {
    set.status = 500;
    return error.message;
  }
};
const addRating = async (params: any, body: any, set: any) => {
  const teamId = params.id;
  const rating = body.rating;
  try {
    const team = await Team.findByIdAndUpdate(
      teamId,
      { rating: rating },
      { new: true }
    );
    if (!team) {
      set.status = 404;
      return "Team not found";
    }
    set.status = 200;
    return { message: "Rating added", status: 200 };
  } catch (error: any) {
    set.status = 500;
    return error.message;
  }
};
const UpdeteTeamJudge = async (body: any, set: any, params: any) => {
  const teamId = params.id;
  const judgeId = body.judgeId;
  const judge = await User.find({ role: "judge" });
  const judgeIds = judge.map((jud) => jud._id);

  try {
    // await Team.updateMany({}, { $addToSet: { judge: { $each: judgeIds } } });
    // const hh = await Team.find(teamId);
    // const team = await Team.findByIdAndUpdate(
    //   teamId,
    //   { $push: { judge: judgeId } },
    //   { new: true }
    // );
    // if (!team) {
    //   set.status = 404;
    //   return "Team not found";
    // }
    set.status = 200;
    return { message: "Team leader updated", status: 200 };
  } catch (error: any) {
    set.status = 500;
    return error.message;
  }
};
const teamsByJudge = async (body: any, set: any) => {
  const judgeId = body.id;
  try {
    const team = await Team.find({ judge: judgeId });

    if (!team) {
      set.status = 404;
      return "Team not found";
    }
    set.status = 200;
    return team;
  } catch (error: any) {
    set.status = 500;
    return error.message;
  }
};
export {
  registerUser,
  loginUser,
  addJudge,
  createTeam,
  loginJudge,
  getJudge,
  CreateNotification,
  getTeams,
  CreateChallenge,
  getChallenge,
  Dashboard,
  addRating,
  UpdeteTeamJudge,
  teamsByJudge,
};
