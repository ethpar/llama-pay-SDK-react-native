class BalanceRequest {
  final String? tokenAddress;

  BalanceRequest({required this.tokenAddress});
}

class TokenPrice {
  final double currentValue;
  final double currentPrice;
  final double priceChangePercentange24h;

  const TokenPrice({
    required this.currentValue,
    required this.currentPrice,
    required this.priceChangePercentange24h,
  });

  factory TokenPrice.fromJson(Map<String, dynamic> json) {
    return TokenPrice(
      currentValue: (json['currentValue'] as num).toDouble(),
      currentPrice: (json['currentPrice'] as num).toDouble(),
      priceChangePercentange24h:
          (json['priceChangePercentange24h'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'currentValue': currentValue,
      'currentPrice': currentPrice,
      'priceChangePercentange24h': priceChangePercentange24h,
    };
  }
}

class Balance {
  final String amount;
  final String? tokenAddress;
  final String imageUrl;
  final String tokenName;
  final int tokenDecimals;
  final String tokenSymbol;
  final double? currentPrice;
  final double? priceChangePercentange24h;

  const Balance({
    required this.amount,
    this.tokenAddress,
    required this.imageUrl,
    required this.tokenName,
    required this.tokenDecimals,
    required this.tokenSymbol,
    this.currentPrice,
    this.priceChangePercentange24h,
  });

  factory Balance.fromJson(Map<String, dynamic> json) {
    return Balance(
      amount: json['amount'] as String,
      tokenAddress: json['tokenAddress'] as String?,
      imageUrl: json['imageUrl'] as String,
      tokenName: json['token']['name'] as String,
      tokenDecimals: json['token']['decimals'] as int,
      tokenSymbol: json['token']['symbol'] as String,
      currentPrice:
          json['currentPrice'] != null
              ? (json['currentPrice'] as num).toDouble()
              : null,
      priceChangePercentange24h:
          json['priceChangePercentange24h'] != null
              ? (json['priceChangePercentange24h'] as num).toDouble()
              : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'amount': amount,
      'tokenAddress': tokenAddress,
      'imageUrl': imageUrl,
      'token': {
        'name': tokenName,
        'decimals': tokenDecimals,
        'symbol': tokenSymbol,
      },
      if (currentPrice != null) 'currentPrice': currentPrice,
      if (priceChangePercentange24h != null)
        'priceChangePercentange24h': priceChangePercentange24h,
    };
  }
}

class BalanceResponse {
  final String amount;
  final String? tokenAddress;
  final double currentPrice;
  final double priceChangePercentange24h;

  const BalanceResponse({
    required this.amount,
    this.tokenAddress,
    required this.currentPrice,
    required this.priceChangePercentange24h,
  });

  factory BalanceResponse.fromJson(Map<String, dynamic> json) {
    return BalanceResponse(
      amount: json['amount'] as String,
      tokenAddress: json['tokenAddress'] as String?,
      currentPrice: (json['currentPrice'] as num).toDouble(),
      priceChangePercentange24h:
          (json['priceChangePercentange24h'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'amount': amount,
      'tokenAddress': tokenAddress,
      'currentPrice': currentPrice,
      'priceChangePercentange24h': priceChangePercentange24h,
    };
  }
}
