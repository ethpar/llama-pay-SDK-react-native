import '../models/transaction.dart';
import 'http_client.dart';

typedef Headers = Map<String, String>;

class DoraApiClient {
  late HttpClient http;
  Headers headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  DoraApiClient() {
    const doraUrl = 'https://dora.testnet.ethpar.net/api';
    http = HttpClient(doraUrl, headers);
  }

  Future<TransactionListResponse> getTransactions(
    String address, {
    int offset = 0,
    int size = 1000,
  }) async {
    final response = await http.get<Map<String, dynamic>>(
      '/account/txlist/$address?offset=$offset&pageSize=$size',
    );
    
    return TransactionListResponse.fromJson(response);
  }

  Future<ERC20TransactionListResponse> getERC20Transactions(
    String address,
    String contract, {
    int offset = 0,
    int size = 1000,
  }) async {
    final response = await http.get<Map<String, dynamic>>(
      '/account/txlist/erc20/$address?contract=$contract&offset=$offset&pageSize=$size',
    );
    
    return ERC20TransactionListResponse.fromJson(response);
  }
}

class TransactionListResponse {
  final List<NativeTransaction> data;
  final int totalCount;
  final int pageSize;
  final int offset;

  const TransactionListResponse({
    required this.data,
    required this.totalCount,
    required this.pageSize,
    required this.offset,
  });

  factory TransactionListResponse.fromJson(Map<String, dynamic> json) {
    return TransactionListResponse(
      data: (json['data'] as List<dynamic>)
          .map((item) => NativeTransaction.fromJson(item as Map<String, dynamic>))
          .toList(),
      totalCount: json['totalCount'] as int,
      pageSize: json['pageSize'] as int,
      offset: json['offset'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'data': data.map((item) => item.toJson()).toList(),
      'totalCount': totalCount,
      'pageSize': pageSize,
      'offset': offset,
    };
  }
}

class ERC20TransactionListResponse {
  final List<ERC20Transaction> data;
  final int totalCount;
  final int pageSize;
  final int offset;

  const ERC20TransactionListResponse({
    required this.data,
    required this.totalCount,
    required this.pageSize,
    required this.offset,
  });

  factory ERC20TransactionListResponse.fromJson(Map<String, dynamic> json) {
    return ERC20TransactionListResponse(
      data: (json['data'] as List<dynamic>)
          .map((item) => ERC20Transaction.fromJson(item as Map<String, dynamic>))
          .toList(),
      totalCount: json['totalCount'] as int,
      pageSize: json['pageSize'] as int,
      offset: json['offset'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'data': data.map((item) => item.toJson()).toList(),
      'totalCount': totalCount,
      'pageSize': pageSize,
      'offset': offset,
    };
  }
}
