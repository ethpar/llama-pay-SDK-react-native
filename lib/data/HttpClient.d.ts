type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Body = Record<string, any> | Record<string, any>[] | string;
type Request = {
    url: string;
    method: HttpMethod;
    headers: Record<string, string>;
    body?: BodyInit;
};
interface RequestConfig {
    headers?: Record<string, string>;
    beforeRequest?: (req: Request) => void | Promise<void>;
    afterRequest?: (response: Response) => void | Promise<void>;
}
export declare class HttpClient {
    private baseUrl;
    private defaultHeaders;
    private globalBeforeRequest?;
    private globalAfterRequest?;
    constructor(baseUrl: string, defaultHeaders?: Record<string, string>);
    setBeforeRequestCallback(beforeRequest?: (req: Request) => void | Promise<void>): void;
    setAfterRequestCallback(afterRequest?: (response: Response) => void | Promise<void>): void;
    setDefaultHeaders(headers: Record<string, string>): void;
    private request;
    get<T>(endpoint: string, body?: Body, config?: RequestConfig): Promise<T>;
    post<T>(endpoint: string, body?: Body, config?: RequestConfig): Promise<T>;
    put<T>(endpoint: string, body: Body, config?: RequestConfig): Promise<T>;
    delete<T>(endpoint: string, config?: RequestConfig): Promise<T>;
}
export {};
//# sourceMappingURL=HttpClient.d.ts.map