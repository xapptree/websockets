var config = {}


//Create
config.createVariant = 'CREATE_VARIANT'
config.createUser = 'CREATE_USER'
config.createDevice = 'CREATE_DEVICE'
//Update
config.updateVariant = 'UPDATE_VARIANT'
config.updateUser = 'UPDATE_USER'
config.updateDevice = 'UPDATE_DEVICE'

//Variant
config.removeVariant= "REMOVE_VARIANT"
config.updateVariantParent = "UPDATE_VARIANT_PARENT"
//Device 
config.updateDeviceStatus = 'UPDATE_DEVICE_STATUS'
config.updateDeviceName = "UPDATE_DEVICE_NAME"

config.database = {
  id: 'VariantDB'
}

config.variantContainer = {
  id: 'Variants'
}

config.userContainer = {
    id: 'Users'
  }

  config.deviceContainer = {
    id: 'Devices'
  }

  config.ticketContainer = {
    id: 'Tickets'
  }


//Device Test data
config.testCreateDevice= {
  "variant_id": "ESP8266_1",
  "device_id": "d02",
  "parent_id": "MyHome",
  "device_type": "SWITCH",
  "device_name": "Bed light",
  "device_status": 400,
  "analog_pin": "17",
  "digital_pin": "2",
  "device_enable": true,
  "fan_dimmer": "00",
  "light_dimmer": "225",
  "container": "BedRoom",
  "variant_connected": true,
  "access_type": "PRIVATE",
  "last_communication_type": "MANUAL",
  "last_communication_by": "",
  "firmware_version": "1.0.0",
  "firmare_name": "SmartSwitch"
}
config.testUpdateDevice= {
  "id":"60e95c7535c275e298301e82",
  "variant_id": "ESP8266_1",
  "device_id": "d01",
  "parent_id": "MyHome",
  "device_type": "SWITCH",
  "device_name": "Bed light",
  "device_status": 200,
  "analog_pin": "17",
  "digital_pin": "5",
  "device_enable": true,
  "fan_dimmer": "00",
  "light_dimmer": "225",
  "container": "BedRoom",
  "variant_connected": true,
  "access_type": "PRIVATE",
  "last_communication_type": "MANUAL",
  "last_communication_by": "",
  "firmware_version": "1.0.0",
  "firmare_name": "SmartSwitch"
}
config.testUpdateDeviceStatus = {
  "id":"60e95c7535c275e298301e82",
  "variant_id": "ESP8266_1",
  "device_status": 500,
}
config.testUpdateAllDeviceStatus = {
  "variant_id": "ESP8266_1",
  "device_status": 400,
  "parent_id": "MyHome"
}
config.testUpdateDeviceName = {
  "variant_id": "ESP8266_0002",
  "parent_id": "MyHome",
  "device_type": "SWITCH",
  "device_name": "Custom Name",
  "id": "60e960122aa097e360e3bf98"
}

config.testGetDevice = "60e960122aa097e360e3bf98"

//Variant Test Data
config.testUpdateVariantParent = {
  "id": "60e849dcd5c030c0c495dbb3",
  "parent_id":"tes"
}

config.testGetVariant = {
  "id": "60e849dcd5c030c0c495dbb3"
}
config.testUpdateVariant = {
	"id" : "60e849dcd5c030c0c495dbb3",
	"variant_id" : "ESP8266_1",
	"parent_id" : "parentUpdate2",
	"variant_type" : "B-121",
	"variant_status" : 200,
	"variant_name" : "ESP8266-1",
	"variant_enable" : true,
	"container" : "BedRoom",
	"variant_connected" : false,
	"access_type" : "PRIVATE",
	"firmware_version" : "1.0.0",
	"firmare_name" : "SmartBoard_12Channel"
}

config.testUpdateVariantConnected = {
	"id" : "60e849dcd5c030c0c495dbb3",
	"variant_id" : "ESP8266_1",
	"parent_id" : "parentUpdate2",
	"variant_type" : "B-121",
	"variant_status" : 200,
	"variant_name" : "ESP8266-1",
	"variant_enable" : true,
	"container" : "BedRoom",
	"variant_connected" : true,
	"access_type" : "PRIVATE",
	"firmware_version" : "1.0.0",
	"firmare_name" : "SmartBoard_12Channel"
}
config.testUpdateVariantDisconnected = {
	"id" : "60e849dcd5c030c0c495dbb3",
	"variant_id" : "ESP8266_1",
	"parent_id" : "parentUpdate2",
	"variant_type" : "B-121",
	"variant_status" : 200,
	"variant_name" : "ESP8266-1",
	"variant_enable" : true,
	"container" : "BedRoom",
	"variant_connected" : false,
	"access_type" : "PRIVATE",
	"firmware_version" : "1.0.0",
	"firmare_name" : "SmartBoard_12Channel"
}

config.testCreateVariant = {
	"variant_id" : "ESP8266_00044",
	"parent_id" : "p2",
	"variant_type" : "B-6",
	"variant_status" : 200,
	"variant_name" : "ESP8266-1",
	"variant_enable" : true,
	"container" : "BedRoom",
	"variant_connected" : true,
	"access_type" : "PRIVATE",
	"firmware_version" : "1.0.0",
	"firmare_name" : "SmartBoard_12Channel"
}

//User Test Data
config.testCreateUser = {
  "name": "Akbar",
  "mobile": "9032269588",
  "email": "xapptree@gmail.com",
  "address": "Big mosque street",
  "city": "Ongole",
  "state": "AP",
  "country": "India",
  "pincode": "523001",
  "password": "sdfgh76sdfg@@#1",
  "public_key": "dfghjk,mnbfdfghj",
  "temp_password": "Ev67rg3",
  "account_type": "ADMIN",
  "service_type": "PUBLIC",
  "service_plan": "BRONZE",
  "is_active":true,
  "account_created":"1213243546",
  "last_updated_by": "mac",
  "otp":"766567",
  "otp_expiry":""
}

config.testUpdateUser = {
  "id":"",
  "name": "Akbar",
  "mobile": "9032269588",
  "email": "xapptree@gmail.com",
  "address": "Big mosque street",
  "city": "Ongole",
  "state": "AP",
  "country": "India",
  "pincode": "523001",
  "password": "sdfgh76sdfg@@#1",
  "public_key": "dfghjk,mnbfdfghj",
  "temp_password": "Ev67rg3",
  "account_type": "ADMIN",
  "service_type": "PUBLIC",
  "service_plan": "BRONZE",
  "is_active":true,
  "account_created":"1213243546",
  "last_updated_by": "mac",
  "otp":"766567",
  "otp_expiry":""
}
config.testGetUser = {
  "id": "567m",
  "mobile": "9032269588"
}

module.exports = config
