var myCharacteristic;
// startFrame, middleFrame and endFrame depending on incoming Bluetooth notifications
var frameType;
var deviceName;


function connect() {
  // https://infocenter.nordicsemi.com/index.jsp?topic=%2Fcom.nordic.infocenter.sdk5.v13.0.0%2Fble_sdk_app_nus_eval.html
  let serviceUuid         = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
  let characteristicUuid  = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

  navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']
    })
    .then(device => {
      // log('Connecting...' + "\n");
      deviceName = device.name;
      return device.gatt.connect();
    })
    .then(server => {
      console.log('Getting Service...');
      return server.getPrimaryService(serviceUuid);
    })
    .then(service => {
      console.log('Getting Characteristic...');
      return service.getCharacteristic(characteristicUuid);
    })
    .then(characteristic => {
      myCharacteristic = characteristic;
      return myCharacteristic.startNotifications()
      .then(_ => {
        console.log('> Notifications started');
        console.log("Connected to: " + deviceName + "\n");
        myCharacteristic.addEventListener('characteristicvaluechanged',
          handleNotifications);
      });
    })
    .catch(error => {
      console.log('Argh! ' + error);
    });
}

function disconnect() {
  if (myCharacteristic) {
    myCharacteristic.stopNotifications()
      .then(_ => {
        console.log('> Notifications stopped');
        document.getElementById("humidity").innerHTML = "Humid Temp: 00.00°C";
        // log("Disconnected")
        myCharacteristic.removeEventListener('characteristicvaluechanged',
          handleNotifications);
      })
      .catch(error => {
        console.log('Argh! ' + error);
      });
  }
}

function capture() {
  if (myCharacteristic) {
    myCharacteristic.stopNotifications()
      .then(_ => {
        console.log('> Notifications captured');
        // log("Disconnected")
        myCharacteristic.removeEventListener('characteristicvaluechanged',
          handleNotifications);
      })
      .catch(error => {
        console.log('Argh! ' + error);
      });
  }
}

  function handleNotifications(event) {
  let value = event.target.value;

  if (value.getUint8(3).toString(16)) {
      if (value.getUint8(5).toString(16)) {
        frameType = "startFrame";
    }

  // Frame Starts

  console.log("begin " + frameType);


  // Declare DATA to VAR
  let temp = value.getUint8(3).toString(16) + "." + value.getUint8(5).toString(16);

  document.getElementById("humidity").innerHTML = "Humid Temp: "+ temp + "°C";

}
}
