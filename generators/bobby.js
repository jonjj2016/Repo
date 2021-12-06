const { json } = require('express');
const asyncHandler = require('express-async-handler');

const getFunc = (model, populate)=> asyncHandler(async (req, res) => {
  let query;

  if (req.params.id) {
    query = model.findById(req.params.id);
  }
  if (req.params.slug) {
    query = model.findOne({ slug: req.params.slug });
  }
  // Select fields
  if (req.query.populate) {
    const fields = req.query.populate;
    query = query.populate(fields);
  }
  if (populate) {
    query = query.populate(populate);
  }
  if (req.body.populate) {
    query = query.populate(req.body.populate);
  }
  if (req.query.select) {
    const fields = req.query.select;
    query = query.select(fields);
  }
  // Executing query
  const item = await query;
  if (!item) {
    res.status(404);
    throw new Error(`Couldn't find the item with an id : ${req.params.id}`);
  }
  return {
    status: true,
    data: item,
  };
});

const findFunc = (model, populate) =>
asyncHandler(async (req, res, next) => {
  let query;
  // req.query.deleted = false;
  // Copy req.query
  const reqQuery = { ...req.query };
  // Fields to exclude from filtering
  const removeFields = ['select', 'sort', 'limit', 'page', 'populate'];
  // loop over removeFields and delet them from reqQuery
  removeFields.forEach((item) => delete reqQuery[item]);
  // Create Query string
  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(/\b(or)\b/g, (match) => `$${match}`);
  // Finding resources
  query = model.find(JSON.parse(queryStr));
  // Finding resources

  // Select fields
  if (req.query.select) {
    const fields = req.query.select;
    query = query.select(fields);
  }
  // Sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort;
    query = query.sort(sortBy);
  }
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  query.skip(startIndex).limit(limit);
  if (populate) {
    query = query.populate(populate);
  }
  if (req.query.populate) {
    query = query.populate(req.query.populate);
  }
  // Executing query
  const items = await query;
  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  return {
    status: true,
    count: items.length,
    pagination,
    data: items,
  };
})

const bobbyCrud = (Model, populate) => {
  const post = asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json({
      status: true,
      data: item
    })
  });
  const get = asyncHandler(async (req, res) => {
    const getData =await getFunc(Model, populate)(req, res);
    res.status(200).json({
      status: true,
      data: getData
    })
  });
  const find = asyncHandler(async (req, res) => {
    const data = await findFunc(Model, populate)(req, res)
    res.status(200).json(data)
  });
  const patch = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if( !item ) {
      res.status(400);
      throw new Error(`No item has ben identified with an id: ${req.params.id}`)
    }
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json({status: true,data})
  });
  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if( !item ) {
      res.status(400);
      throw new Error(`No item has ben identified with an id: ${req.params.id}`)
    }
    await Model.findByIdAndRemove(req.params.id)
    res.status(200).json({status: true})
  });
  return {
    get,
    post,
    find,
    patch,
    remove
  }
};


  const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
    next();
  };

module.exports = {
  notFound,
  errorHandler,
  bobbyCrud
};
