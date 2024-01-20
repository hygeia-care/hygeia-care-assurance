var express = require('express');
var router = express.Router();
var Authorization = require('../models/authorization');
var debug = require('debug')('assurance:server');
var verifyJWTToken = require('../verifyJWTToken');

/* GET authorizations listing. */
router.get('/', async function(req, res, next) {

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }

  try {
    const result = await Authorization.find();
    res.send(result.map((c) => c.cleanup()));
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

/* GET an authorization given and ID. */
router.get('/:id', async function(req, res, next) {

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }

  const authorizationId = req.params.id;

  try {
    const result = await Authorization.findById(authorizationId);
    if (!result) {
      return res.status(404).send("Authorization not found");
    }
    res.send(result.cleanup());
  } catch(e) {
    debug("DB problem", e);
    res.sendStatus(500);
  }
});

/* POST a new authorization. */
router.post('/', async function(req, res, next) {

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }

  const { name, authDate, serviceDate, description, acceptance, idAppointment } = req.body;

  const authorization = new Authorization({
    name,
    authDate,
    serviceDate,
    description,
    acceptance,
    idAppointment
  });

  try {
    await authorization.save();
    
    return res.sendStatus(201);
  } catch(e) {

    if (e.errors) {
      debug("Validation problem when saving authorization");
      return res.status(400).send({ error: e.message });
    } else {
      debug("DB problem", e);
      return res.sendStatus(500);
    }
  }
});

/* DELETE an authorization. */
router.delete('/:id', async (req, res, next) => {

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }
  
  const authorizationId = req.params.id;

  try {
    const result = await Authorization.deleteOne({ _id: authorizationId });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Authorization successfully deleted' });
    } else {
      res.status(404).json({ error: 'Authorization not found' });
    }
  } catch (e) {
    debug("DB problem", e);
    res.sendStatus(500);
  }
});

/* PUT an authorization. */
router.put('/:id', async function(req, res, next) {

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }

  const authorizationId = req.params.id;
  const updateData = req.body;

  try {
    const result = await Authorization.findByIdAndUpdate(authorizationId, updateData, { new: true });

    if (!result) {
      return res.status(404).send("Authorization not found");
    }

    res.send(result.cleanup()); 
  } catch(e) {
    
    if (e.errors) {
      debug("Validation problem when updating authorization");
      return res.status(400).send({ error: e.message });
    } else {
      debug("DB problem", e);
      return res.sendStatus(500);
    }
  }
});

module.exports = router;
