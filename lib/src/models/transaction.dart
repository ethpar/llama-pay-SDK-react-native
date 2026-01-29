import 'simple_multisig_transaction_data.dart';

enum AssetType {
  native,
  erc20;

  static AssetType fromString(String value) {
    switch (value.toLowerCase()) {
      case 'native':
        return AssetType.native;
      case 'erc20':
        return AssetType.erc20;
      default:
        throw ArgumentError('Invalid AssetType: $value');
    }
  }

  String toJson() {
    return name;
  }
}

enum TransactionStatus {
  pending,
  completed,
  failed;

  static TransactionStatus fromString(String value) {
    switch (value.toLowerCase()) {
      case 'pending':
        return TransactionStatus.pending;
      case 'completed':
        return TransactionStatus.completed;
      case 'failed':
        return TransactionStatus.failed;
      default:
        throw ArgumentError('Invalid TransactionStatus: $value');
    }
  }

  String toJson() {
    return name;
  }
}

enum TransactionType {
  normal,
  merchant;

  static TransactionType fromString(String value) {
    switch (value.toLowerCase()) {
      case 'normal':
        return TransactionType.normal;
      case 'merchant':
        return TransactionType.merchant;
      default:
        throw ArgumentError('Invalid TransactionType: $value');
    }
  }

  String toJson() {
    return name;
  }
}

class TransactionAsset {
  final String? tokenAddress;
  final String symbol;
  final int decimals;
  final String? image;

  const TransactionAsset({
    this.tokenAddress,
    required this.symbol,
    required this.decimals,
    this.image,
  });

  factory TransactionAsset.fromJson(Map<String, dynamic> json) {
    return TransactionAsset(
      tokenAddress: json['tokenAddress'] as String?,
      symbol: json['symbol'] as String,
      decimals: json['decimals'] as int,
      image: json['image'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (tokenAddress != null) 'tokenAddress': tokenAddress,
      'symbol': symbol,
      'decimals': decimals,
      if (image != null) 'image': image,
    };
  }
}

class FeeQuote {
  final String gasLimit;
  final String? maxFeePerGas;
  final String? maxPriorityFeePerGas;
  final String? gasPrice;
  final String? totalWei;

  const FeeQuote({
    required this.gasLimit,
    this.maxFeePerGas,
    this.maxPriorityFeePerGas,
    this.gasPrice,
    this.totalWei,
  });

  factory FeeQuote.fromJson(Map<String, dynamic> json) {
    return FeeQuote(
      gasLimit: json['gasLimit'] as String,
      maxFeePerGas: json['maxFeePerGas'] as String?,
      maxPriorityFeePerGas: json['maxPriorityFeePerGas'] as String?,
      gasPrice: json['gasPrice'] as String?,
      totalWei: json['totalWei'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'gasLimit': gasLimit,
      if (maxFeePerGas != null) 'maxFeePerGas': maxFeePerGas,
      if (maxPriorityFeePerGas != null) 'maxPriorityFeePerGas': maxPriorityFeePerGas,
      if (gasPrice != null) 'gasPrice': gasPrice,
      if (totalWei != null) 'totalWei': totalWei,
    };
  }
}

class Signature {
  final String address;
  final String signature;

  const Signature({
    required this.address,
    required this.signature,
  });

  factory Signature.fromJson(Map<String, dynamic> json) {
    return Signature(
      address: json['address'] as String,
      signature: json['signature'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'address': address,
      'signature': signature,
    };
  }
}

class Transaction {
  final String id;
  final AssetType assetType;
  final TransactionAsset asset;
  final String amount;
  final String to;
  final String walletId;
  final String? initiatorUserId;
  final String? executorAddress;
  final List<Signature> signatures;
  final TransactionStatus status;
  final SimpleMultisigTransactionData data;
  final String? hash;
  final FeeQuote fee;
  final DateTime createdOn;
  final DateTime updatedOn;
  final String? remark;
  final TransactionType type;
  final bool incoming;
  final String? merchant;

