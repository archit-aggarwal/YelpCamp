// This is a Async Error Handler Wrapper which prevents 
// writing try-catch everywhere

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}