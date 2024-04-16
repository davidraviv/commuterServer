const Station = require('../models/station.model');

const DEFAULT_MAX_DISTANCE = 300


// file deepcode ignore NoRateLimitingForExpensiveWebOperation: I added limiter in the admin.router.js file
const getStations = async (req, res, next) => {
  // extract lon and lat query params
  const lon = req?.query?.lon;
  const lat = req?.query?.lat;
  const distance = req?.query?.distance || DEFAULT_MAX_DISTANCE; // meters
  console.log(`Searching for stations near lon=${lon}, lat=${lat} with max distance of ${distance} meters`);
  
  // return http 400 if lon or lat are missing
  if (!lon || !lat) {
    const err = new Error (`lon and lat query params are missing`);
    err.status = 400;
    next(err);
  }

  // search in mongoDB stations with approximate location of 300 meters from lon and lat
  const stations = await Station.find({
    location: {
      $near: {
        $geometry: {
          type: "Point" ,
          coordinates: [ lon , lat ]
        },
        $maxDistance: distance // meters
     }
   }
  });

  if (stations) {
    console.log(`Found total of ${stations.length} stations`);
    console.log(`Stations: ${JSON.stringify(stations)}`)
    res.status(200).json(stations);
  } else {
    const err = new Error ('No station found');
    err.status = 404;
    next(err);
  }
}


module.exports = {
  getStations,
};




//   getAllProducts: async (req, res, next) => {
//     try {
//       const results = await Station.find({}, { __v: 0 });
//       // const results = await Product.find({}, { name: 1, price: 1, _id: 0 });
//       // const results = await Product.find({ price: 699 }, {});
//       res.send(results);
//     } catch (error) {
//       console.log(error.message);
//     }
//   },

//   createNewProduct: async (req, res, next) => {
//     try {
//       const product = new Station(req.body);
//       const result = await product.save();
//       res.send(result);
//     } catch (error) {
//       console.log(error.message);
//       if (error.name === 'ValidationError') {
//         next(createError(422, error.message));
//         return;
//       }
//       next(error);
//     }

//     /*Or:
//   If you want to use the Promise based approach*/
//     /*
//   const product = new Product({
//     name: req.body.name,
//     price: req.body.price
//   });
//   product
//     .save()
//     .then(result => {
//       console.log(result);
//       res.send(result);
//     })
//     .catch(err => {
//       console.log(err.message);
//     }); 
//     */
//   },

//   findProductById: async (req, res, next) => {
//     const id = req.params.id;
//     try {
//       const product = await Station.findById(id);
//       // const product = await Product.findOne({ _id: id });
//       if (!product) {
//         throw createError(404, 'Product does not exist.');
//       }
//       res.send(product);
//     } catch (error) {
//       console.log(error.message);
//       if (error instanceof mongoose.CastError) {
//         next(createError(400, 'Invalid Product id'));
//         return;
//       }
//       next(error);
//     }
//   },

//   updateAProduct: async (req, res, next) => {
//     try {
//       const id = req.params.id;
//       const updates = req.body;
//       const options = { new: true };

//       const result = await Station.findByIdAndUpdate(id, updates, options);
//       if (!result) {
//         throw createError(404, 'Product does not exist');
//       }
//       res.send(result);
//     } catch (error) {
//       console.log(error.message);
//       if (error instanceof mongoose.CastError) {
//         return next(createError(400, 'Invalid Product Id'));
//       }

//       next(error);
//     }
//   },

//   deleteAProduct: async (req, res, next) => {
//     const id = req.params.id;
//     try {
//       const result = await Station.findByIdAndDelete(id);
//       // console.log(result);
//       if (!result) {
//         throw createError(404, 'Product does not exist.');
//       }
//       res.send(result);
//     } catch (error) {
//       console.log(error.message);
//       if (error instanceof mongoose.CastError) {
//         next(createError(400, 'Invalid Product id'));
//         return;
//       }
//       next(error);
//     }
//   }
// };