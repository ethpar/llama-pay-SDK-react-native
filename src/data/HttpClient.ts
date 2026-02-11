type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type Body = Record<string, any> | Record<string, any>[] | string;

type Request = {
  url: string
  method: HttpMethod
  headers: Record<string, string>,
  body?: BodyInit
}

interface RequestConfig {
  headers?: Record<string, string>;
}

export class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private globalBeforeRequest?: (
    req: Request
  ) => void | Promise<void>;
  private globalAfterRequest?: (response: Response, responseBody: any) => void | Promise<void>;

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    this.defaultHeaders = defaultHeaders;
  }

  setBeforeRequestCallback(
    beforeRequest?: (req: Request) => void | Promise<void>,
  ) {
    this.globalBeforeRequest = beforeRequest;
  }

  setAfterRequestCallback(
    afterRequest?: (response: Response) => void | Promise<void>,
  ) {
    this.globalAfterRequest = afterRequest;
  }

  setDefaultHeaders(headers: Record<string, string>) {
    this.defaultHeaders = headers;
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    body?: Body,
    config: RequestConfig = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      ...this.defaultHeaders,
      ...config.headers,
    };

    if (body && typeof body === "object") {
      body = JSON.stringify(body);
    }
    
    const request: Request = {
      url,
      headers,
      method,
      body
    }
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
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(String(error));
    }
  }

  async get<T>(endpoint: string, body?: Body, config?: RequestConfig): Promise<T> {
    return this.request(endpoint, "GET", body, config) as T;
  }

  async post<T>(
    endpoint: string,
    body?: Body,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request(endpoint, "POST", body, config) as T;
  }

  async put<T>(
    endpoint: string,
    body: Body,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request(endpoint, "PUT", body, config) as T;
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request(endpoint, "DELETE", undefined, config) as T;
  }
}
