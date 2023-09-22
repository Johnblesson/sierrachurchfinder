const express = require('express')
const router = express.Router()
const Church = require('../models/churches')
const getChurch = require('../middleware/getChurch')

router.get('/', async (req, res) => {
    try {
        const churches = await Church.find()
        res.json(churches)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
    
})

router.get('/:id', getChurch, (req, res) => {
    res.json(res.churches)
})

// Create A Church
router.post('/', async (req, res) => {
  try {  
  const churches = {
    id: req.body.id,
    name: req.body.name,
    address: req.body.address,
    logo: req.body.logo,
    contact: req.body.contact,
    location: req.body.location,
    };

    const createdChurches = await Church.insertMany(churches);
    res.status(201).json(createdChurches);
  }catch (err) {
    res.status(400).json({ message: err.message });
}
});
    // try {
    //     const newChurch = await churches.save()
    //     res.status(201).json(newChurch)
    // } catch (err) {
    //     res.status(400).json({ message: err.message});
    // }


// Update A Church
router.patch('/:id', getChurch, async (req, res) => {
    if (req.body.name != null) {
      res.churches.name = req.body.name
    }
    if (req.body.address != null) {
      res.student.address = req.body.address
    }
    if (req.body.logo != null) {
        res.student.logo = req.body.logo
      }
      if (req.body.contact != null) {
        res.student.contact = req.body.contact
      }
      if (req.body.location != null) {
        res.student.location = req.body.location
      }
    try {
      const updatedChurch = await res.churches.save()
      res.json(updatedChurch)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

  // Deleting A Church
router.delete('/:id', getChurch, async (req, res) => {
    try {
      await res.churches.remove()
      res.json({ message: 'Church Deleted' })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })


module.exports = router