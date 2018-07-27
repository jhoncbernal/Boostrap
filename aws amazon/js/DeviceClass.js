var awsIot = require('aws-iot-device-sdk');

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT cloud
// NOTE: client identifiers must be unique within your AWS account; if a client attempts 
// to connect with a client identifier which is already in use, the existing 
// connection will be terminated.
//
var device = awsIot.device({
    keyPath: < YourPrivateKeyPath > ,
    certPath: < YourCertificatePath > ,
    caPath: < YourRootCACertificatePath > ,
    clientId: < YourUniqueClientIdentifier > ,
    host: < YourCustomEndpoint >

        iotClient.setAWSRegion("us-east-1");
    iotClient.setAWSEndpoint("amazonaws.com");
    iotClient.setAWSDomain("a2imeekghuew2f.iot.us-east-1.amazonaws.com");
    iotClient.setAWSPath("/things/HomeIO/shadow");
    iotClient.setAWSKeyID("AKIAIBVW4LBINZKI4SHA");
    iotClient.setAWSSecretKey("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");
    iotClient.setHttpClient( & httpClient);
    iotClient.setDateTimeProvider( & dateTimeProvider);
});

//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
device
    .on('connect', function() {
        console.log('connect');
        device.subscribe('topic_1');
        device.publish('topic_2', JSON.stringify({ test_data: 1 }));
    });

device
    .on('message', function(topic, payload) {
        console.log('message', topic, payload.toString());
    });