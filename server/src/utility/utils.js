const crypto = require('crypto');
const bcrypt = require("bcryptjs");

const generateEmpCodeAndPassword = async (name, email, department, dob, usersCollection) => {
    // Generate Employee Code
    const baseString = `${name}${email}${department}${Date.now()}`;
    const hash = crypto.createHash("sha256");
    hash.update(baseString);
    let numericPart = hash.digest("hex").slice(0, 8);
    numericPart = parseInt(numericPart, 16).toString().slice(0, 8);
    let employeeCode = `LPIT${numericPart}`;

    // Ensure uniqueness in DB
    const existingEmpCode = await usersCollection.findOne({ employeeCode });
    if (existingEmpCode) {
        return generateEmpCodeAndPassword(name, email, department, dob, usersCollection);
    }

    // Generate Default Password
    const namePart = name.slice(0, 3).toLowerCase(); // First 3 letters of name
    const dobPart = new Date(dob).toLocaleDateString("en-GB").split("/").join(""); // DDMMYY format
    const defaultPassword = `${namePart}${dobPart}`;
    console.log(defaultPassword)

    // 🔹 Hash the password using bcryptjs
    const salt = await bcrypt.genSalt(10); // Generate salt
    const hashedPassword = await bcrypt.hash(defaultPassword, salt); // Hash password
    return { employeeCode, hashedPassword };
};

module.exports = { generateEmpCodeAndPassword }