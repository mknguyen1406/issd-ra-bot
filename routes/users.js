const errors = require("restify-errors");
const User = require("../models/User");

module.exports = server => {

    // Get users
    server.get("/users", async (req, res, next) => {
        
        try {
            // Get all users
            const users = await User.find({});

            // Send users
            res.send(users);

            next();
        } catch(err) {
            return next(new errors.InvalidContentError(err));
        }        
    });

    // Get single user
    server.get("/users/:id", async (req, res, next) => {
        
        try {
            // Get all users
            const users = await User.findById(req.params.id);

            // Send users
            res.send(users);

            next();
        } catch(err) {
            return next(
                new errors.ResourceNotFoundError(
                    `There is no customer with the id of ${req.params.id}`
                ));
        }        
    });

    // Add users
    server.post("/users", async (req, res, next) => {

        // Check for JSON
        if (!req.is("application/json")) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        const user = new User({
            userId: req.body.userId,
            cashout: {
                portfolio: req.body.cashout.portfolio,
                budget: req.body.cashout.budget
            },
            holdings: req.body.holdings,
            invests: req.body.invests,
            prices: req.body.prices,
            prod: req.body.prod
        });

        try {
            // Save new user to database
            const newUser = await user.save();
            res.send(201);
            next();
        } catch(err) {
            return next(new errors.InternalError(err.message));
        }
    });

    // Update users
    server.put("/users/:id", async (req, res, next) => {

        // Check for JSON
        if (!req.is("application/json")) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        try {
            // Update user in database
            const user = await User.findOneAndUpdate(
                {_id: req.params.id},
                req.body
             );
            res.send(200);
            next();
        } catch(err) {
            return next(
                new errors.ResourceNotFoundError(
                    `There is no customer with the id of ${req.params.id}`
                ));
        }
    });

    // Delete user
    server.del("/users/:id", async (req, res, next) => {
        try {
            const customer = await User.findOneAndRemove({ _id: req.params.id });
            res.send(204);
            next();
        } catch(err) {
            return next(
                new errors.ResourceNotFoundError(
                    `There is no customer with the id of ${req.params.id}`
                ));
        }
    });
}