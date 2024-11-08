var express = require('express');
var router = express.Router();

const JDOODLE_URL = "https://api.jdoodle.com/v1/execute"

/* GET home page. */
router.get('/test', async (req, res) => {
  const request = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    script: "console.log(10 + 13)",
    language: "nodejs",
    versionIndex: "0"
  }


  const response = await fetch(JDOODLE_URL, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
   })

   const dataApi = await response.json() 
   res.json({result: true, data: dataApi});
})


module.exports = router;
