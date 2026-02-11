export default interface ResponseWrapper<T> {
    result: 'ok' | 'error'
    error: {
        code: string
        server_message: string
    } | null
    data: T
}
