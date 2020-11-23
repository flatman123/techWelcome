const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema();

const PostSchema = Schema({

});

module.exports = Post = mongoose.model('post', PostSchema);