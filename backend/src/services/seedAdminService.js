const Admin = require("../models/Admin");

async function seedDefaultAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    return;
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return;
  }

  await Admin.create({
    name,
    email,
    password,
    role: "admin"
  });

  console.log(`Default admin created for ${email}`);
}

module.exports = {
  seedDefaultAdmin
};
