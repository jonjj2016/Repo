const fs = require('fs');

module.exports =(req)=>{
    const stream = fs.createWriteStream(`./model/${req.body.schemaTitle.toLowerCase()}.model.js`);
   const keys = Object.keys(req.body.data);
   const f = data =>{
        if(!Array.isArray(data)&& typeof data==='object') {
            const oKeys = Object.keys(data)
            oKeys.forEach(oKey=>{
                stream.write(`\t${oKey}: ${data[oKey]},\n`)
            })
        }
        return `\tselect : true,\n`
   }
   stream.once('open',() => {
    stream.write("const mongoose = require('mongoose');\n\n")
    stream.write(`const ${req.body.schemaTitle}Schema = new mongoose.Schema({\n`)
    keys.forEach(key=>{
        stream.write(`${key}: {\n`)
        stream.write(`${f(req.body.data[key])}`),
        stream.write(`},\n`)
    })

    stream.write(`});\n\n`);
    stream.write(`module.exports = mongoose.model("${req.body.schemaTitle}", ${req.body.schemaTitle}Schema);\n`)
   })
}