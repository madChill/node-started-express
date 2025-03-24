// create service template response service {success, data, message}

class ResponseService {
    instance = null
    constructor() {
        if (!ResponseService.instance) {
            ResponseService.instance = this;
        }
        return ResponseService.instance;
    }
    getInstance() {
        if (!ResponseService.instance) {
            ResponseService.instance = new ResponseService();
        }
        return ResponseService.instance;
    }
    success({ data = null, message = 'Operation successful', statusCode = 204 }) {
        return {
            success: true,
            statusCode,
            message,
            data,
        };
    }
}
module.exports = new ResponseService();