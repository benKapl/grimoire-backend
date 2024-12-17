var express = require('express');
var router = express.Router();

const { checkBody } = require("../modules/checkBody")
const DevLang = require("../models/dev_languages")
const EditorTheme = require("../models/editor_themes")

const jdoodleApi = process.env.JDOODLE_API
// jdoodle doc : https://docs.jdoodle.com/integrating-compiler-ide-to-your-application/compiler-api/rest-api

/* Request to execute code in tierce service */
router.post('/code', async (req, res) => {
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

/* Create a new language in database */
router.post("/languages", async (req, res) => {
  const isBodyValid = checkBody(req.body, ['displayValue', 'editorValue', "apiValue"]); // isExecutable not included because if false would not pass checkBody
  if (!isBodyValid) throw new Error('Missing or empty body parameter');

  try {
    const { displayValue, editorValue, apiValue, isExecutable } = req.body;

    const devLang = await DevLang.findOne({ displayValue });
    if (devLang) throw new Error('Language already is database');

    const newDevLang = await DevLang.create({
      displayValue,
      editorValue,
      apiValue,
      isExecutable
    });

    if (!newDevLang) throw new Error('Could not create language');
    res.json({ result: true, devLang: newDevLang });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
})

/* Get all dev languages in database */
router.get('/languages', async (req, res) => {
  try {
    const devLangs = await DevLang.find()

    if ((!devLangs) || (devLangs.length === 0)) throw new Error('Could not retrieve dev languages');
    
    return res.json({ result: true, dev_languages: devLangs });

  } catch(error) {
    return res.json({ result: false, error: error.message }); 
  }
})

/* Get one language by Id or Display Value */
router.get('/languages/type/:type/value/:value', async (req, res) => {
  try {
    const { type, value } = req.params
    let devLang = null
    
    if (type === "id") {
      devLang = await DevLang.findById(value)
    } else if (type === "display") {
      devLang = await DevLang.findOne({ displayValue: value })
    }

    if (!devLang) throw new Error('Could not retrieve dev language');
    
    return res.json({ result: true, language: devLang });

  } catch(error) {
    return res.json({ result: false, error: error.message });
  }
})




/* Create a new editor_theme in database */
router.post("/editor_themes", async (req, res) => {
  const isBodyValid = checkBody(req.body, ['displayValue', 'editorValue']); // isExecutable not included because if false would not pass checkBody
  if (!isBodyValid) throw new Error('Missing or empty body parameter');

  try {
    const { displayValue, editorValue } = req.body;

    const editorTheme = await EditorTheme.findOne({ displayValue });
    if (editorTheme) throw new Error('Theme already is database');

    const newEditorTheme = await EditorTheme.create({
      displayValue,
      editorValue,
    });
    
    if (!newEditorTheme) throw new Error('Could not create theme');
    res.json({ result: true, editorTheme: newEditorTheme });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
})

/* Get all editor_themes in database */
router.get('/editor_themes', async (req, res) => {
  try {
    const editorThemes = await EditorTheme.find()

    if ((!editorThemes) || (editorThemes.length === 0)) throw new Error('Could not retrieve themes');
    
    return res.json({ result: true, editor_themes: editorThemes });

  } catch(error) {
    return res.json({ result: false, error: error.message });
  }
})


module.exports = router;
