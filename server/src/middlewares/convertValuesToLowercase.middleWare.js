

const convertValuesToLowercase = (req, res, next) => {
    // Convert query parameters values to lowercase
    if (req.query) {
        for (const key in req.query) {
            if (typeof req.query[key] === "string") {
                req.query[key] = req.query[key].toLowerCase();
            }
        }
    }

    // Convert request body values to lowercase
    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === "string") {
                req.body[key] = req.body[key].toLowerCase();
            }
        }
    }

    next(); // Move to the next middleware or route handler
};

module.exports = { convertValuesToLowercase };
