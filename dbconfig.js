var config = {}

config.endpoint = 'https://smartvarientkey.documents.azure.com:443/'
config.key = 'yBqqEvTDGQcqmV3YFTtHKJywzBgw9zRvZiipC7dnGo9PDczMElxu9CqdowsORq5icqOgdTFMyGO1qqtBsEMgkg=='
//Create
config.createVariant = 'CREATE_VARIANT'
config.createUser = 'CREATE_USER'
config.createDevice = 'CREATE_DEVICE'
//Update
config.updateVariant = 'UPDATE_VARIANT'
config.updateUser = 'UPDATE_USER'
config.updateDevice = 'UPDATE_DEVICE'

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

  config.testVariantItem = {
    "variant_id": "ESP8266_0003",
    "parent_id": "parent0001",
    "variant_type": "B-12",
    "variant_status": 400,
    "variant_name": "ESP8266",
    "variant_enable": true,
    "container": "BedRoom",
    "variant_connected": true,
    "access_type": "PRIVATE",
    "firmware_version": "1.0.0",
    "firmare_name": "SmartBoard_12Channel"
}


config.testTicketItem = {
  "ticket_status": "Success",
  "ticket_name": "A1"
}

module.exports = config
