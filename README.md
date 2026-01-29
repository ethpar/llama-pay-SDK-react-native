# llama-pay-sdk-flutter

Official SDK for ethpar services - Flutter implementation.

## Overview
This repository provides a Flutter SDK that exposes API to connect to the ethpar backend.

## Installation
Add this to your package's `pubspec.yaml` file:

```yaml
dependencies:
  llama_pay_sdk: ^1.0.0
```

Then run:
```bash
flutter pub get
```

## Usage

```dart
import 'package:llama_pay_sdk/llama_pay_sdk.dart';

// Initialize the client
final client = MerapiClient(
  baseUrl: 'https://api.dev.rampatm.net/ramp',
  clientId: 'your-client-id',
);

// Set up authentication (optional)
client.setAuthTokenProvider(() async {
  return 'Bearer your-auth-token';
});

// Get current user
final user = await client.getCurrentUser();
print('User: ${user.email}');

// Get balances
final balances = await client.getBalances(
  '0x1234567890123456789012345678901234567890',
  [const TokenRequest(tokenAddress: null)], // Native token
);

// Get multisig wallets
final wallets = await client.getMultisigWallets();
```

## Features
- ✅ User authentication and management
- ✅ Balance queries
- ✅ Multisig wallet management
- ✅ Transaction creation and management
- ✅ Credit card wallet support
- ✅ Device information collection
- ✅ Dora API integration for transaction history
- ✅ Cross-platform support (iOS, Android, Web, Desktop)

## Platform Support
- ✅ iOS
- ✅ Android  
- ✅ Web
- ✅ macOS
- ✅ Windows
- ✅ Linux

## Development
This SDK is written in pure Dart and works across all Flutter platforms.

## License
Apache 2.0
