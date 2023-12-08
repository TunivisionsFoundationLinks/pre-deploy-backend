import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import asyncHandler from "express-async-handler";

import createToken from "../middleware/CreateToken.js";
// Register new user
export const registerUser = asyncHandler(async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const matched = req.body.password == req.body.ConfirmPassword;

  if (!matched) {
    res.status(400).json({ message: "password is not matches" });
  } else {
    try {
      const newUser = new UserModel(req.body);
      const { email } = req.body;
      // addition new
      const oldUser = await UserModel.findOne({ email });
      if (oldUser)
        return res.status(400).json({ message: "User already exists" });

      newUser.coverPicture = req.files["coverPicture"][0].filename;
      newUser.profilePicture = req.files["profilePicture"][0].filename;
      // changed
      const user = await newUser.save();

      return res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});
// Register new admin account
export const registerUserAdmin = asyncHandler(async (req, res) => {
  const newUser = new UserModel(req.body);
  const { email } = req.body;
  const { Chapter } = req.body.Chapter;
  const { role } = req.body.role;

  try {
    // addition new
    const oldUser = await UserModel.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const reservedChapter = await UserModel.findOne({
      Chapter: Chapter,
    });

    const reservedRole = await UserModel.findOne({
      role: role,
    });
    if (!reservedChapter && !reservedRole)
      return res.status(400).json({ message: "Role already reserved !!" });

    // changed
    const user = await newUser.save();
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login User

// Changed
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400);
        throw new Error("Invalid e-mail or password");
      } else {
        if (user.Blocked === true) {
          res.status(400);
          throw new Error("your account is blocked");
        }
        const token = jwt.sign(
          { email: user.email, id: user._id },
          process.env.JWTKEY,
          { expiresIn: "7d" }
        );
        res.cookie("token", token, { httpOnly: true, expiresIn: "15d" }); // Set the token as a cookie

        res.status(200).send({ user, token });
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// Changed
export const loginUserAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });
    if (user.isAdmin === true) {
      if (user) {
        const validity = await bcrypt.compare(password, user.password);

        if (!validity) {
          res.status(400).json("wrong password");
        } else {
          const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWTKEY,
            { expiresIn: "15d" }
          );
          res.status(200).send({ user, token });
        }
      } else {
        res.status(404).json("password not correct");
      }
    } else {
      res.status(404).json("you don't have access to this page");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export const sendEmails = asyncHandler(async (req, res) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );
  oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const accessToken = new Promise((resolve, reject) => {
    oAuth2Client.getAccessToken((err, accessToken) => {
      if (err) reject(err);
      resolve(accessToken);
    });
  });

  // email config
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        type: "OAuth2",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "TLINK well be deployed soon",
      text: "message from email",
      html: "<h1>hello every One guess how's back</h1>",
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json(info);
  } catch (error) {
    return res.status(400).json(error);
  }
});

