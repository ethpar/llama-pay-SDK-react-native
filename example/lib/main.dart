import 'package:flutter/material.dart';
import 'package:llama_pay_sdk/llama_pay_sdk.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Llama Pay SDK Example',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const LlamaPayExample(),
    );
  }
}

class LlamaPayExample extends StatefulWidget {
  const LlamaPayExample({super.key});

  @override
  State<LlamaPayExample> createState() => _LlamaPayExampleState();
}

class _LlamaPayExampleState extends State<LlamaPayExample> {
  late MerapiClient merapiClient;
  late DoraApiClient doraApiClient;
  String _result = 'Press a button to test the SDK';
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _initializeClients();
  }

  void _initializeClients() {
    // Initialize MerapiClient with your API URL and client ID
    merapiClient = MerapiClient(
      baseUrl: 'https://api.dev.rampatm.net/ramp',
      clientId: 'your-client-id-here',
    );

    // Initialize DoraApiClient
    doraApiClient = DoraApiClient();

    // Optionally set up authentication token provider
    merapiClient.setAuthTokenProvider(() async {
      // Return your auth token here
      return 'Bearer your-auth-token';
    });
  }

  void _setLoading(bool loading) {
    setState(() {
      _isLoading = loading;
    });
  }

  void _updateResult(String result) {
    setState(() {
      _result = result;
    });
  }

  Future<void> _testGetCurrentUser() async {
    _setLoading(true);
    try {
      final user = await merapiClient.getCurrentUser();
      _updateResult('Current user: ${user.email} (${user.id})');
    } catch (e) {
      _updateResult('Error getting current user: $e');
    }
    _setLoading(false);
  }

  Future<void> _testGetDefaultTokens() async {
    _setLoading(true);
    try {
      final tokens = await merapiClient.getDefaultTokens();
      _updateResult('Default tokens: ${tokens.length} tokens found');
    } catch (e) {
      _updateResult('Error getting default tokens: $e');
    }
    _setLoading(false);
  }

  Future<void> _testGetBalances() async {
    _setLoading(true);
    try {
      const address = '0x1234567890123456789012345678901234567890';
      final balances = await merapiClient.getBalances(address, [
        const TokenRequest(tokenAddress: null), // Native token
        const TokenRequest(tokenAddress: '0x1234567890123456789012345678901234567890'), // ERC20 token
      ]);
      _updateResult('Balances: ${balances.length} balances found');
    } catch (e) {
      _updateResult('Error getting balances: $e');
    }
    _setLoading(false);
  }

  Future<void> _testGetMultisigWallets() async {
    _setLoading(true);
    try {
      final wallets = await merapiClient.getMultisigWallets();
      _updateResult('Multisig wallets: ${wallets.length} wallets found');
    } catch (e) {
      _updateResult('Error getting multisig wallets: $e');
    }
    _setLoading(false);
  }

  Future<void> _testDoraTransactions() async {
    _setLoading(true);
    try {
      const address = '0x1234567890123456789012345678901234567890';
      final transactions = await doraApiClient.getTransactions(address);
      _updateResult('Dora transactions: ${transactions.totalCount} transactions found');
    } catch (e) {
      _updateResult('Error getting Dora transactions: $e');
    }
    _setLoading(false);
  }

  Future<void> _testDeviceInfo() async {
    _setLoading(true);
    try {
      final platform = detectPlatform();
      final deviceId = await getDeviceId();
      final userAgent = await getUserAgent();
      final bundleId = await getBundleId();
      
      _updateResult('Platform: $platform\nDevice ID: $deviceId\nUser Agent: $userAgent\nBundle ID: $bundleId');
    } catch (e) {
      _updateResult('Error getting device info: $e');
    }
    _setLoading(false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Llama Pay SDK Example'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ElevatedButton(
              onPressed: _isLoading ? null : _testGetCurrentUser,
              child: const Text('Get Current User'),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: _isLoading ? null : _testGetDefaultTokens,
              child: const Text('Get Default Tokens'),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: _isLoading ? null : _testGetBalances,
              child: const Text('Get Balances'),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: _isLoading ? null : _testGetMultisigWallets,
              child: const Text('Get Multisig Wallets'),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: _isLoading ? null : _testDoraTransactions,
              child: const Text('Get Dora Transactions'),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: _isLoading ? null : _testDeviceInfo,
              child: const Text('Get Device Info'),
            ),
            const SizedBox(height: 16),
            if (_isLoading)
              const CircularProgressIndicator()
            else
              Expanded(
                child: SingleChildScrollView(
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      _result,
                      style: const TextStyle(fontFamily: 'monospace'),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
