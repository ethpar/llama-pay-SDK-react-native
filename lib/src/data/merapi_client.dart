import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/balance.dart';
import '../models/feature_flags.dart';
import '../models/multisig_wallet.dart';
import '../models/token_info.dart';
import '../models/transaction.dart';
import '../models/user.dart';
import '../device_info.dart';
import 'http_client.dart';

typedef Headers = Map<String, String>;
typedef AuthTokenProvider = Future<String?> Function();

class ApiResponse<T> {
  final String result;
  final ApiError? error;
  final T data;

  const ApiResponse({
    required this.result,
    this.error,
    required this.data,
  });

  factory ApiResponse.fromJson(Map<String, dynamic> json, T Function(dynamic) dataFromJson) {
    return ApiResponse<T>(
      result: json['result'] as String,
      error: json['error'] != null ? ApiError.fromJson(json['error'] as Map<String, dynamic>) : null,
      data: dataFromJson(json['data']),
    );
  }
}

class ApiError {
  final String code;
  final String serverMessage;

  const ApiError({
    required this.code,
    required this.serverMessage,
  });

  factory ApiError.fromJson(Map<String, dynamic> json) {
    return ApiError(
      code: json['code'] as String,
      serverMessage: json['server_message'] as String,
    );
  }
}

class MerapiClient {
  late HttpClient http;
  Headers headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  Future<void> Function(dynamic, http.Response)? afterRequestCallback;
  AuthTokenProvider? authTokenProvider;
  String? _deviceId;
  String? _userAgent;
  String? _bundleId;

  MerapiClient({required String baseUrl, required String clientId}) {
    http = HttpClient(baseUrl, headers);
    headers['X-Client-Id'] = clientId;

    http.setBeforeRequestCallback((req) async {
      if (_deviceId == null) {
        _deviceId = await getDeviceId();
      }
      if (_userAgent == null) {
        _userAgent = await getUserAgent();
      }
      if (_bundleId == null) {
        _bundleId = await getBundleId();
      }

      req.headers['X-Device-ID'] = _deviceId!;
      req.headers['User-Agent'] = _userAgent!;
      req.headers['X-Bundle-Id'] = _bundleId!;

      final authToken = await authTokenProvider?.call();
      if (authToken != null) {
        req.headers['Authorization'] = authToken;
      }
    });

    http.setAfterRequestCallback((res) async {
      if (!res.ok) {
        try {
          final body = await _parseJsonResponse(res);
          await afterRequestCallback?.call(body, res);
          
          final errorMessage = body?['error']?['server_message'] ??
                              body?['error']?['code'] ??
                              res.reasonPhrase ??
                              'Unknown error';
          throw Exception(errorMessage);
        } catch (e) {
          if (e is Exception) rethrow;
          throw Exception(res.reasonPhrase ?? 'Unknown error');
        }
      }
    });
  }

  void setAuthTokenProvider(AuthTokenProvider provider) {
    authTokenProvider = provider;
  }

  Future<void> generateLoginCode({
    required String contact,
    String? password,
  }) async {
    await http.post('/wallet/login/code', {
      'contact': contact,
      if (password != null) 'password': password,
    });
  }

  Future<LoginCodeResponse> confirmLoginCode({
    required String contact,
    required String code,
  }) async {
    final response = await http.post<Map<String, dynamic>>(
      '/wallet/login/confirm',
      {'contact': contact, 'code': code},
    );
    
    final apiResponse = ApiResponse<Map<String, dynamic>>.fromJson(
      response,
      (data) => data as Map<String, dynamic>,
    );
    
    return LoginCodeResponse.fromJson(apiResponse.data);
  }

  Future<User> getCurrentUser() async {
    final response = await http.get<Map<String, dynamic>>('/wallet/users/me');
    return User.fromJson(response);
  }

