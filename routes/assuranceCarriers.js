var express = require('express');
var router = express.Router();
var AssuranceCarrier = require('../models/assuranceCarrier');
var debug = require('debug')('assurance:server');
var verifyJWTToken = require('../verifyJWTToken');

/* GET assurance carriers listing. */
router.get('/', async function(req, res, next) {

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }

  try {
    const result = await AssuranceCarrier.find();
    res.send(result.map((c) => c.cleanup()));
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

/* GET an assurance carrier given and ID. */
router.get('/:id', async function(req, res, next) {

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }

  const assuranceCarrierId = req.params.id;

  try {
    const result = await AssuranceCarrier.findById(assuranceCarrierId);
    if (!result) {
      return res.status(404).send("Assurance carrier not found");
    }
    res.send(result.cleanup());
  } catch(e) {
    debug("DB problem", e);
    res.sendStatus(500);
  }
});

/* POST a new assurance carrier. */
router.post('/', async function(req, res, next) {

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }

  const { name, email, url } = req.body;

  const assuranceCarrier = new AssuranceCarrier({
    name,
    email,
    url
  });

  try {
    await assuranceCarrier.save();
    
    return res.sendStatus(201);
  } catch(e) {

    if (e.errors) {
      debug("Validation problem when saving assurance carrier");
      return res.status(400).send({ error: e.message });
    } else {
      debug("DB problem", e);
      return res.sendStatus(500);
    }
  }
});

/* DELETE an assurance carrier. */
router.delete('/:id', async (req, res, next) => {

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }

  const assuranceCarrierId = req.params.id;

  try {
    const result = await AssuranceCarrier.deleteOne({ _id: assuranceCarrierId });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Assurance carrier successfully deleted' });
    } else {
      res.status(404).json({ error: 'Assurance carrier not found' });
    }
  } catch (e) {
    debug("DB problem", e);
    res.sendStatus(500);
  }
});

module.exports = router;
