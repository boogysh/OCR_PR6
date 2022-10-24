//password validator https://www.npmjs.com/package/password-validator
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();
// Add properties to it
passwordSchema
.is().min(8)                                    // Minimum length 8   
.is().max(18)                                   // Maximum length 100 
.has().uppercase(1)                             // Must haveat least 1 uppercase letter
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digits
.has().symbols(1)                               // Must have at least 1 symbol
.is().not(/[\]()[{}<>@]/)                       // Should not have these symbols
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = passwordSchema;
// Validate against a password string
//console.log(passwordSchema.validate('validPASS123'));
// => true
//console.log(passwordSchema.validate('invalidPASS'));
// => false

// Get a full list of rules which failed
//console.log(passwordSchema.validate('joke', { list: true }));
// => [ 'min', 'uppercase', 'digits' ]

