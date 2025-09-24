// CHECKS EMPTY INPUT
export const isEmptyInput = (...values) => {
  // validate function
  const failCond = (item) => 
    item === '' || item === null || item === undefined || 
    (typeof item === 'string' && item.trim().length === 0);

  for (let i = 0; i < values.length; i++) {
    if (failCond(values[i])) {
      return true;
    }
  }
  return false;
};

// check for invalid number
export const isInvalidNumber = (...values) => {
  const failCond = (item) =>
    item === null || item === undefined || isNaN(item);

  return values.some(failCond);
};

//check for boolean value

export const isInvalidBoolean = ( ...values ) => {
  const failCond = (item) => 
    typeof item !== 'boolean'

  return values.some(failCond);
}


//check password match
export const passwordDoNotMatch = (value1, value2) => value1 !== value2

//check invalid emails
export const isInvalidEmailAddress = (value) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !regex.test(value);
};