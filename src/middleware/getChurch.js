// Middleware
async function getChurch(req, res, next) {
    let church
    try {
        church = await Church.findById(req.params.id)
        if (student == null) {
            return res.status(404).json({ message: err.message })
        }
    } catch (err) {
        return res.status(500).json({ message: 'Cannot find church'})
    }

    res.church = student
    next()
}

module.exports = getChurch;