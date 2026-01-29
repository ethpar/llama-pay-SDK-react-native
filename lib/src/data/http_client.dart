import 'dart:convert';
import 'package:http/http.dart' as http;

enum HttpMethod { get, post, put, delete }

typedef RequestBody = Map<String, dynamic> | List<Map<String, dynamic>> | String;

class Request {
  final String url;
  final HttpMethod method;
  final Map<String, String> headers;
  final RequestBody? body;

  const Request({
    required this.url,
    required this.method,
    required this.headers,
    this.body,
  });
}

class RequestConfig {
  final Map<String, String>? headers;
  final Future<void> Function(Request)? beforeRequest;
  final Future<void> Function(http.Response)? afterRequest;

  const RequestConfig({
    this.headers,
    this.beforeRequest,
    this.afterRequest,
  });
}

class HttpClient {
  final String baseUrl;
  Map<String, String> defaultHeaders;
  Future<void> Function(Request)? globalBeforeRequest;
  Future<void> Function(http.Response)? globalAfterRequest;

  HttpClient(this.baseUrl, [Map<String, String> defaultHeaders = const {}])
      : defaultHeaders = Map<String, String>.from(defaultHeaders) {
    // Remove trailing slash from baseUrl if present
    if (baseUrl.endsWith('/')) {
      this.baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    } else {
      this.baseUrl = baseUrl;
    }
  }

  void setBeforeRequestCallback(Future<void> Function(Request)? beforeRequest) {
    globalBeforeRequest = beforeRequest;
  }

  void setAfterRequestCallback(Future<void> Function(http.Response)? afterRequest) {
    globalAfterRequest = afterRequest;
  }

  void setDefaultHeaders(Map<String, String> headers) {
    defaultHeaders = Map<String, String>.from(headers);
  }

  Future<T> request<T>(
    String endpoint,
    HttpMethod method, [
    RequestBody? body,
    RequestConfig config = const RequestConfig(),
  ]) async {
    final url = '$baseUrl$endpoint';
    final headers = {
      ...defaultHeaders,
      ...?config.headers,
    };

    String? encodedBody;
    if (body != null && body is Map<String, dynamic> || body is List<Map<String, dynamic>>) {
      encodedBody = jsonEncode(body);
    } else if (body is String) {
      encodedBody = body;
    }

    final request = Request(
      url: url,
      method: method,
      headers: headers,
      body: encodedBody,
    );

    if (globalBeforeRequest != null) {
      await globalBeforeRequest!(request);
    }

    if (config.beforeRequest != null) {
      await config.beforeRequest!(request);
    }

    try {
      final response = await _sendRequest(request);

      if (globalAfterRequest != null) {
        await globalAfterRequest!(response);
      }

      if (config.afterRequest != null) {
        await config.afterRequest!(response);
      }

      final responseBody = await _parseResponse<T>(response);
      return responseBody;
    } catch (error) {
      if (error is Exception) {
        rethrow;
      }
      throw Exception(error.toString());
    }
  }

  Future<http.Response> _sendRequest(Request request) async {
    switch (request.method) {
      case HttpMethod.get:
        return await http.get(
          Uri.parse(request.url),
          headers: request.headers,
        );
      case HttpMethod.post:
        return await http.post(
          Uri.parse(request.url),
          headers: request.headers,
          body: request.body,
        );
      case HttpMethod.put:
        return await http.put(
          Uri.parse(request.url),
          headers: request.headers,
          body: request.body,
        );
      case HttpMethod.delete:
        return await http.delete(
          Uri.parse(request.url),
          headers: request.headers,
          body: request.body,
        );
    }
  }

  Future<T> _parseResponse<T>(http.Response response) async {
    if (response.body.isEmpty) {
      return {} as T;
    }

    try {
      final decodedBody = jsonDecode(response.body);
      return decodedBody as T;
    } catch (e) {
      // If JSON parsing fails, return the raw body as string
      return response.body as T;
    }
  }

  Future<T> get<T>(
    String endpoint, [
    RequestBody? body,
    RequestConfig? config,
  ]) async {
    return request<T>(endpoint, HttpMethod.get, body, config ?? const RequestConfig());
  }

  Future<T> post<T>(
    String endpoint, [
    RequestBody? body,
    RequestConfig? config,
  ]) async {
    return request<T>(endpoint, HttpMethod.post, body, config ?? const RequestConfig());
  }

  Future<T> put<T>(
    String endpoint,
    RequestBody body, [
    RequestConfig? config,
  ]) async {
    return request<T>(endpoint, HttpMethod.put, body, config ?? const RequestConfig());
  }

  Future<T> delete<T>(
    String endpoint, [
    RequestConfig? config,
  ]) async {
    return request<T>(endpoint, HttpMethod.delete, null, config ?? const RequestConfig());
  }
}
