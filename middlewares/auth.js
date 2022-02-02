const jwt = require('jsonwebtoken')
const Seller = require('../models/seller')
const auth = {}
auth.isLoggedIn = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const seller = await Seller.findOne({ _id: decoded._id, 'token': token })

        if (!seller) {
            // const AuthenticationError = Error.prototype
            // AuthenticationError.message = 'Please authenticate!'
            // AuthenticationError.name = "AuthenticationError"
            // throw AuthenticationError
            return res.status(401).send({ error: 'Please authenticate!' })
        }

        req.token = token
        req.seller = seller
        next()
    } catch (e) {
        return res.status(401).send({ error: 'Please authenticate!' })
    }
}

module.exports = auth