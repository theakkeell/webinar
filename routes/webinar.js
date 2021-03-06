const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const multer  = require('multer')
const upload = multer({ dest: './public/images/profileImages' });
//package for making HTTP Request
const request=require("request");
//package to generate a random number
const randomize = require('randomatic');
const User = require('../models/user');
const  Driver  = require('../models/driver');
const Rider  = require('../models/rider');

const mongoose = require('mongoose');
const express = require('express');
const {Webinar}  = require('../models/webinar');
const path = require('path');
const FormData = require('form-data');
const http = require('http');
const fs = require('fs');
const {utcSchema} = require('../models/utc');

const logger = require('../startup/logging');
const regCtrl = require('../controller/registrationController');
const router = express.Router();


// Webinar register Route
router.post('/register', async function(req, resp, next){
  try{
    let web_name = req.body.web_name;
    let web_date = req.body.web_date;
    let web_day = req.body.web_day; // string
    let web_start_time = req.body.web_start_time;
    let web_description = req.body.web_description;
    let web_utc = req.body.web_utc; // string
    let web_topic = req.body.web_topic;

    let newWebinar;
    logger.verbose('Webinar register-POST called ');

    if ( web_name !== undefined && web_day !== undefined && web_date !== undefined && web_start_time !== undefined
      && web_description !== undefined && web_utc !== undefined && web_topic !== undefined
    ){
      console.log('In If Conditiond...!!!');
      newWebinar = new Webinar({
        web_name: web_name,
        web_date: web_date,
        web_day : web_day,
        web_start_time: web_start_time,
        web_description: web_description,
        web_utc: web_utc,
        web_topic: web_topic
      });


      newWebinar.save(function (err, webinar){
        if(err){
          logger.error('Some Error while updating user' + err );
          resp.jsonp({
            status:"failure",
            message:"Some error While saving new Webinar!",
            object: []
          });
        }
        else{
          logger.info('Webinar Register..!!');
          console.log('Success Response ' +webinar);
          resp.jsonp({
            status:"success",
            message:"Webinar Register!",
            object: webinar
          });
        }
      });
    }
    else{
      console.log('Something missing in input');
    }
  }
  catch (err){
    console.log(err);
  }




});

router.post('/utc', async function (req, res) {
  logger.info('POST UTC method...!!');
  try{
    let value = req.body.value;
    let abbr = req.body.abbr;
    let offsett = req.body.offsett;
    let isdst = req.body.isdst;
    let text = req.body.text;

    let utcObj;
    console.log('UTC AFTER BODY');
    utcObj = new utcSchema({
      value: value,
      abbr: abbr,
      offsett: offsett,
      isdst: isdst,
      text: text
    });

    console.log('UTC OBJECT from postman', utcObj);
    utcObj.save(function (err, utc){
      if(err){
        logger.error('Some Error while updating utc' + err );
        resp.jsonp({
          status:"failure",
          message:"Some error While saving new utc!",
          object: []
        });
      }
      else{
        logger.info('UTC Register..!!');
        resp.jsonp({
          status:"success",
          message:"UTC Added!",
          object: utc
        });
      }});

  }catch (err){
    console.log(err)
  }
});

router.get('/listOfWebinar', function(req, res){
  logger.info('GET listOfWebinar route called!!');
  try{
    Webinar.find({}, function(err, webinar) {
      if (err){
        res.status(400).send({
          status: "Failure",
          message: err,
          object: []
        });
      }

      else{
        // logger.info(webinar.length + 'Webinars Found');
        console.log(webinar);
        res.jsonp({
          status: 'success',
          message: 'List of Webinar',
          object: webinar
        });
      }
    });
  }catch (err){
    logger.info('An Exception Has occured in findAllUser method' + err);
  }
});

router.get('/getById/:id', function(req, res){

  var id = req.params.id;
  logger.info('GET listOfWebinar route called!!');
  try{
    Webinar.findOne({_id: id}, function(err, webinar) {
      if (err){
        res.status(400).send({
          status: "Failure",
          message: 'Webinar not found by this id',
          object: []
        });
      }

      else{
        logger.info(webinar.length + 'Webinars Found');
        res.jsonp({
          status: 'success',
          message: 'Webinar Found',
          object: webinar
        });
      }
    });
  }catch (err){
    logger.info('An Exception Has occured in findAllUser method' + err);
  }
});

router.delete('/getById/:id', function(req, res){
  let id = req.params.id;
  Webinar.findByIdAndRemove({_id: id})
    .then(webinar => {
      if(!webinar) {
        return res.status(404).send({
          message: "Webinar not found with id " + id
        });
      }
      res.jsonp({
        status: 'success',
        message: "Note deleted successfully!",
        object: webinar
      });
    }).catch(err => {
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
        message: "Note not found with id " + id
      });
    }
    return res.status(500).send({
      message: "Could not delete note with id " + id
    });
  });
})


module.exports = router; 