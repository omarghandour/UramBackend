import User from "../models/adminModel";

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
const registerUser = async (body: any, set: any, jwt: any, auth: any) => {
  createAdminUser();
  const name = body.name;
  const phone = body.phone;
  const password = body.password;
  const role = body.role;
  const salt: any = process.env.SALT;
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: +salt, // number between 4-31
  });
};
export { registerUser };
