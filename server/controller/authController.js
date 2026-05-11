const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // ← was missing
const User = require('../model/auth');

async function signUp(req, res) {
  try {
    const body = req.body;

    if (!body.fullname || !body.email || !body.password) {
      return res.status(400).json({ message: 'Please fill all the fields' });
    }

    if (await User.findOne({ email: body.email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hash = await bcrypt.hash(body.password, 10);

    const user = new User({
      fullname: body.fullname,
      email: body.email,
      password: hash,
    });

    await user.save(); // ← was missing, user was never saved to DB

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.fullname },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { name: user.fullname, email: user.email } });

  } catch (err) {
    console.error('SignUp error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}

async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all the fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email. Please register first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.fullname },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Login successful for user:', user.email);
    res.json({ token, user: { name: user.fullname, email: user.email } });

  } catch (err) {
    console.error('SignIn error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}

module.exports = { signUp, signIn };