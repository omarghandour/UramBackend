import Challenge from "../models/challengeModel";

const createChallenge = async (jwt: any, body: any, set: any, admin: any) => {
  const { name, description } = await body;
  console.log(name, description);
  try {
    const challenge = new Challenge({
      name,
      description,
    });
    challenge.save();
    set.status = 201;
    return {
      message: "Challenge created successfully",
      status: 201,
      challenge: challenge,
    };
  } catch (error: any) {
    set.status = 500;
    return error.message;
  }
};
const updateChallenge = async (jwt: any, body: any, set: any, admin: any) => {
  const { id, name, description } = await body;
  try {
    const challenge: any = await Challenge.findById(id);
    if (!challenge) {
      set.status = 404;
      return {
        message: "Challenge not found",
        status: 404,
      };
    }
    challenge.name = name;
    challenge.description = description;
    challenge.save();
    set.status = 201;
    return {
      message: "Challenge updated successfully",
      status: 201,
      challenge: challenge,
    };
  } catch (error: any) {
    set.status = 500;
    return error.message;
  }
};
const deleteChallenge = async (jwt: any, body: any, set: any, admin: any) => {
  const challengeId = await body.id;
  try {
    const challenge: any = await Challenge.findByIdAndDelete(challengeId);
    set.status = 201;
    return {
      message: "Challenge deleted successfully",
      status: 201,
      challenge: challenge,
    };
  } catch (error: any) {
    set.status = 500;
    return error.message;
  }
};
export { createChallenge, updateChallenge, deleteChallenge };
