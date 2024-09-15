const User = require('../model/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    // console.log(req.body);
    try {
        const { username, email, password } = req.body;
        const userNameCheck = await User.findOne({ username });
        if (userNameCheck) {
            return res.json({ msg: "Username already existed", status: false })
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.json({ msg: "Email already existed", status: false })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        })
        delete user.password;
        // console.log(user);
        return res.json({ status: true, user });
    } catch (err) {
        console.log("error in creating user")
        next(err);
    }
}


module.exports.login = async (req, res, next) => {
    // console.log(req.body);
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ msg: "Username or password is incorrect", status: false })
        }
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            return res.json({ msg: "Username or password is incorrect", status: false })
        }
        delete user.password;
        // console.log(user);
        return res.json({ status: true, user });
    } catch (err) {
        console.log("error in creating user")
        next(err);
    }
}


module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        // console.log()
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        })
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage
        })
    } catch (err) {
        console.log("error in setting avatar")
        next(err);
    }
}


module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email", "username", "avatarImage", "_id"
        ])
        return res.json(users);
    } catch (err) {
        next(err);
    }
}

module.exports.logOut = async (req, res, next) => {
    try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      onlineUsers.delete(req.params.id);
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  };