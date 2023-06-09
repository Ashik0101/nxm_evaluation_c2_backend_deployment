const authorize = (permittedRoles) => {
  return (req, res, next) => {
    const role = req.user.role;
    console.log(req.user.role);
    if (permittedRoles.includes(role)) {
      next();
    } else {
      res.send({ msg: "You are not authorized for this task !" });
    }
  };
};

module.exports = { authorize };
