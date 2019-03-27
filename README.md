Cycle
=====

// initial commit

Re-commerce back end app for buying and selling bicycles. It was written using Mongoose/Node/Express, and tested with Mocha/Chai.

## Get Started
1. Fork and clone the repo.
1. Run npm i inside the directory to install all the necessary packages.
1. Make your own .env with the correct MongoDB URI, PORT, and APP_SECRET. Look at the .env.example file as a guide.
1. In a new terminal window, run your Mongo server.
1. Run npm start to start the server.
1. Run npm run test:watch to run the tests and build the necessary collections in your MongoDB.
1. Run npm run db:load:all to use provided mock data.

## API/Paths with methods
### Users:
* POST - /api/auth/signup - signs up a new user.
* POST - /api/auth/signin - signs in an existing user.
* GET - /api/users- gets a list of all signed up users.
* GET - /api/users/:id - gets a user by id.
* GET - /api/users/:id/bikes - gets all bikes owned by a specific user.
* GET - /api/users/:id/sales - gets all sales posted by a specific user.
* PUT - /api/users/:id - allows user to update their profile.
* DELETE - /api/users/:id - allows user to delete their profile.
### Bikes:
* POST - /api/bikes - posts a bike.
* GET - /api/bikes - gets a list of all bikes.
* GET - /api/bikes/:id - gets a bike by id.
* GET - /api/bikes/models - gets bikes by model with price and quantity available.
* GET - /api/bikes/manufacturers - gets bikes by manufacturers with model and quantity available.
* GET - /api/bikes/types - gets bikes by type with model, price, and quantity available.
* GET - /api/bikes/years - gets bikes by year with model, price, and quantity available.
* PUT - /api/bikes/:id - allows owner to update their bike details.
* DELETE - /api/bikes/:id - allows owner to delete their bike.
### Sales:
* POST /api/sales - allows owner of a bike to post a sale.
* POST /api/sales/:id/offers - allows user to post an offer to a sale.
* PUT /api/sales/:id/:userId - allows owner to update 'sold' field and deletes bike from database.
* GET /api/sales - gets a list sales.
* GET /api/sales/:id - gets a sale by id.
* DELETE /api/sales/:id/userId - allows owner to delete their sale.

### Created by:
Robyn Navarro, Antreo Pukay, Mario Quintana, Injoong Yoon.