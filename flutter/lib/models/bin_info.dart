class BinInfo {
  final BinNumber? number;
  final String? scheme;
  final String? type;
  final String? brand;
  final BinCountry? country;
  final BinBank? bank;

  const BinInfo({
    this.number,
    this.scheme,
    this.type,
    this.brand,
    this.country,
    this.bank,
  });

  factory BinInfo.fromJson(Map<String, dynamic> json) {
    return BinInfo(
      number: json['number'] != null ? BinNumber.fromJson(json['number'] as Map<String, dynamic>) : null,
      scheme: json['scheme'] as String?,
      type: json['type'] as String?,
      brand: json['brand'] as String?,
      country: json['country'] != null ? BinCountry.fromJson(json['country'] as Map<String, dynamic>) : null,
      bank: json['bank'] != null ? BinBank.fromJson(json['bank'] as Map<String, dynamic>) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (number != null) 'number': number!.toJson(),
      if (scheme != null) 'scheme': scheme,
      if (type != null) 'type': type,
      if (brand != null) 'brand': brand,
      if (country != null) 'country': country!.toJson(),
      if (bank != null) 'bank': bank!.toJson(),
    };
  }
}

class BinNumber {
  final int length;
  final bool luhn;

  const BinNumber({
    required this.length,
    required this.luhn,
  });

  factory BinNumber.fromJson(Map<String, dynamic> json) {
    return BinNumber(
      length: json['length'] as int,
      luhn: json['luhn'] as bool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'length': length,
      'luhn': luhn,
    };
  }
}

class BinCountry {
  final String numeric;
  final String alpha2;
  final String name;
  final String emoji;
  final String currency;
  final double latitude;
  final double longitude;

  const BinCountry({
    required this.numeric,
    required this.alpha2,
    required this.name,
    required this.emoji,
    required this.currency,
    required this.latitude,
    required this.longitude,
  });

  factory BinCountry.fromJson(Map<String, dynamic> json) {
    return BinCountry(
      numeric: json['numeric'] as String,
      alpha2: json['alpha2'] as String,
      name: json['name'] as String,
      emoji: json['emoji'] as String,
      currency: json['currency'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'numeric': numeric,
      'alpha2': alpha2,
      'name': name,
      'emoji': emoji,
      'currency': currency,
      'latitude': latitude,
      'longitude': longitude,
    };
  }
}

class BinBank {
  final String name;
  final String? url;
  final String? phone;
  final String? city;

  const BinBank({
    required this.name,
    this.url,
    this.phone,
    this.city,
  });

  factory BinBank.fromJson(Map<String, dynamic> json) {
    return BinBank(
      name: json['name'] as String,
      url: json['url'] as String?,
      phone: json['phone'] as String?,
      city: json['city'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      if (url != null) 'url': url,
      if (phone != null) 'phone': phone,
      if (city != null) 'city': city,
    };
  }
}
