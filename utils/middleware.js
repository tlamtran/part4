const logger = require('./logger')

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

module.exports = {
    requestLogger,
    unknownEndpont,
    errorHandler
}