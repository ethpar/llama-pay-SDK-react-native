enum WalletType {
  hd,
  single;

  static WalletType fromString(String value) {
    switch (value.toLowerCase()) {
      case 'hd':
        return WalletType.hd;
      case 'single':
        return WalletType.single;
      default:
        throw ArgumentError('Invalid WalletType: $value');
    }
  }

  String toJson() {
    return name;
  }
}

class HDWallet {
  final String id;
  final String name;
  final String mnemonic;

  const HDWallet({
    required this.id,
    required this.name,
    required this.mnemonic,
  });

  factory HDWallet.fromJson(Map<String, dynamic> json) {
    return HDWallet(
      id: json['id'] as String,
      name: json['name'] as String,
      mnemonic: json['mnemonic'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'mnemonic': mnemonic,
    };
  }
}

class Account {
  final String id;
  final String name;
  final String address;
  final WalletType type;
  final String? walletId;
  final String? privateKey;
  final String? derivationPath;

  const Account({
    required this.id,
    required this.name,
    required this.address,
    required this.type,
    this.walletId,
    this.privateKey,
    this.derivationPath,
  });

  factory Account.fromJson(Map<String, dynamic> json) {
    return Account(
      id: json['id'] as String,
      name: json['name'] as String,
      address: json['address'] as String,
      type: WalletType.fromString(json['type'] as String),
      walletId: json['walletId'] as String?,
      privateKey: json['privateKey'] as String?,
      derivationPath: json['derivationPath'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'address': address,
      'type': type.toJson(),
      if (walletId != null) 'walletId': walletId,
      if (privateKey != null) 'privateKey': privateKey,
      if (derivationPath != null) 'derivationPath': derivationPath,
    };
  }
}
