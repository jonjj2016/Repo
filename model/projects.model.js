const mongoose = require('mongoose');

const ProjectsSchema = new mongoose.Schema({
name: {
	type: String,
	required: true,
	trim: true,
	unique: true,
	select : true,
},
password: {
	type: String,
	required: true,
	trim: true,
	select : true,
},
email: {
	type: String,
	required: true,
	unique: true,
	select : true,
},
entityAccountImage: {
	type: String,
	select : true,
},
secondName: {
	type: String,
	trim: true,
	select : true,
},
deleted: {
	type: Boolean,
	select: false,
	default: false,
	select : true,
},
featured: {
	type: Boolean,
	default: false,
	select : true,
},
});

module.exports = mongoose.model("Projects", ProjectsSchema);
