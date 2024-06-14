import Team from "../models/teamModel";

const signupUser = async (body: any, set: any, jwt: any, auth: any) => {
  const name = body.name;
  const phone = body.phone;
  const password = body.password;
  // USE BCRYPT
  const salt: any = process.env.SALT;
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: +salt, // number between 4-31
  });
  try {
    const user = await Team.findOne({ phone });
    if (user) {
      set.status = 400;
      return "User already exists";
    }
    const createTeam = await Team.create({
      name: name,
      phone: phone,
      password: hashedPassword,
    });
    await createTeam.save();
    const pic = await createTeam.profilePic;
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
  } catch (error: any) {
    set.status = 500;
    return error.message;
  }
};

export { signupUser };
