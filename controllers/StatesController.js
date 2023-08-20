import fs from "fs"
import asyncHandler from "express-async-handler"
export const GetRegion = asyncHandler(async (req, res) => {
  fs.readFile(`./models/States.js`, 'utf8', function (err, data) {
    if (err) {
      console.error(err);
      res.status(400).send(err.message);
    } else {
      res.status(200).send(data);
    }
  });

});