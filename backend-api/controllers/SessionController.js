exports.newSession = async (req, res) => {
  console.log(req.body);
  if (
    req.body.LoginEmail === undefined ||
    req.body.LoginPassword === undefined
  ) {
    var missingparams = "";
    if (!req.body.LoginEmail) {
      missingparams += " No email provided.";
    }
    if (!req.body.LoginPassword) {
      missingparams += " No password provided.";
    }
    return res
      .status(400)
      .json({ error: "Missing parameters for logging in." + missingparams });
  }
  LoginEmail = req.body.LoginEmail;
  console.log(LoginEmail);
  var userToProvideSessionFor = await db.users.findOne({
    where: { EmailAddress: LoginEmail },
  });
  if (!userToProvideSessionFor) {
    return res.status(401).send({ error: "User not found." });
  }
  var isCorrect = await Utilities.letMeIn(
    req.body.LoginPassword,
    userToProvideSessionFor.PasswordHASH
  );
  if (!isCorrect) {
    return res.status(401).send({ error: "Incorrect password." });
  }
  req.session.UserID = userToProvideSessionFor.UserID;

  return res.status(200).send({
    UserID: userToProvideSessionFor.UserID,
    FullName: userToProvideSessionFor.FullName,
    EmailAddress: userToProvideSessionFor.EmailAddress,
    UserName: userToProvideSessionFor.UserName,
    IsAdmin: userToProvideSessionFor.IsAdmin,
  });
};
