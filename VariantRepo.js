const config = require('./dbconfig')
var ObjectId = require('mongodb').ObjectID;

module.exports = {
    createVariant:async function(mongoDB, request) {
        try{
            var mVariant =  await checkVariant(mongoDB, request.variant_id);
            if(mVariant != null){
                return null;
            }
            var response =  await mongoDB.collection(config.variantContainer.id).insertOne(request);
            return response.insertedId; 
        }
        catch(err){
            console.log(`CreateVariant Error:\n${err}\n`)
            throw(err);
        }
    },
      
      updateVariant:async function(mongoDB,request) {
          try{
            var response = await mongoDB.collection(config.variantContainer.id).update({_id:ObjectId(request.id)},request,{ upsert: false });
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
      
      updateVariantParent:async function(mongoDB,request) {
          try{
            var response = await mongoDB.collection(config.variantContainer.id).updateOne({_id:ObjectId(request.id)},
            {
             $set: {"parent_id": request.parent_id}
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

        updateVariantStatus:async function(mongoDB,request) {
            try{
              var response = await mongoDB.collection(config.variantContainer.id).updateOne({_id:ObjectId(request.id), parent_id:request.parent_id},
              {
               $set: {
                   "variant_status": request.variant_status
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

        updateVariantConnection:async function(mongoDB,request) {
            try{
              var response = await mongoDB.collection(config.variantContainer.id).updateOne({_id:ObjectId(request.id), parent_id:request.parent_id},
              {
               $set: {
                   "variant_connected": request.variant_connected
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
      
    getVariant :async function(mongoDB,id) {
        try{
            var cursor= mongoDB.collection(config.variantContainer.id).find({_id:ObjectId(id)});
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

    checkVariant :async function(mongoDB,id) {
        try{
            var cursor= mongoDB.collection(config.variantContainer.id).find({variant_id:id});
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
