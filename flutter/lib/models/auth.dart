class LoginResponse {
  final String sessionKey;

  const LoginResponse({required this.sessionKey});

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      sessionKey: json['sessionKey'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'sessionKey': sessionKey,
    };
  }
}