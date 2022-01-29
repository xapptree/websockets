const config = require('./dbconfig')
var ObjectId = require('mongodb').ObjectID;

module.exports = {
    createUser:async function(mongoDB, request) {
        try{
            var mUser =  await getRegisteredUser(mongoDB, request.mobile);
            if(mUser != null){
                return null;
            }
            var response =  await mongoDB.collection(config.userContainer.id).insertOne(request);
            return response.insertedId; 
        }
        catch(err){
            throw(err);
        }
    },
      
      updateUser:async function(mongoDB,request) {
          try{
            var response = await mongoDB.collection(config.userContainer.id).update({_id:ObjectId(request.id)},request,{ upsert: false });
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

    getUser :async function(mongoDB,id) {
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

    getRegisteredUser :async function(mongoDB,param) {
        try{
            var cursor= mongoDB.collection(config.deviceContainer.id).find({mobile: param});
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
