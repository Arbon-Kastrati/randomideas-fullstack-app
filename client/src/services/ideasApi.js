class IdeasApi {
    constructor() {
        this.api = 'http://localhost:8000/api/ideas';
    }

    async getIdeas() {
        try {
            const res = await fetch(this.api);
            return await this.#handleResponse(res);
        } catch (error) {
            console.log(error);
            return {
                success: false,
                error: 'Can not establish a connection with the server',
                type: 'NETWORK',
            };
        }
    }

    async updateIdea(idea) {
        try {
            const { _id: id, text, tag, username } = idea;
            const res = await fetch(this.api + '/' + id, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    tag,
                    username,
                }),
            });

            return await this.#handleResponse(res);
        } catch (error) {
            console.error(error);
            return {
                success: false,
                error: 'Can not establish a connection with the server',
                type: 'NETWORK',
            };
        }
    }

    async createIdea(idea) {
        try {
            const { text, tag, username } = idea;
            const res = await fetch(this.api, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    tag,
                    username,
                }),
            });

            return await this.#handleResponse(res);
        } catch (error) {
            console.error(error);
            return {
                success: false,
                error: 'Can not establish a connection with the server',
                type: 'NETWORK',
            };
        }
    }

    async deleteIdea(id, username) {
        try {
            const res = await fetch(this.api + '/' + id, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });
            return await this.#handleResponse(res);
        } catch (error) {
            console.log(error);
            return {
                success: false,
                error: 'Can not establish a connection with the server',
                type: 'NETWORK',
            };
        }
    }

    async #handleResponse(res) {
        if (res.status === 204) {
            return { success: true };
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const error = new Error(
                'Server responded with an unexpected format',
            );
            console.error(error);
            return { success: false, error: error.message, type: 'SERVER' };
        }

        const payload = await res.json();
        if (!res.ok) {
            const error = new Error(
                payload.error || 'Something went wrong on our end',
            );

            console.error(error);
            return {
                success: false,
                error: error.message,
                type:
                    res.status >= 400 && res.status < 500
                        ? 'VALIDATION'
                        : 'SERVER',
            };
        }

        return { success: true, data: payload.data };
    }
}

export default new IdeasApi();
