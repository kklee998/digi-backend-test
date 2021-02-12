const { expect } = require('chai');
const { validateEmail, validatePassword } = require('../validation');

describe('Test valid emails', () => {
  it('should return true for all these emails', () => {
    expect(validateEmail('kahkinlee998@gmail.com')).to.equal(true);
    expect(validateEmail('mailing@tribehired.com')).to.equal(true);
    expect(validateEmail('adriankh.chew@digi.com.my')).to.equal(true);
  });
});

describe('Test invalid emails', () => {
  it('should return false for all these strings', () => {
    expect(validateEmail('@gmail.com')).to.equal(false);
    expect(validateEmail('mailing@.com')).to.equal(false);
    expect(validateEmail('adriankh')).to.equal(false);
  });
});

describe('Test valid password', () => {
  it('should return true for this valid password', () => {
    expect(validatePassword('TopSneakyPassword!')).to.equal(true);
  });
});

describe('Test invalid password', () => {
  it('should return false for this invalid password', () => {
    expect(validatePassword('password')).to.equal(false);
  });
});
