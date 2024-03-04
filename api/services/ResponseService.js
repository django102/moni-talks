module.exports = {
    json(status, res, message, data, meta) {
        if (status > 201) {

        }

        const response = { status: true, message };

        if (status > 299) {
            response.status = false;
        }

        if (typeof data !== 'undefined') {
            response.data = data;
        }

        if (typeof meta !== 'undefined') {
            response.meta = meta;
        }

        return res.status(status).json(response);
    },

    nojson(status, res, message, data) {
        const response = data;
        return res.status(status).json(response);
    }
}