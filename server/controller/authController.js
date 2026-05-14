const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/auth");

async function signUp(req, res) {
  try {
    const body = req.body;

    if (!body.fullname || !body.email || !body.password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (await User.findOne({ email: body.email })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(body.password, 10);

    const user = new User({
      fullname: body.fullname,
      email: body.email,
      password: hash,
    });

    await user.save();

    // CREATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        name: user.fullname,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    res.json({
      user: {
        name: user.fullname,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("SignUp error:", err);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
}

async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email. Please register first.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect password. Please try again." });
    }

    // CREATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        name: user.fullname,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    console.log("Login successful for user:", user.email);

    res.cookie("token", token, cookieOptions);

    res.json({
      user: {
        name: user.fullname,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("SignIn error:", err);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
}

module.exports = { signUp, signIn };
