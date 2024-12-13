function checkBody(body, keys) {
    let isValid = true;
  
    for (const field of keys) {
      if (!body[field] !== 0 && (!body[field] || body[field]) === '') {
        isValid = false;
      }
    }
  
    return isValid;
  }
  
module.exports = { checkBody }; 