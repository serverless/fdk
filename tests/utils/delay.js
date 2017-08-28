/*
 * @example
 * // Promise.resolve('info')
 * //  .then(delay(200)) // milliseconds
 * //  .then(result => console.log(result))
 */
module.exports = time => result => new Promise(resolve => setTimeout(() => resolve(result), time))
