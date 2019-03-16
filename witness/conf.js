exports.deviceName = 'Obyte Devnet Witness';
exports.permanent_pairing_secret = '0000';
exports.WS_PROTOCOL = 'ws://';
exports.hub = 'localhost:6611';
exports.KEYS_FILENAME = 'keys.json';

exports.rpcPort = '6612';
exports.webPort = 8080; // dag explorer
exports.bServeAsHub = false;
exports.bLight = false;

// witness configuration
exports.bSingleAddress = true;
exports.THRESHOLD_DISTANCE = 1;
exports.MIN_AVAILABLE_WITNESSINGS = 100;
exports.TIMESTAMPING_INTERVAL = 60 * 1000; // in milliseconds

exports.admin_email='witness';
exports.from_email='witness';

exports.initial_witnesses = [
	'ZQFHJXFWT2OCEBXF26GFXJU4MPASWPJT'
];

exports.selectedLanguage="en";
exports.languagesAvailable = {
    en: {name: "English", file: "en"},
    da: {name: "Dansk", file: "explorer_da-DK"},
    zh: {name: "中文", file: "explorer_zh-CN"}
};
