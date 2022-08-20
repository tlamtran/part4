const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requestLogger = (request, response, next) => {
    logger.info(`Method: ${request.method}   Path: ${request.path}   Body: ${request.body}`)
    next()
}

const unknownEndpont = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        response.status(400).send({error: 'Malformatted id'})
    }
    else if (error.name === 'ValidationError') {
        response.status(400).json({error: error.message})
    }
    else if (error.name === 'JsonWebTokenError') {
        response.status(401).json({error: 'invalid token'})
    }
    else if (error.name === 'TokenExpiredError') {
        response.status(401).json({error: 'token expired'})
    }

    next()
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }

    next()
}

const userExtractor = async (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        const token = authorization.substring(7)
        if (token) {
            const verifiedToken = jwt.verify(token, process.env.SECRET)
            request.user = await User.findById(verifiedToken.id) 
        }
        else response.status(401).json({error: 'token missing'})
    }

    next()
}

module.exports = {
    requestLogger,
    unknownEndpont,
    errorHandler,
    tokenExtractor,
    userExtractor
}