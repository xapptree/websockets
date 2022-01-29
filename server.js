// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const server = require('http').createServer(app);
var io = require('socket.io')(server);
const { body, validationResult, check } = require('express-validator');
var port = process.env.port || process.env.PORT || 1337
const VariantRepo = require('./VariantRepo');
const DeviceRepo = require('./DeviceRepo');
const UserRepo = require('./UserRepo');
const config = require('./dbconfig')
//Mango Db
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
const { Console } = require('console');
var mongoDB;
var option = {
  autoReconnect: true,
  poolSize : 40,
  reconnectTries: 30
};

MongoClient.connect(config.mongo_endpoint,option, function(err, client) {
  if(err !=undefined && err != null){
    console.log("DB connectection failed");
  }
  mongoDB = client.db(config.database.id);
  console.log("DB connected");
  server.listen(port, () => {
    console.log('Server listening at port %d', port);
  });
});


//Sockets Starts
// Routing
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Login API
app.post('/user/login', check('username','Required valid email').trim().isEmail(),check('password', 'Required valid password').isLength({min:8}),function (req, res) {
  //perform basic validation
  const errors = validationResult(req);d

  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode :400, message: req.body, errors:errors.array() });
  }

  //fetch user
  UserRepo.getRegisteredUser(mongoDB, req.body.username).then(
    function(user) { 
      //User found, match passwords.
      console.log(value);
      bcrypt.compare(req.body.password, user.password, (error, match)=>{
        if(error) res.status(500).json(error)
        else if(match) res.status(200).join({statusCode :200, message: "Login successfull", token:"",url:""})
        else res.status(403).json({ statusCode :403, message: "Invalid credentials" })
      });
    },
    function(error) { 
      //User not found.
      res.status(403).json({ statusCode :403, message: "User not found" })
    }); 
});

// Register user
app.post('/user/register',
check('name','Required valid name.').trim().notEmpty(),
check('mobile','Required valid mobile.').trim().isLength({min:10, max:10}),
check('email','Required valid email').trim().isEmail(),
check('address','Required valid addredd').trim().notEmpty(),
check('city','Required valid city').trim().notEmpty(),
check('state','Required valid state').trim().notEmpty(),
check('country','Required valid country').trim().notEmpty(),
check('pincode','Required valid pincode').trim().isLength({min:6, max:6}),
check('password', 'Required valid password').isLength({min:8})
,function (req, res) {
  //perform basic validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode :403, message: "Required valid data.", errors:errors.array()  });
  }

  req.body.public_key = "";
  req.body.temp_password = "";
  req.body.account_type ="USER";
  req.body.service_type = "PUBLIC";
  req.body.service_plan = "BRONZE";
  req.body.is_active =false;
  req.body.account_created = Date.now();
  req.body.last_updated_by ="Self";
  req.body.otp = Math.floor(100000 + Math.random() * 900000);
  req.body.otp_expiry ="2";

  bcrypt.hash(req.body.password,10,(error, encryptPass)=>{
    if(error) res.status(500).json(error)
    else{
      req.body.password = encryptPass;
      UserRepo.createUser(mongoDB, req.body).then(
        function(creationID) {
          console.log(creationID);
          res.status(200).json({ statusCode :200, message: "Registration Successfully" })
        },
        function(error) { 
          res.status(403).json({ statusCode :403, message: "Registration failed" })
        }); 
    }
  });
});

// app.get('/user', function (req, res) {
//   var data= {
//     "userid":"1"
//   }
//   res.end("data");
//  // res.end(JSON.stringify(data))
//   // fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
//   //    console.log( data );
//   //    res.end( data );
//   // });
// })

