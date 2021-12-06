const fs = require('fs');

module.exports = (req) => {
    // fs.mkdir('./routs')
    const stream = fs.createWriteStream(`./routes/${req.body.schemaTitle.toLowerCase()}.route.js`);
 
   stream.once('open',() => {
    stream.write("const express = require('express');\n");
    stream.write("const { bobbyCrud } = require('../generators/bobby');\n");
    stream.write(`const Model = require('../model/${req.body.schemaTitle.toLowerCase()}.model');\n\n`);
    stream.write(`const route = express.Router();\n\n`);
    stream.write(`route.get('/:id', bobbyCrud(Model).get);\n`);
    stream.write(`route.post('/', bobbyCrud(Model).post);\n`);
    stream.write(`route.get('/', bobbyCrud(Model).find);\n`);
    stream.write(`route.patch('/:id', bobbyCrud(Model).patch);\n`);
    stream.write(`route.delete('/:id', bobbyCrud(Model).remove);\n\n`);

    stream.write(`module.exports = route;\n`);
   })
};
