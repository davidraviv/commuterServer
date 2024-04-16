const csv = require('csv-parser');
const fs = require('fs');
const Station = require('../models/station.model');

const dummy = (req, res, next) => {
  // extract url query param named code
  const err = new Error ('Dummy error');
  err.status = req.query.status;
  console.log(`Query params = ${JSON.stringify(req.query, null, 2)}`);
  console.log(`message = ${err.message}`);
  next(err);
}

// file deepcode ignore NoRateLimitingForExpensiveWebOperation: I added limiter in the admin.router.js file
const loadStations = async (req, res, next) => {
  let rowCount = 0;
  let errCount = 0;
  let isHeaderRow = true;
  const csvFilePath = '/data/stops.txt';

  // verify that the station csv file exists
  if (fs.existsSync(csvFilePath)) {
    try {
      // drop old stations collection
      await Station.collection.drop();
      console.log('Old collection dropped');
    } catch (err) {
      if (err.code === 26) {
        console.log('Station collection not exist yet')
      } else {
        console.error('Error dropping collection', err);
        next(err);
        return;
      }
    }
  } else {
    const err = new Error (`File ${csvFilePath} not found`);
    err.status = 400;
    next(err);
    return;
  }

  // read CSV file 
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (data) => {
      // skip first header row
      if (isHeaderRow) {
        console.log('Skipping header row');
        isHeaderRow = false;
        return;
      }
      rowCount++;
      // create GeoJSON point from lat/lon
      const location = {
        type: 'Point',
        coordinates: [data.lon, data.lat]
      };
      
      // create station document
      const station = new Station({
        stop_id: data.stop_id,
        code: data.code,
        name: data.name,
        description: data.description,
        location,
        parent_station: data.parent_station,
        zone_id: data.zone_id
      });
      
      // save station to MongoDB
      try {
        await station.save();
      } catch (err) {
          errCount++
          console.log(err)
      }

    })
    .on('end', () => {
      console.log(`Read total of ${rowCount} rows`);
      console.log(`Successfully processed ${rowCount - errCount} rows`);
      console.log(`Encountered ${errCount} error rows.`)
    });

    res.status(201).send();
}


module.exports = {
  loadStations,
  dummy,
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