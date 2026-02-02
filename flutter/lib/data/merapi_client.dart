import 'package:device_info_plus/device_info_plus.dart';
import 'package:device_user_agent/device_user_agent.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:wallet_sdk_flutter/models/auth.dart';

import '../models/balance.dart';
import '../models/multisig_wallet.dart';
import '../models/token_info.dart';
import '../models/transaction.dart';
import '../models/user.dart';

class MerapiClient {
  late final Dio dio;

  MerapiClient._();

  static Future<MerapiClient> create({
    required String baseUrl,
    required String clientId,
  }) async {
    final client = MerapiClient._();

    client.dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Client-Id': clientId,
          'X-Device-Id': await getDeviceId(),
          'User-Agent': await DeviceUserAgent.instance.build(),
          'X-Bundle-Id': await PackageInfo.fromPlatform(),
        },
      ),
    );

    client.dio.interceptors.add(
      InterceptorsWrapper(
        onError: (e, handler) {
          final data = e.response?.data;
          final message =
              data is Map<String, dynamic>
                  ? (data['error']?['server_message'] ?? data['error']?['code'])
                  : null;

          handler.reject(e.copyWith(error: message ?? e.message));
        },
      ),
    );

    return client;
  }

  Future<void> generateLoginCode({
    required String contact,
    String? password,
  }) async {
    await dio.post(
      '/wallet/login/code',
      data: {'contact': contact, if (password != null) 'password': password},
    );
  }

  Future<LoginResponse> confirmLoginCode({
    required String contact,
    required String code,
  }) async {
    final res = await dio.post(
      '/wallet/login/confirm',
      data: {'contact': contact, 'code': code},
    );

    return LoginResponse.fromJson(res.data);
  }

  Future<User> getCurrentUser() async {
    final res = await dio.get('/wallet/users/me');
    return User.fromJson(res.data);
  }

  Future<List<BalanceResponse>> getBalances(
    String address,
    List<BalanceRequest> tokens,
  ) async {
    final res = await dio.post(
      '/wallet/blockchain/$address/get-balance',
      data: {'tokens': tokens},
    );

    return (res.data as List).map((e) => BalanceResponse.fromJson(e)).toList();
  }

  Future<List<TokenInfo>> getDefaultTokens() async {
    final res = await dio.get('/wallet/blockchain/tokens');
    return (res.data as List).map((e) => TokenInfo.fromJson(e)).toList();
  }

  Future<GeneralMultisigWallet> createMultisigWallet({
    required String name,
    required List<String> signers,
    required int threshold,
  }) async {
    final res = await dio.post(
      '/wallet/wallets',
      data: {'name': name, 'signers': signers, 'threshold': threshold},
    );

    return GeneralMultisigWallet.fromJson(res.data);
  }

  Future<List<GeneralMultisigWallet>> getMultisigWallets() async {
    final res = await dio.get('/wallet/wallets');
    return (res.data as List)
        .map((e) => GeneralMultisigWallet.fromJson(e))
        .toList();
  }

  Future<Transaction> executeTransaction(String txId) async {
    final res = await dio.post(
      '/wallet/tx/$txId/execute',
      data: {'txid': txId},
    );

    return Transaction.fromJson(res.data);
  }
}

Future<String> getDeviceId() async {
  final deviceInfo = DeviceInfoPlugin();

  if (kIsWeb) {
    final web = await deviceInfo.webBrowserInfo;

    final browser = web.browserName.name;
    final os = web.platform ?? 'unknown-os';

    return '${browser.toUpperCase()} on ${os.toUpperCase()}';
  }

  switch (defaultTargetPlatform) {
    case TargetPlatform.android:
      final android = await deviceInfo.androidInfo;
      return '${android.manufacturer} ${android.model}';

    case TargetPlatform.iOS:
      final ios = await deviceInfo.iosInfo;
      return ios.utsname.machine;

    case TargetPlatform.macOS:
      final mac = await deviceInfo.macOsInfo;
      return 'Mac ${mac.model}';

    case TargetPlatform.windows:
      final win = await deviceInfo.windowsInfo;
      return 'Windows ${win.computerName}';

    case TargetPlatform.linux:
      final linux = await deviceInfo.linuxInfo;
      return '${linux.name} ${linux.version}';

    default:
      return 'Unknown Device';
  }
}
