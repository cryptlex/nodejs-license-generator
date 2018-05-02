
const fetch = require('node-fetch');

class HttpError extends Error {

    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class HttpClient {

    constructor(accessToken) {
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        };
    }

    async get(url) {
        console.log("sending http GET request...")
        console.time(`GET ${url}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: this.headers
        });
        console.timeEnd(`GET ${url}`);
        console.log("response status:", response.status);
        if (response.status == 200) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new HttpError(error.message, response.status);
        }
    }

    async post(url, body) {
        console.log("sending http POST request...")
        console.time(`POST ${url}`);
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: this.headers
        });
        console.timeEnd(`POST ${url}`);
        console.log("response status:", response.status);
        if (response.status == 200 || response.status == 201) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new HttpError(error.message, response.status);
        }
    }

    async put(url, body) {
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: this.headers
        });
        if (response.status == 200 || response.status == 204) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new HttpError(error.message, response.status);
        }
    }

    async patch(url, body) {
        const response = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: this.headers
        });
        if (response.status == 200 || response.status == 204) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new HttpError(error.message, response.status);
        }
    }

    async delete(url) {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: this.headers
        });
        if (response.status == 204) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new HttpError(error.message, response.status);
        }
    }
}

module.exports = HttpClient;