var ether = require("etherpad-lite-client");

var etherpad = ether.connect({
  apikey: 'EtherpadFTW',
  host: 'beta.etherpad.org',
});

exports.etherpad = etherpad;