export const sendLinkReset = asyncHandler(async (to, url, text, name) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );
  oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const accessToken = new Promise((resolve, reject) => {
    oAuth2Client.getAccessToken((err, accessToken) => {
      if (err) reject(err);
      resolve(accessToken);
    });
  });

  // email config
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        type: "OAuth2",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: "Reset Password",
      text: text,
      html: `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <title>Forget Password</title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta content="width=device-width" name="viewport" />
  </head>
  <body style="background-color: #f4f4f5">
    <table
      cellpadding="0"
      cellspacing="0"
      style="
        width: 100%;
        height: 100%;
        background-color: #f4f4f5;
        text-align: center;
      "
    >
      <tbody>
        <tr>
          <td style="text-align: center">
            <table
              align="center"
              cellpadding="0"
              cellspacing="0"
              id="body"
              style="
                background-color: #fff;
                width: 100%;
                max-width: 680px;
                height: 100%;
              "
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      cellpadding="0"
                      cellspacing="0"
                      class="page-center"
                      style="
                        text-align: left;
                        padding-bottom: 88px;
                        width: 100%;
                        padding-left: 120px;
                        padding-right: 120px;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            colspan="2"
                            style="
                              padding-top: 72px;
                              -ms-text-size-adjust: 100%;
                              -webkit-font-smoothing: antialiased;
                              -webkit-text-size-adjust: 100%;
                              color: #af0404;
                              font-family: 'Postmates Std', 'Helvetica',
                                -apple-system, BlinkMacSystemFont, 'Segoe UI',
                                'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                                'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                                sans-serif;
                              font-size: 48px;
                              font-smoothing: always;
                              font-style: normal;
                              font-weight: 600;
                              letter-spacing: -2.6px;
                              line-height: 52px;
                              mso-line-height-rule: exactly;
                              text-decoration: none;
                            "
                          >
                            Reset your password
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h1><span>Hey</span> ${name}</h1>
                          </td>
                          <td style="padding-top: 48px; padding-bottom: 48px">
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              style="width: 100%"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      width: 100%;
                                      height: 1px;
                                      max-height: 1px;
                                      background-color: #d9dbe0;
                                      opacity: 0.81;
                                    "
                                  ></td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              -ms-text-size-adjust: 100%;
                              -ms-text-size-adjust: 100%;
                              -webkit-font-smoothing: antialiased;
                              -webkit-text-size-adjust: 100%;
                              color: #9095a2;
                              font-family: 'Postmates Std', 'Helvetica',
                                -apple-system, BlinkMacSystemFont, 'Segoe UI',
                                'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                                'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                                sans-serif;
                              font-size: 16px;
                              font-smoothing: always;
                              font-style: normal;
                              font-weight: 400;
                              letter-spacing: -0.18px;
                              line-height: 24px;
                              mso-line-height-rule: exactly;
                              text-decoration: none;
                              vertical-align: top;
                              width: 100%;
                            "
                          >
                            You're receiving this e-mail because you requested a
                            password reset for your TLink account.
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              padding-top: 24px;
                              -ms-text-size-adjust: 100%;
                              -ms-text-size-adjust: 100%;
                              -webkit-font-smoothing: antialiased;
                              -webkit-text-size-adjust: 100%;
                              color: #9095a2;
                              font-family: 'Postmates Std', 'Helvetica',
                                -apple-system, BlinkMacSystemFont, 'Segoe UI',
                                'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                                'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                                sans-serif;
                              font-size: 16px;
                              font-smoothing: always;
                              font-style: normal;
                              font-weight: 400;
                              letter-spacing: -0.18px;
                              line-height: 24px;
                              mso-line-height-rule: exactly;
                              text-decoration: none;
                              vertical-align: top;
                              width: 100%;
                            "
                          >
                            Please tap the button below to choose a new
                            password.
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <a
                              data-click-track-id="37"
                              href=${url}
                              style="
                                margin-top: 36px;
                                -ms-text-size-adjust: 100%;
                                -ms-text-size-adjust: 100%;
                                -webkit-font-smoothing: antialiased;
                                -webkit-text-size-adjust: 100%;
                                color: #ffffff;
                                font-family: 'Postmates Std', 'Helvetica',
                                  -apple-system, BlinkMacSystemFont, 'Segoe UI',
                                  'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                                  'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                                  sans-serif;
                                font-size: 12px;
                                font-smoothing: always;
                                font-style: normal;
                                font-weight: 600;
                                letter-spacing: 0.7px;
                                line-height: 48px;
                                mso-line-height-rule: exactly;
                                text-decoration: none;
                                vertical-align: top;
                                width: 220px;
                                background-color: #af0404;
                                border-radius: 28px;
                                display: block;
                                text-align: center;
                                text-transform: uppercase;
                              "
                              target="_blank"
                            >
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              cellpadding="0"
              cellspacing="0"
              id="footer"
              style="
                background-color: #af0404;
                width: 100%;
                max-width: 680px;
                height: 100%;
              "
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      cellpadding="0"
                      cellspacing="0"
                      class="footer-center"
                      style="
                        text-align: left;
                        width: 100%;
                        padding-left: 120px;
                        padding-right: 120px;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            colspan="2"
                            style="
                              padding-top: 72px;
                              -ms-text-size-adjust: 100%;
                              -webkit-font-smoothing: antialiased;
                              -webkit-text-size-adjust: 100%;
                              color: #ffffff;
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 32px;
                              font-smoothing: always;
                              font-style: normal;
                              font-weight: 600;
                              letter-spacing: -2.6px;
                              line-height: 52px;
                              mso-line-height-rule: exactly;
                              text-decoration: none;
                            "
                          >
                            Tunivisions Foundation
                          </td>
                        </tr>
                        <tr>
                          <td
                            colspan="2"
                            style="padding-top: 24px; padding-bottom: 48px"
                          >
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              style="width: 100%"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      width: 100%;
                                      height: 1px;
                                      max-height: 1px;
                                      background-color: #eaecf2;
                                      opacity: 0.19;
                                    "
                                  ></td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              -ms-text-size-adjust: 100%;
                              -ms-text-size-adjust: 100%;
                              -webkit-font-smoothing: antialiased;
                              -webkit-text-size-adjust: 100%;
                              color: #ffffff;
                              font-family: 'Postmates Std', 'Helvetica',
                                -apple-system, BlinkMacSystemFont, 'Segoe UI',
                                'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                                'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                                sans-serif;
                              font-size: 15px;
                              font-smoothing: always;
                              font-style: normal;
                              font-weight: 400;
                              letter-spacing: 0;
                              line-height: 24px;
                              mso-line-height-rule: exactly;
                              text-decoration: none;
                              vertical-align: top;
                              width: 100%;
                            "
                          >
                            If you have any questions or concerns, we're here to
                            help. Contact us via our
                            <a
                              data-click-track-id="1053"
                              href="https://www.facebook.com/Tunivisionsfoundation"
                              style="font-weight: 500; color: #cccccc"
                              target="_blank"
                              >Page Facebook</a
                            >.
                          </td>
                        </tr>
                        <tr>
                          <td style="height: 72px"></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info);
    return res.status(200).json(info);
  } catch (error) {
    return error;
  }
});

// for get passwords and sending mail
export const ForgotPassword = asyncHandler(async (req, res) => {
  try {
    // get email
    const { email } = req.body;

    // check email
    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "This email is not registered in our system." });

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWTKEY,
      { expiresIn: "1h" }
    );
    // res.status(200).send({ user, token });
    // create ac token
    const ac_token = createToken.access({ id: user._id });

    // send email
    const url = `http://tlinkfrontend.netlify.app/reset-password/${user._id}/${ac_token}`;
    const name = user.firstname + " " + user.lastname;
    const sended = sendLinkReset(email, url, "Reset your password", name);

    // success
    return res
      .status(200)
      .json({ msg: "Re-send the password, please check your email." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

export const ResetPassword = asyncHandler(async (req, res) => {
  try {
    // get password
    const { password } = req.body;
    const userid = req.params.id;
    // hash password

    const token = req.params.ac_token;
    // update password
    if (token) {
      await UserModel.findOneAndUpdate({ _id: userid }, { password: password });
    }
    // reset success
    res.status(200).json({ msg: "Password was updated successfully." });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export const logoutUser = asyncHandler((req, res) => {
  res.clearCookie("token"); // Clear the token cookie

  // Add any additional logout logic if needed

  res.status(200).json("Logged out successfully");
});
