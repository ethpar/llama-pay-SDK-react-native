class FeatureFlags {
  final bool multisignatureWallet;
  final bool paymentWallet;

  const FeatureFlags({
    required this.multisignatureWallet,
    required this.paymentWallet,
  });

  factory FeatureFlags.fromJson(Map<String, dynamic> json) {
    return FeatureFlags(
      multisignatureWallet: json['multisignatureWallet'] as bool,
      paymentWallet: json['paymentWallet'] as bool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'multisignatureWallet': multisignatureWallet,
      'paymentWallet': paymentWallet,
    };
  }
}
