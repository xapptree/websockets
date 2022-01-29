const config = require('./dbconfig')
var ObjectId = require('mongodb').ObjectID;

module.exports = {
    createDevice:async function(mongoDB, request) {
        try{
            var mDevice =  await checkDevice(mongoDB, request.device_id,request.variant_id);
            if(mDevice != null){
                return null;
            }
            var response =  await mongoDB.collection(config.deviceContainer.id).insertOne(request);
            return response.insertedId; 
        }
        catch(err){
            console.log(`CreateDevice Error:\n${err}\n`)
            throw(err);
        }
    },
      
      updateDevice:async function(mongoDB,request) {
          try{
            var response = await mongoDB.collection(config.deviceContainer.id).update({_id:ObjectId(request.id)},request,{ upsert: false });
           if(response.result.nModified>0){
            return "Data updated successfully."
           }else{
               return null;
           }
          }
          catch(err){
              throw(err);
          }
        },
      
      updateDeviceName:async function(mongoDB,request) {
          try{
            var response = await mongoDB.collection(config.deviceContainer.id).updateOne({_id:ObjectId(request.id)},
            {
             $set: {"device_name": request.device_name}
            }, { upsert: false });

            if(response.modifiedCount >0){
                return response;
            }else{
                return null;
            }
          }
          catch(err){
             throw(err);
          }
        },

        updateDeviceStatus:async function(mongoDB,request) {
            try{
              var response = await mongoDB.collection(config.deviceContainer.id).updateOne({_id:ObjectId(request.id), variant_id:request.variant_id},
              {
               $set: {
                   "device_status": request.device_status
                }
              }, { upsert: false });
  
              if(response.modifiedCount >0){
                  return response;
              }else{
                  return null;
              }
            }
            catch(err){
               throw(err);
            }
        },

        updateAllDeviceStatus:async function(mongoDB,request) {
            try{
              var response = await mongoDB.collection(config.deviceContainer.id).updateMany({variant_id: request.variant_id, parent_id: request.parent_id},
              {
               $set: {
                   "device_status": request.device_status
                }
              }, { upsert: false }, { multi:true });
  
              if(response.modifiedCount >0){
                  return response;
              }else{
                  return null;
              }
            }
            catch(err){
               throw(err);
            }
        },

    getDevice :async function(mongoDB,id) {
        try{
            var cursor= mongoDB.collection(config.deviceContainer.id).find({_id:ObjectId(id)});
            const allValues = await cursor.toArray();
            await cursor.close();
            if(allValues.length){
                return allValues[0];
            }else{
                return null;
            }
        }catch(err){
            throw(err);
        }
    },

    checkDevice :async function(mongoDB,id, variantID) {
        try{
            var cursor= mongoDB.collection(config.deviceContainer.id).find({device_id:id, variant_id:variantID});
            const allValues = await cursor.toArray();
            await cursor.close();
            if(allValues.length){
                return allValues[0];
            }else{
                return null;
            }
        }catch(err){
            throw(err);
        }
    }
}
