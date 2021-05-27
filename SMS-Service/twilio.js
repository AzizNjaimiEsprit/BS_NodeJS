const authSID = 'AC84636ae0d0b2187f8c9692643cf012aa';
const token = '94c455dca87b325cd9922a74b5ecb676';

const client = require('twilio')(authSID, token);
module.exports = {client: client};