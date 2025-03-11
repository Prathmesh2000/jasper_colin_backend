function logError(functionName = '', err = 'Something went wrong') {
    try {
        const currTime = new Date();
        console.error("===========================================================");
        console.error('Time:', currTime, "| Function Name:", functionName);
        console.error('Error:', err);
        console.error("===========================================================");
    } catch (error) {
        console.error('Log Error:', error.message);
    }
}

function logInfo(functionName = '', ...args) {
    try {
        const currTime = new Date();
        console.log("===========================================================");
        console.log('Time:', currTime, "| Function Name:", functionName);
        args.forEach((val, i) => {
            console.log(`Arg ${i + 1}:`, val);
        });
        console.log("===========================================================");
    } catch (error) {
        console.error('Log Info Error:', error.message);
    }
}

function checkMissingParams(params, paramNames) {
    const missingParams = paramNames.filter(param => !params[param]);
    
    return missingParams.length ? missingParams.join(', ') : null;
}


function decodeString(encoded = null) {
    if (!encoded) return null;
    const index = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+{}[]|:;<>,.?/~`";
    const base = index.length;
    try {
      let number = 0;
  
      for (let char of encoded) {
        let charIndex = index.indexOf(char);
        if (charIndex === -1) return null;
        number = number * base + charIndex;
      }
  
      let decoded = "";
      while (number > 0) {
        decoded = String.fromCharCode(number % 256) + decoded;
        number = Math.floor(number / 256);
      }
  
      return decoded;
    } catch (e) {
      console.error(`decodeString Error:`, e.message);
      return null;
    }
}

module.exports = {
    logError,
    logInfo,
    checkMissingParams,
    decodeString
};
