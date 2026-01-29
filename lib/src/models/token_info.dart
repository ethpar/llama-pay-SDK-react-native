class TokenInfo {
  final String? tokenAddress;
  final String imageUrl;
  final Token token;

  const TokenInfo({
    this.tokenAddress,
    required this.imageUrl,
    required this.token,
  });

  factory TokenInfo.fromJson(Map<String, dynamic> json) {
    return TokenInfo(
      tokenAddress: json['tokenAddress'] as String?,
      imageUrl: json['imageUrl'] as String,
      token: Token.fromJson(json['token'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'tokenAddress': tokenAddress,
      'imageUrl': imageUrl,
      'token': token.toJson(),
    };
  }
}

class Token {
  final String name;
  final int decimals;
  final String symbol;

  const Token({
    required this.name,
    required this.decimals,
    required this.symbol,
  });

  factory Token.fromJson(Map<String, dynamic> json) {
    return Token(
      name: json['name'] as String,
      decimals: json['decimals'] as int,
      symbol: json['symbol'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'decimals': decimals,
      'symbol': symbol,
    };
  }
}