  Future<List<BalanceResponse>> getBalances(
    String address,
    List<TokenRequest> tokens,
  ) async {
    final response = await http.post<List<dynamic>>(
      '/wallet/blockchain/$address/get-balance',
      {'tokens': tokens.map((t) => t.toJson()).toList()},
    );
    
    return (response as List<dynamic>)
        .map((item) => BalanceResponse.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<void> setUserPublicAddress({required String address}) async {
    await http.post('/wallet/users/set-address', {'address': address});
  }

  Future<List<TokenInfo>> getDefaultTokens() async {
    final response = await http.get<List<dynamic>>('/wallet/blockchain/tokens');
    return (response as List<dynamic>)
        .map((item) => TokenInfo.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<GeneralMultisigWallet> createMultisigWallet({
    required String name,
    required List<String> signers,
    required int threshold,
  }) async {
    final response = await http.post<Map<String, dynamic>>('/wallet/wallets', {
      'name': name,
      'signers': signers,
      'threshold': threshold,
    });
    
    return GeneralMultisigWallet.fromJson(response);
  }

  Future<void> acceptMultisigWallet(String walletId) async {
    await http.post('/wallet/wallets/$walletId/accept', {'walletId': walletId});
  }

  Future<List<GeneralMultisigWallet>> getMultisigWallets() async {
    final response = await http.get<List<dynamic>>('/wallet/wallets');
    return (response as List<dynamic>)
        .map((item) => GeneralMultisigWallet.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<Transaction> createMultisigTransaction({
    required String walletId,
    required String assetType,
    required String to,
    required String amount,
    String? tokenAddress,
    String? remark,
  }) async {
    final response = await http.post<Map<String, dynamic>>('/wallet/tx', {
      'walletId': walletId,
      'assetType': assetType,
      'to': to,
      'amount': amount,
      'tokenAddress': tokenAddress,
      'remark': remark,
    });
    
    return Transaction.fromJson(response);
  }

  Future<List<Transaction>> getMultisigWalletTransactions(String walletId) async {
    final response = await http.get<List<dynamic>>('/wallet/wallets/$walletId/tx');
    return (response as List<dynamic>)
        .map((item) => Transaction.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<Transaction> getMultisigWalletTransaction(String txId) async {
    final response = await http.get<Map<String, dynamic>>('/wallet/tx/$txId');
    return Transaction.fromJson(response);
  }

  Future<Transaction> addMultisigTxSignature(
    String txId,
    SignatureData data,
  ) async {
    final response = await http.post<Map<String, dynamic>>(
      '/wallet/tx/$txId/signature',
      data.toJson(),
    );
    
    return Transaction.fromJson(response);
  }

  Future<Transaction> executeTransaction(String txId) async {
    final response = await http.post<Map<String, dynamic>>(
      '/wallet/tx/$txId/execute',
      {'txid': txId},
    );
    
    return Transaction.fromJson(response);
  }

  Future<CreditCardMultisigWallet?> getCCWallet() async {
    try {
      final response = await http.get<Map<String, dynamic>>('/wallet/ccwallet');
      if (response.isNotEmpty) {
        return CreditCardMultisigWallet.fromJson(response);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  Future<List<Transaction>> getCCWalletTransactions(String walletId) async {
    final response = await http.get<List<dynamic>>('/wallet/ccwallet/$walletId/tx');
    return (response as List<dynamic>)
        .map((item) => Transaction.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<CreditCardMultisigWallet> createCCWallet({required String pan}) async {
    final response = await http.post<Map<String, dynamic>>('/wallet/ccwallet', {'pan': pan});
    return CreditCardMultisigWallet.fromJson(response);
  }

  Future<Transaction> executePosTransaction({
    required String destination,
    required String panHash,
    required String amount,
    String? remark,
    required String merchant,
    int? confirmations,
  }) async {
    final response = await http.post<Map<String, dynamic>>('/wallet/tx/pos', {
      'destination': destination,
      'panHash': panHash,
      'amount': amount,
      if (remark != null) 'remark': remark,
      'merchant': merchant,
      if (confirmations != null) 'confirmations': confirmations,
    });
    
    return Transaction.fromJson(response);
  }

  Future<TokenInfo?> getTokenInfo(String tokenAddress) async {
    try {
      final response = await http.get<Map<String, dynamic>>('/wallet/blockchain/$tokenAddress/token-info');
      return TokenInfo.fromJson(response);
    } catch (e) {
      return null;
    }
  }

  Future<FeatureFlags> getFeatureFlags() async {
    // TODO: remove mock
    return const FeatureFlags(
      multisignatureWallet: true,
      paymentWallet: true,
    );
  }

  Future<Transaction> markTopup(String walletId, String hash) async {
    final response = await http.post<Map<String, dynamic>>(
      '/wallet/ccwallet/$walletId/topup',
      {'walletId': walletId, 'hash': hash},
    );
    
    return Transaction.fromJson(response);
  }

  Future<dynamic> _parseJsonResponse(http.Response response) async {
    if (response.body.isEmpty) {
      return null;
    }
    
    try {
      return jsonDecode(response.body);
    } catch (e) {
      return null;
    }
  }
}

class LoginCodeResponse {
  final String sessionKey;

  const LoginCodeResponse({required this.sessionKey});

  factory LoginCodeResponse.fromJson(Map<String, dynamic> json) {
    return LoginCodeResponse(
      sessionKey: json['sessionKey'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {'sessionKey': sessionKey};
  }
}

class TokenRequest {
  final String? tokenAddress;

  const TokenRequest({this.tokenAddress});

  Map<String, dynamic> toJson() {
    return {'tokenAddress': tokenAddress};
  }
}

class SignatureData {
  final String txid;
  final String address;
  final String signature;

  const SignatureData({
    required this.txid,
    required this.address,
    required this.signature,
  });

  Map<String, dynamic> toJson() {
    return {
      'txid': txid,
      'address': address,
      'signature': signature,
    };
  }
}
