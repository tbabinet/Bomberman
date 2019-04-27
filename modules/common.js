const events = require('events');
let em = new events.EventEmitter();
em.setMaxListeners(Number.POSITIVE_INFINITY);
module.exports.commonEmitter = em;

/**
 * Permet d'avoir un dispatcher/receveur d'évènements global
 */