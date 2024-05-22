/* eslint-disable no-param-reassign */

const { parsePhoneNumber } = require('libphonenumber-js');

exports.isPositiveNumeric = (value) => {
  return /^\d+$/.test(value);
};

exports.parsePhone = (data) => {
  if (typeof data === 'string') {
    data = data.replace(/[^0-9+]+/g, '');
    data = parseInt(data, 10).toString();
    const phone = parsePhoneNumber(data, 'MY');
    if (phone) {
      data = phone.number;
    }
  } else if (typeof data === 'object') {
    if (data.phoneNumber) {
      data.phoneNumber = data.phoneNumber.replace(/[^0-9+]+/g, '');
    }

    if (data.phoneCountryCode && data.phoneNumber) {
      data.phoneNumber = parseInt(data.phoneNumber, 10).toString();
      const phone = parsePhoneNumber(`${data.phoneCountryCode}${data.phoneNumber}`);
      if (phone) {
        data.phoneNumber = phone.nationalNumber;
      }
    } 
  }
  return data;
};
