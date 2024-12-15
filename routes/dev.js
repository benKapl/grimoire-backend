var express = require('express');
var router = express.Router();

const { checkBody } = require("../modules/checkBody")
const DevLang = require("../models/dev_languages")

const jdoodleApi = process.env.JDOODLE_API
// jdoodle doc : https://docs.jdoodle.com/integrating-compiler-ide-to-your-application/compiler-api/rest-api

/* Request to execute code */
router.post('/', async (req, res) => {
  const { code, language } = req.body

  const request = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    script: code, //.replace(/\n/g, '\n'),
    language,
    versionIndex: "0"
  }

  const response = await fetch(jdoodleApi, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
   })

   const dataApi = await response.json() 
   console.log(dataApi)
   res.json({result: true, data: dataApi});
})

router.get('/',async ( req, res) => {
  try {
    
   const lang = await DevLang.find()
   console.log("lang", lang)
   if (lang && lang.length > 0) {
    return res.json({ result: true, message: "Langages récupérés avec succès", lang });
  } else {
    return res.json({ result: false, message: "Aucun langage trouvé" });
  }

   } catch(error) {
    return res.json({ result: false, error: error.message });
  }

})
module.exports = router;
