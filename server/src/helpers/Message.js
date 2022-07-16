/**
 * Message(res,status,message) v1.0 handling the messages
 * @param {res} res the response
 * @param {Number} status the status code
 * @param {String} message the message will send to the frontend
 * @returns
 */
const Message = (res, status, message) => {
  return res.status(status).json({
    message,
  });
};

module.exports = Message;
