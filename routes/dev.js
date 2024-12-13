var express = require('express');
var router = express.Router();

const { checkBody } = require("../modules/checkBody")
const DevLang = require("../models/dev_languages")

const jdoodleApi = process.env.JDOODLE_API

/* Request to execute code */
router.post('/', async (req, res) => {
  const { code } = req.body

  const request = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    script: code, //.replace(/\n/g, '\n'),
    language: "nodejs",
    versionIndex: "0"
  }

  const response = await fetch(jdoodleApi, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
   })

   const dataApi = await response.json() 
   res.json({result: true, data: dataApi});
})

module.exports = router;
