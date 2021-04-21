import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default function (req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;
  const { admin } = jwt.verify(token, process.env.JWT_KEY) as {
    [key: string]: boolean;
  };

  if (admin) {
    //Status is field with a number
    res.json({ secretAdminCode: process.env.JWT_KEY });
  } else {
    //Status is 0 (the account is suspended)
    res.json({ secretAdminCode: false });
  }
}
