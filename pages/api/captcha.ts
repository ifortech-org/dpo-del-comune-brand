import type { NextApiRequest, NextApiResponse } from "next";
import { withHCaptcha } from "next-hcaptcha";

function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ success: true });
}

export default withHCaptcha(handler, {
  envVarNames: { secret: "HCAPTCHA_SECRET_KEY" },
});
