import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import  jwt  from "jsonwebtoken";
export const register = async (req, res, next) => {
    try {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'something wrong' });
    }
};




export const login = async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) return next(createError(404, "User not found!"));
  
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect)
        return next(createError(400, "Wrong password or username!"));
  
        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin, },
          "ILOVEANNA",
          { expiresIn: '1h' } 
        );
        console.log('Generated Token:', token);
      const { password, isAdmin, ...otherDetails} = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ details: { details:{...otherDetails, token}, isAdmin }, isAdmin, });
    } catch (err) {
      next(err);
    }
  };

  export const logout = (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ status: 'error', error: 'Internal Server Error' });
      }
  
      res.status(200).json({ status: 'success' });
    });
  };
  


  // const token = jwt.sign(
  //   { id: user._id, isAdmin: user.isAdmin },
  //   "ILOVEANNA",
  //   { expiresIn: '1m' } 
  // );