  const Transaction({
    required this.id,
    required this.assetType,
    required this.asset,
    required this.amount,
    required this.to,
    required this.walletId,
    this.initiatorUserId,
    this.executorAddress,
    required this.signatures,
    required this.status,
    required this.data,
    this.hash,
    required this.fee,
    required this.createdOn,
    required this.updatedOn,
    this.remark,
    required this.type,
    required this.incoming,
    this.merchant,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] as String,
      assetType: AssetType.fromString(json['assetType'] as String),
      asset: TransactionAsset.fromJson(json['asset'] as Map<String, dynamic>),
      amount: json['amount'] as String,
      to: json['to'] as String,
      walletId: json['walletId'] as String,
      initiatorUserId: json['initiatorUserId'] as String?,
      executorAddress: json['executorAddress'] as String?,
      signatures: (json['signatures'] as List<dynamic>)
          .map((e) => Signature.fromJson(e as Map<String, dynamic>))
          .toList(),
      status: TransactionStatus.fromString(json['status'] as String),
      data: SimpleMultisigTransactionData.fromJson(json['data'] as Map<String, dynamic>),
      hash: json['hash'] as String?,
      fee: FeeQuote.fromJson(json['fee'] as Map<String, dynamic>),
      createdOn: DateTime.parse(json['createdOn'] as String),
      updatedOn: DateTime.parse(json['updatedOn'] as String),
      remark: json['remark'] as String?,
      type: TransactionType.fromString(json['type'] as String),
      incoming: json['incoming'] as bool,
      merchant: json['merchant'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'assetType': assetType.toJson(),
      'asset': asset.toJson(),
      'amount': amount,
      'to': to,
      'walletId': walletId,
      if (initiatorUserId != null) 'initiatorUserId': initiatorUserId,
      if (executorAddress != null) 'executorAddress': executorAddress,
      'signatures': signatures.map((e) => e.toJson()).toList(),
      'status': status.toJson(),
      'data': data.toJson(),
      if (hash != null) 'hash': hash,
      'fee': fee.toJson(),
      'createdOn': createdOn.toIso8601String(),
      'updatedOn': updatedOn.toIso8601String(),
      if (remark != null) 'remark': remark,
      'type': type.toJson(),
      'incoming': incoming,
      if (merchant != null) 'merchant': merchant,
    };
  }
}

class NativeTransaction {
  final String hash;
  final String createdAt;
  final String from;
  final String to;
  final String value;
  final bool isFrom;

  const NativeTransaction({
    required this.hash,
    required this.createdAt,
    required this.from,
    required this.to,
    required this.value,
    required this.isFrom,
  });

  factory NativeTransaction.fromJson(Map<String, dynamic> json) {
    return NativeTransaction(
      hash: json['hash'] as String,
      createdAt: json['created_at'] as String,
      from: json['from'] as String,
      to: json['to'] as String,
      value: json['value'] as String,
      isFrom: json['is_from'] as bool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'hash': hash,
      'created_at': createdAt,
      'from': from,
      'to': to,
      'value': value,
      'is_from': isFrom,
    };
  }
}

class ERC20Transaction {
  final String hash;
  final String method;
  final String createdAt;
  final String from;
  final String to;
  final String amount;
  final bool isFrom;
  final String token;
  final String contract;

  const ERC20Transaction({
    required this.hash,
    required this.method,
    required this.createdAt,
    required this.from,
    required this.to,
    required this.amount,
    required this.isFrom,
    required this.token,
    required this.contract,
  });

  factory ERC20Transaction.fromJson(Map<String, dynamic> json) {
    return ERC20Transaction(
      hash: json['hash'] as String,
      method: json['method'] as String,
      createdAt: json['created_at'] as String,
      from: json['from'] as String,
      to: json['to'] as String,
      amount: json['amount'] as String,
      isFrom: json['is_from'] as bool,
      token: json['token'] as String,
      contract: json['contract'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'hash': hash,
      'method': method,
      'created_at': createdAt,
      'from': from,
      'to': to,
      'amount': amount,
      'is_from': isFrom,
      'token': token,
      'contract': contract,
    };
  }
}
