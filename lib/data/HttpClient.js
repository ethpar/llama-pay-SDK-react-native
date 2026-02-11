"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
class HttpClient {
    constructor(baseUrl, defaultHeaders = {}) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        this.defaultHeaders = defaultHeaders;
    }
    setBeforeRequestCallback(beforeRequest) {
        this.globalBeforeRequest = beforeRequest;
    }
    setAfterRequestCallback(afterRequest) {
        this.globalAfterRequest = afterRequest;
    }
    setDefaultHeaders(headers) {
        this.defaultHeaders = headers;
    }
    async request(endpoint, method, body, config = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            ...this.defaultHeaders,
            ...config.headers,
        };
        if (body && typeof body === "object") {
            body = JSON.stringify(body);
        }
        const request = {
            url,
            headers,
            method,
            body
        };
        if (this.globalBeforeRequest) {
            await this.globalBeforeRequest(request);
        }
        try {
            const response = await fetch(request.url, {
                method: request.method,
                headers: request.headers,
                body: request.body,
            });
            const responseBody = await response.json().catch(e => undefined);
            if (this.globalAfterRequest) {
                await this.globalAfterRequest(response, responseBody);
            }
            return responseBody;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(String(error));
        }
    }
    async get(endpoint, body, config) {
        return this.request(endpoint, "GET", body, config);
    }
    async post(endpoint, body, config) {
        return this.request(endpoint, "POST", body, config);
    }
    async put(endpoint, body, config) {
        return this.request(endpoint, "PUT", body, config);
    }
    async delete(endpoint, config) {
        return this.request(endpoint, "DELETE", undefined, config);
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=HttpClient.js.map