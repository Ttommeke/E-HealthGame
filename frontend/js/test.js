const Serial = chrome.serial;

/* Interprets an ArrayBuffer as UTF-8 encoded string data. */
var ab2str = function(buf) {
    var bufView = new Uint8Array(buf);
    var encodedString = String.fromCharCode.apply(null, bufView);

    return decodeURIComponent(escape(encodedString));
};

/* Converts a string to UTF-8 encoding in a Uint8Array; returns the array buffer. */
var str2ab = function(str) {
    var encodedString = unescape(encodeURIComponent(str));
    var bytes = new Uint8Array(encodedString.length);

    for (var i = 0; i < encodedString.length; ++i) {
        bytes[i] = encodedString.charCodeAt(i);
    }

    return bytes.buffer;
};

Serial.onReceive.addListener(function(info) {
    console.log("received:", ab2str(info.data));
});

Serial.getDevices(function(data) {
    Serial.connect(data[0].path, {
        bitrate: 115200
    }, function(serialDevice) {
        document.onkeyup = function() {
            Serial.send(serialDevice.connectionId, str2ab("p\n"), function(lala) {});
        };
    });
});
