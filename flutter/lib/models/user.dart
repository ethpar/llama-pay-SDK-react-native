class User {
  final String id;
  final String email;
  final String? phone;
  final String? name;
  final String? publicAddress;
  final DateTime createdOn;
  final DateTime updatedOn;

  const User({
    required this.id,
    required this.email,
    this.phone,
    this.name,
    this.publicAddress,
    required this.createdOn,
    required this.updatedOn,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'].toString(),
      email: json['email'] as String,
      phone: json['phone'] as String?,
      name: json['name'] as String?,
      publicAddress: json['publicAddress'] as String?,
      createdOn: DateTime.parse(json['createdOn'] as String),
      updatedOn: DateTime.parse(json['updatedOn'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      if (phone != null) 'phone': phone,
      if (name != null) 'name': name,
      if (publicAddress != null) 'publicAddress': publicAddress,
      'createdOn': createdOn.toIso8601String(),
      'updatedOn': updatedOn.toIso8601String(),
    };
  }
}
