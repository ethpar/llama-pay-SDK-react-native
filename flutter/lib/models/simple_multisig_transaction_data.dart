class SimpleMultisigTransactionData {
  final Types types;
  final Domain domain;
  final String primaryType;
  final Message message;

  const SimpleMultisigTransactionData({
    required this.types,
    required this.domain,
    required this.primaryType,
    required this.message,
  });

  factory SimpleMultisigTransactionData.fromJson(Map<String, dynamic> json) {
    return SimpleMultisigTransactionData(
      types: Types.fromJson(json['types'] as Map<String, dynamic>),
      domain: Domain.fromJson(json['domain'] as Map<String, dynamic>),
      primaryType: json['primaryType'] as String,
      message: Message.fromJson(json['message'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'types': types.toJson(),
      'domain': domain.toJson(),
      'primaryType': primaryType,
      'message': message.toJson(),
    };
  }
}

class Types {
  final List<TypeField> eip712Domain;
  final List<TypeField> multiSigTransaction;

  const Types({
    required this.eip712Domain,
    required this.multiSigTransaction,
  });

  factory Types.fromJson(Map<String, dynamic> json) {
    return Types(
      eip712Domain: (json['EIP712Domain'] as List<dynamic>)
          .map((e) => TypeField.fromJson(e as Map<String, dynamic>))
          .toList(),
      multiSigTransaction: (json['MultiSigTransaction'] as List<dynamic>)
          .map((e) => TypeField.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'EIP712Domain': eip712Domain.map((e) => e.toJson()).toList(),
      'MultiSigTransaction': multiSigTransaction.map((e) => e.toJson()).toList(),
    };
  }
}

class TypeField {
  final String name;
  final String type;

  const TypeField({
    required this.name,
    required this.type,
  });

  factory TypeField.fromJson(Map<String, dynamic> json) {
    return TypeField(
      name: json['name'] as String,
      type: json['type'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'type': type,
    };
  }
}

class Domain {
  final String name;
  final String version;
  final int chainId;
  final String verifyingContract;
  final String salt;

  const Domain({
    required this.name,
    required this.version,
    required this.chainId,
    required this.verifyingContract,
    required this.salt,
  });

  factory Domain.fromJson(Map<String, dynamic> json) {
    return Domain(
      name: json['name'] as String,
      version: json['version'] as String,
      chainId: json['chainId'] as int,
      verifyingContract: json['verifyingContract'] as String,
      salt: json['salt'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'version': version,
      'chainId': chainId,
      'verifyingContract': verifyingContract,
      'salt': salt,
    };
  }
}

class Message {
  final String executor;
  final int nonce;
  final int gasLimit;
  final String destination;
  final String value;
  final String data;

  const Message({
    required this.executor,
    required this.nonce,
    required this.gasLimit,
    required this.destination,
    required this.value,
    required this.data,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      executor: json['executor'] as String,
      nonce: json['nonce'] as int,
      gasLimit: json['gasLimit'] as int,
      destination: json['destination'] as String,
      value: json['value'] as String,
      data: json['data'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'executor': executor,
      'nonce': nonce,
      'gasLimit': gasLimit,
      'destination': destination,
      'value': value,
      'data': data,
    };
  }
}
