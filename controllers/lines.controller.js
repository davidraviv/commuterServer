const axios = require('axios');
const MOT_KEY = process.env.MOT_KEY;

// file deepcode ignore NoRateLimitingForExpensiveWebOperation: I added limiter in the admin.router.js file
const getLines = async (req, res, next) => {
  // extract lon and lat query params
  const code = req?.query?.code;
  
  // return http 400 if code is missing
  if (!code) {
    const err = new Error (`code query params are missing`);
    err.status = 400;
    return next(err);
  }
  console.log(`Searching for lines in station ${code}`);

  const lines = [];

  const url = `http://moran.mot.gov.il:110/Channels/HTTPChannel/SmQuery/2.8/json?Key=${MOT_KEY}&MonitoringRef=${code}`
  try {
    const response = await axios.get(url);
    console.log(`@@@ response: ${JSON.stringify(response)}`);
    if (response?.data) {
      const rawLines = response.Siri.ServiceDelivery.StopMonitoringDelivery;
      for (const line of rawLines) {
        lines.push({
          number: line.MonitoredStopVisit.MonitoredVehicleJourney.PublishedLineName,
          confidence: line.MonitoredStopVisit.MonitoredVehicleJourney.ConfidenceLevel,
          order: line.MonitoredStopVisit.MonitoredVehicleJourney.MonitoredCall.Order,
          time: line.MonitoredStopVisit.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime,
          distance: line.MonitoredStopVisit.MonitoredVehicleJourney.MonitoredCall.DistanceFromStop
        });
      }
    } else {
      console.log(`No data found for station ${code}`);
    }
  } catch (err) {
    console.log(`Error: ${JSON.stringify(err)}`);
    return next(err)
  }

  if (lines) {
    console.log(`Found total of ${lines.length} stations`);
    console.log(`Stations: ${JSON.stringify(lines)}`)
    res.status(200).json(lines);
  } else {
    const err = new Error ('No lines found');
    err.status = 404;
    return next(err);
  }
}


module.exports = {
  getLines,
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