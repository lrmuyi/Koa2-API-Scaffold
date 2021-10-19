const schedule = require('node-schedule');

class TaskJob {

    constructor(options) {
        this.option = options
    }

    job(cb) {
        return schedule.scheduleJob(this.option, cb)
    }
}

module.exports = new TaskJob()