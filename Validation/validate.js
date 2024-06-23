const {body} = require( 'express-validator' );

const validation_schema =  [
    body("name")
        .isString()
        .notEmpty()
        .withMessage( 'Name must required'),

    body("description")
        .isString()
        .notEmpty()
        .withMessage( 'description must required'),
    
    body("price")
        .isNumeric()
        .withMessage('Price must be numeric value')
        .isLength({min: 2, max:5} , `the price length Should be less than 5 and more than 2`),
]
module.exports = 
{
    validation_schema
}