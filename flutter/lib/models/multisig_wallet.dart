import 'bin_info.dart';

class Signer {
  final String id;
  final String address;
  final String? userId;
  final DateTime? acceptedOn;

  const Signer({
    required this.id,
    required this.address,
    this.userId,
    this.acceptedOn,
  });

  factory Signer.fromJson(Map<String, dynamic> json) {
    return Signer(
      id: json['id'] as String,
      address: json['address'] as String,
      userId: json['userId'] as String?,
      acceptedOn: json['acceptedOn'] != null 
          ? DateTime.parse(json['acceptedOn'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'address': address,
      if (userId != null) 'userId': userId,
      if (acceptedOn != null) 'acceptedOn': acceptedOn!.toIso8601String(),
    };
  }
}

class MultisigWallet {
  final String address;
  final int m;
  final int n;
  final String? executorAddress;
  final List<Signer> signers;
  final String? creationHash;

  const MultisigWallet({
    required this.address,
    required this.m,
    required this.n,
    this.executorAddress,
    required this.signers,
    this.creationHash,
  });

  factory MultisigWallet.fromJson(Map<String, dynamic> json) {
    return MultisigWallet(
      address: json['address'] as String,
      m: json['m'] as int,
      n: json['n'] as int,
      executorAddress: json['executorAddress'] as String?,
      signers: (json['signers'] as List<dynamic>)
          .map((e) => Signer.fromJson(e as Map<String, dynamic>))
          .toList(),
      creationHash: json['creationHash'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'address': address,
      'm': m,
      'n': n,
      if (executorAddress != null) 'executorAddress': executorAddress,
      'signers': signers.map((e) => e.toJson()).toList(),
      if (creationHash != null) 'creationHash': creationHash,
    };
  }
}

class BaseMultisigWallet {
  final String id;
  final String name;
  final String userId;
  final MultisigWallet wallet;
  final DateTime createdOn;

  const BaseMultisigWallet({
    required this.id,
    required this.name,
    required this.userId,
    required this.wallet,
    required this.createdOn,
  });

  factory BaseMultisigWallet.fromJson(Map<String, dynamic> json) {
    return BaseMultisigWallet(
      id: json['id'] as String,
      name: json['name'] as String,
      userId: json['userId'] as String,
      wallet: MultisigWallet.fromJson(json['wallet'] as Map<String, dynamic>),
      createdOn: DateTime.parse(json['createdOn'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'userId': userId,
      'wallet': wallet.toJson(),
      'createdOn': createdOn.toIso8601String(),
    };
  }
}

class CreditCardMultisigWallet extends BaseMultisigWallet {
  final String panLastDigits;
  final String panHash;
  final String binHash;
  final BinInfo? binInfo;
  final String type;

  const CreditCardMultisigWallet({
    required super.id,
    required super.name,
    required super.userId,
    required super.wallet,
    required super.createdOn,
    required this.panLastDigits,
    required this.panHash,
    required this.binHash,
    this.binInfo,
    this.type = 'credit-card',
  });

  factory CreditCardMultisigWallet.fromJson(Map<String, dynamic> json) {
    return CreditCardMultisigWallet(
      id: json['id'] as String,
      name: json['name'] as String,
      userId: json['userId'] as String,
      wallet: MultisigWallet.fromJson(json['wallet'] as Map<String, dynamic>),
      createdOn: DateTime.parse(json['createdOn'] as String),
      panLastDigits: json['panLastDigits'] as String,
      panHash: json['panHash'] as String,
      binHash: json['binHash'] as String,
      binInfo: json['binInfo'] != null 
          ? BinInfo.fromJson(json['binInfo'] as Map<String, dynamic>)
          : null,
      type: json['type'] as String? ?? 'credit-card',
    );
  }

  @override
  Map<String, dynamic> toJson() {
    final baseJson = super.toJson();
    baseJson.addAll({
      'panLastDigits': panLastDigits,
      'panHash': panHash,
      'binHash': binHash,
      if (binInfo != null) 'binInfo': binInfo!.toJson(),
      'type': type,
    });
    return baseJson;
  }
}

class GeneralMultisigWallet extends BaseMultisigWallet {
  final String creatorId;
  final String type;
  final List<String?> signerIds;
  final List<String> signerAddresses;

  const GeneralMultisigWallet({
    required super.id,
    required super.name,
    required super.userId,
    required super.wallet,
    required super.createdOn,
    required this.creatorId,
    this.type = 'general',
    required this.signerIds,
    required this.signerAddresses,
  });

  factory GeneralMultisigWallet.fromJson(Map<String, dynamic> json) {
    return GeneralMultisigWallet(
      id: json['id'] as String,
      name: json['name'] as String,
      userId: json['userId'] as String,
      wallet: MultisigWallet.fromJson(json['wallet'] as Map<String, dynamic>),
      createdOn: DateTime.parse(json['createdOn'] as String),
      creatorId: json['creatorId'] as String,
      type: json['type'] as String? ?? 'general',
      signerIds: (json['signerIds'] as List<dynamic>)
          .map((e) => e as String?)
          .toList(),
      signerAddresses: (json['signerAddresses'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
    );
  }

  @override
  Map<String, dynamic> toJson() {
    final baseJson = super.toJson();
    baseJson.addAll({
      'creatorId': creatorId,
      'type': type,
      'signerIds': signerIds,
      'signerAddresses': signerAddresses,
    });
    return baseJson;
  }
}
