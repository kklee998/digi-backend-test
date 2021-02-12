function validateEmail(email) {
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
    return true;
  }
  return false;
}
function validatePassword(password) {
  if (/^(?=.*(\W))(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{12,}$/.test(password)) {
    /**
     * (?=.*(\W)) : Non-Alphanumeric
     * (?=.*[A-Z]): At least one uppercase
     * [a-zA-Z0-9!@#$%^&*]{12,}: Minimum 12 characters
     */
    return true;
  }
  return false;
}

module.exports = {
  validateEmail,
  validatePassword,
};