let numUsers = 0;
let vid = "ESP32_2022";
io.on('connection', (socket) => {

  io.emit(`callback_deviceStatusUpdate:${vid}`, {
    statusCode: 200,
    message :'Update successfull',
    device_status:200,
    device_id:"relay1",
    variant_id:vid
  });

  //Create Variant
  socket.on(config.createVariant, (request) => {
    console.log('In create variant');
    VariantRepo.createVariant(mongoDB,request).then((item) => {
      console.log(`CreateVariant status:\n${JSON.stringify(item.resource)}\n`);
       socket.emit('callback_createVariant', {
      statusCode: 200,
      message :'Variant created success'
    });})
    .catch((error) => {
      console.log(`CreateVariant Error:\n${JSON.stringify(error)}\n`);
        socket.emit('callback_createVariant', {
      statusCode: 409,
      message :'Variant created failed'
    });});
  });

  //Create Device
  socket.on(config.createDevice, (request) => {
    console.log('In create Device');
    DeviceRepo.createDevice(mongoDB,request)
    .then((item) => {
      console.log(`CreateDevice status:\n${JSON.stringify(item.resource)}\n`);
       socket.emit('callback_createDevice', {
      statusCode: 200,
      message :'Device created success'
    });})
    .catch((error) => { 
      console.log(`CreateDevice Error:\n${JSON.stringify(error)}\n`);
       socket.emit('callback_createDevice', {
      statusCode: 409,
      message :'Device created failed'
    });});
  });

   //Create User
   socket.on(config.createUser, (request) => {
    createUser(mongoDB,request)
    .then((item) => {
      if(item == null){
        socket.emit('callback_createUser', {
          statusCode: 409,
          message :'User already present'
        });

      }else{
        socket.emit('callback_createUser', {
          statusCode: 200,
          message :'User created success'
        });
      }
       })
    .catch((error) => {  socket.emit('callback_createUser', {
      statusCode: 409,
      message :'User created failed'
    });});
  });

  //Update Variant parent ID
  socket.on(config.updateVariantParent, (request) => {

    if(request ==null && request == undefined){
      socket.emit('callback_variantUpdate', {
        statusCode: 400,
        message :'Bad data request or request is null.'
      });
      return;
    }

    if(request.id == undefined){
      socket.emit('callback_variantUpdate', {
        statusCode: 400,
        message :'Bad data request, request property id missing.'
      });
      return;
    }

    if(request.parent_id == undefined){
      socket.emit('callback_variantUpdate', {
        statusCode: 400,
        message :'Bad data request, request property parent_id missing.'
      });
      return;
    }

      if(request.variant_type == undefined){
        socket.emit('callback_variantUpdate', {
          statusCode: 400,
          message :'Bad data request, request property variant_type missing.'
        });
      return;
    }

    VariantRepo.updateVariantParent(mongoDB,request).then(
      function(value) { 
        console.log(`UpdateVariantParent status:\n${JSON.stringify(value.resource)}\n`);
        socket.emit('callback_variantUpdate', {
          statusCode: 200,
          message :'Update successfull'
        });
      },
      function(error) { 
        console.log(`UpdateVariantParent Error:\n${JSON.stringify(error)}\n`);
        socket.emit('callback_variantUpdate', {
          statusCode: 409,
          message : 'Failed to update Variant.'
        });
      }
    );

  });


  //Update Variant
  socket.on(config.updateVariant, (request) => {
    if(request ==null && request == undefined){
      socket.emit('callback_variantUpdate', {
        statusCode: 400,
        message :'Bad data request or request is null.'
      });
      return;
    }

    if(request.id == undefined){
      socket.emit('callback_variantUpdate', {
        statusCode: 400,
        message :'Bad data request, request property id missing.'
      });
      return;
    }

    if(request.parent_id == undefined){
      socket.emit('callback_variantUpdate', {
        statusCode: 400,
        message :'Bad data request, request property parent_id missing.'
      });
      return;
    }

      if(request.variant_type == undefined){
        socket.emit('callback_variantUpdate', {
          statusCode: 400,
          message :'Bad data request, request property variant_type missing.'
        });
      return;
    }

    VariantRepo.updateVariant(mongoDB,request)
    .then((item) => { socket.emit('callback_variantUpdate', {
      statusCode: 200,
      message :'Update successfull'
    });})
    .catch((error) => {  socket.emit('callback_variantUpdate', {
      statusCode: 409,
      message : 'Failed to update Variant.'
    });});
  });

  //Remove Variant from account
  socket.on(config.removeVariant, (request) => {
    if(request ==null && request == undefined){
      socket.emit('callback_variantRemove', {
        statusCode: 400,
        message :'Bad data request or request is null.'
      });
      return;
    }

    if(request.id == undefined){
      socket.emit('callback_variantRemove', {
        statusCode: 400,
        message :'Bad data request, request property id missing.'
      });
      return;
    }

    if(request.parent_id == undefined){
      socket.emit('callback_variantRemove', {
        statusCode: 400,
        message :'Bad data request, request property parent_id missing.'
      });
      return;
    }

      if(request.access_type == undefined){
        socket.emit('callback_variantRemove', {
          statusCode: 400,
          message :'Bad data request, request property access_type missing.'
        });
      return;
    }

    if(request.access_type == "PUBLIC"){
      request.parent_id = "NONE";
    }

    request.variant_connected = false;
    request.variant_status = 500;

    VariantRepo.updateVariant(mongoDB,request)
    .then((item) => { socket.emit('callback_variantRemove', {
      statusCode: 200,
      message :'Variant removed successfully.'
    });})
    .catch((error) => {  socket.emit('callback_variantRemove', {
      statusCode: 409,
      message : 'Failed to remove Variant.'
    });});
  });

  //update device name
  socket.on(config.updateDeviceName, (request) => {

    if(request ==null && request == undefined){
      socket.emit('callback_deviceUpdate', {
        statusCode: 400,
        message :'Bad data request or request is null.'
      });
      return;
    }

    if(request.id == undefined){
      socket.emit('callback_deviceUpdate', {
        statusCode: 400,
        message :'Bad data request, request property id missing.'
      });
      return;
    }

    if(request.parent_id == undefined){
      socket.emit('callback_deviceUpdate', {
        statusCode: 400,
        message :'Bad data request, request property parent_id missing.'
      });
      return;
    }

      if(request.device_type == undefined){
        socket.emit('callback_deviceUpdate', {
          statusCode: 400,
          message :'Bad data request, request property device_type missing.'
        });
      return;
    }

    if(request.device_name == undefined || request.device_name == ''){
      socket.emit('callback_deviceUpdate', {
        statusCode: 400,
        message :'Bad data request, request property device_name missing or empty.'
      });
      return;
    }

    if(request.variant_id == undefined){
      socket.emit('callback_deviceUpdate', {
        statusCode: 400,
        message :'Bad data request, request property variant_id missing.'
      });
      return;
    }

    DeviceRepo.updateDeviceName(mongoDB,request).then(
      function(value) { 
        console.log(`UpdateDeviceName status:\n${JSON.stringify(value.resource)}\n`);
        socket.emit('callback_deviceUpdate', {
          statusCode: 200,
          message :'Update successfull'
        });
      },
      function(error) { 
        console.log(`UpdateDeviceName Error:\n${JSON.stringify(error)}\n`);
        socket.emit('callback_deviceUpdate', {
          statusCode: 409,
          message : 'Failed to update Device.'
        });
      }
    );

  });

   //update device
   socket.on(config.updateDevice, (request) => {

    if(request ==null && request == undefined){
      socket.emit('callback_deviceUpdate', {
        statusCode: 400,
        message :'Bad data request or request is null.'
      });
      return;
    }

    if(request.id == undefined){
      socket.emit('callback_deviceUpdate', {
        statusCode: 400,
        message :'Bad data request, request property id missing.'
      });
      return;
    }

    if(request.parent_id == undefined){
      socket.emit('callback_deviceUpdate', {
        statusCode: 400,
        message :'Bad data request, request property parent_id missing.'
      });
      return;
    }

      if(request.device_type == undefined){
        socket.emit('callback_deviceUpdate', {
          statusCode: 400,
          message :'Bad data request, request property device_type missing.'
        });
      return;
    }

    if(request.device_name == undefined || request.device_name == ''){
      socket.emit('callback_deviceUpdate', {
        statusCode: 400,
        message :'Bad data request, request property device_name missing or empty.'
      });
      return;
    }

    if(request.variant_id == undefined){
      socket.emit('callback_deviceUpdate', {
        statusCode: 400,
        message :'Bad data request, request property variant_id missing.'
      });
      return;
    }

    DeviceRepo.updateDevice(mongoDB,request).then(
      function(value) { 
        console.log(`UpdateDevice status:\n${JSON.stringify(value.resource)}\n`);
        socket.emit('callback_deviceUpdate', {
          statusCode: 200,
          message :'Update successfull'
        });
      },
      function(error) { 
        console.log(`UpdateDevice Error:\n${JSON.stringify(error)}\n`);
        socket.emit('callback_deviceUpdate', {
          statusCode: 409,
          message : 'Failed to update Device.'
        });
      }
    );

  });

  //update device Status
  socket.on(config.updateDeviceStatus, (request) => {

    if(request ==null && request == undefined){
      socket.emit('callback_deviceStatusUpdate', {
        statusCode: 400,
        message :'Bad data request or request is null.'
      });
      return;
    }

    if(request.id == undefined){
      socket.emit('callback_deviceStatusUpdate', {
        statusCode: 400,
        message :'Bad data request, request property id missing.'
      });
      return;
    }

    if(request.variant_id == undefined){
      socket.emit('callback_deviceStatusUpdate', {
        statusCode: 400,
        message :'Bad data request, request property variant_id missing.'
      });
      return;
    }

    if(request.from == undefined){
      socket.emit('callback_deviceStatusUpdate', {
        statusCode: 400,
        message :'Bad data request, request property FROM missing.'
      });
      return;
    }

    DeviceRepo.updateDevice(mongoDB,request).then(
      function(value) { 
        //console.log(`UpdateStatusDevice status:\n${JSON.stringify(value.resource)}\n`);
        if(request.from == 'Device'){
          socket.broadcast.emit('callback_deviceStatusUpdate', {
            statusCode: 200,
            message :'Update successfull',
            device_status:request.device_status,
            device_id:request.id,
            variant_id:request.variant_id
          });
        }else{
          io.emit(`callback_deviceStatusUpdate:${request.variant_id}`, {
            statusCode: 200,
            message :'Update successfull',
            device_status:request.device_status,
            device_id:request.id,
            variant_id:request.variant_id
          });
        }
      },
      function(error) { 
        //console.log(`UpdateStatusDevice Error:\n${JSON.stringify(error)}\n`);
        socket.emit('callback_deviceStatusUpdate', {
          statusCode: 409,
          message : 'Failed to update Device Status.'
        });
      }
    );

  });

  //--- chat data
  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {

    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;
    UserRepo.createUser(config.testCreateUser).then((item) => {
      if(item == null){
        socket.emit('callback_createUser', {
          statusCode: 409,
          message :'User already present'
        });

      }else{
        socket.emit('callback_createUser', {
          statusCode: 200,
          message :'User created success'
        });
      }}).catch((error) => {  socket.emit('callback_createUser', {
      statusCode: 409,
      message :'User created failed'
    });});

    // UserRepo.createUser(mongoDB, config.testCreateUser).then(
    //       function(value) { 
    //         console.log(value);
    //         socket.emit('new message', {
    //           username:socket.username,
    //           statusCode: 200,
    //           message :'Update successfull'
    //         });
    //       },
    //   function(error) { 
    //     console.log(error);
    //     socket.emit('new message', {
    //       username:socket.username,
    //       statusCode: 409,
    //       message : 'Failed to update Variant.'
    //     });
    //   }); 
    
    // var recordDoc = variantRepoAccess.read("", function(error, response){

    // });
    // console.log(recordDoc);
  //   var cursor= mongoDB.collection(config.variantContainer.id).find({_id:ObjectId("60e849dcd5c030c0c495dbb3")});
  //   cursor.each(function(err, doc) {
  //     if(err != undefined && err != null){
  //       console.log(err);
  //     }
  //     if (doc != null) {
  //         console.log(doc);
  //     } else {
  //       console.log("NO records");
  //     }
  // });
    
  //   mongoDB.collection(config.variantContainer.id).updateOne({_id:ObjectId("60e849dcd5c030c0c495dbb3")},
  //     {
  //         $set: {"parent_id": "Fluffy"}
  //     },  { upsert: true }, function(error, results) {
  //       if(error != undefined){
  //       console.log(error);
  //     }
  //     else{
  //       console.log(results);
  //       console.log("Record updated successfuly");
  //     }
  // });
    
    // mongoDB.collection(config.variantContainer.id).insertOne(config.testVariantItem, function(error, result){
    //   if(error != undefined){
    //     console.log(error);
    //   }
    //   else{
    //     console.log(result.insertedId);
    //     console.log("Record Saved successfuly");
    //     //60e849dcd5c030c0c495dbb3
    //   }
      
    // });
  //   updateVariant(config.testVariantUpdateParent).then(
  //     function(value) { 
  //       socket.emit('new message', {
  //         username:socket.username,
  //         statusCode: 200,
  //         message :'Update successfull'
  //       });
  //     },
  // function(error) { 
  //   socket.emit('new message', {
  //     username:socket.username,
  //     statusCode: 409,
  //     message : 'Failed to update Variant.'
  //   });
  // });

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    //mongoDB.close();
    if (addedUser) {
      --numUsers;
      VariantRepo.updateVariantConnection(mongoDB, config.testUpdateVariantDisconnected).then(
        function(value) { 
          console.log(value);
          socket.emit('new message', {
            username:socket.username,
            statusCode: 200,
            message :'Update successfull'
          });
        },
    function(error) { 
      console.log(error);
      socket.emit('new message', {
        username:socket.username,
        statusCode: 409,
        message : 'Failed to update Variant.'
      });
    }); 

    //Update all devices
    DeviceRepo.updateAllDeviceStatus(mongoDB, config.testUpdateAllDeviceStatus).then(
      function(value) { 
        console.log(value);
        socket.emit('new message', {
          username:socket.username,
          statusCode: 200,
          message :'Update successfull'
        });
      },
  function(error) { 
    console.log(error);
    socket.emit('new message', {
      username:socket.username,
      statusCode: 409,
      message : 'Failed to update Variant.'
    });
  });
      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});