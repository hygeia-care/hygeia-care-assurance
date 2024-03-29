var express = require('express');
var router = express.Router();
var Fee = require('../models/fee');
var AssuranceCarrier = require('../models/assuranceCarrier');
var debug = require('debug')('assurance:server');
var verifyJWTToken = require('../verifyJWTToken');

/* GET fees listing. */
router.get('/', async function(req, res, next) {

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }

  try {
    const result = await Fee.find();
    res.send(result.map((c) => c.cleanup()));
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

/* GET a fee given and ID. */
router.get('/:id', async function(req, res, next) {

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }

  const feeId = req.params.id;

  try {
    const result = await Fee.findById(feeId);
    if (!result) {
      return res.status(404).send("Fee not found");
    }
    res.send(result.cleanup());
  } catch(e) {
    debug("DB problem", e);
    res.sendStatus(500);
  }
});

/* POST a new fee. */
router.post('/', async function(req, res, next) {

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }

  const { name, services, idAssuranceCarrier } = req.body;

  try {
    const result = await AssuranceCarrier.findById(idAssuranceCarrier);
    if (!result) {
      return res.status(404).send("Assurance carrier not found");
    }
  } catch (e){
    console.log("DB problem", e);
    return res.sendStatus(500).send("There was an error retrieving hte assurance carrier");
  }

  const fee = new Fee({
    name,
    services,
    idAssuranceCarrier
  });

  try {
    await fee.save();
    
    return res.sendStatus(201);
  } catch(e) {

    if (e.errors) {
      debug("Validation problem when saving fee");
      return res.status(400).send({ error: e.message });
    } else {
      debug("DB problem", e);
      return res.sendStatus(500);
    }
  }
});

/* DELETE a fee. */
router.delete('/:id', async (req, res, next) => {

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }

  const feeId = req.params.id;

  try {
    const result = await Fee.deleteOne({ _id: feeId });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Fee successfully deleted' });
    } else {
      res.status(404).json({ error: 'Fee not found' });
    }
  } catch (e) {
    debug("DB problem", e);
    res.sendStatus(500);
  }
});

module.exports = router;
