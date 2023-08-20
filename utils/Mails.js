import RestPasswordTokens from "../models/resetPassword.js";
// node mailer importation
import nodemailer from "nodemailer";

const frontUrl = "https://tlinkfrontend.netlify.app";

// configuration node mailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTls: true,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendRestEmail = async (email, ref, user) => {
  // console.log(user);
  const userName = user.firstName + " " + user.lastName;
  const resetToken = new RestPasswordTokens({ user, ref });
  // console.log(resetToken._id || resetToken.id);
  await resetToken.save();
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "rest password",
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
                            <h1><span>Hey</span> ${userName}</h1>
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
                              href="${frontUrl}//reset-password/${user._id}/${ac_token}"
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
  });
};

const subject = () => {
  return;
  `
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
</html>`;
};

export default sendRestEmail;
