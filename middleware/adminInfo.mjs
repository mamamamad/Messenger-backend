import { AdminModel } from "../globalMoudles.mjs";
export async function infoAdmin(req, res, next) {
  try {
    if (!req.adminEmail) return next();

    const result = await AdminModel.adminExistEmail(req.adminEmail);

    res.locals.admin = {
      nickName: result[0].nickName,
      email: result[0].email,
      level: result[0].level,
    };

    next();
  } catch (err) {
    console.error(err);
    next();
  }
}
