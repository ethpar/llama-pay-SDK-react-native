# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-29

### Added
- Initial Flutter SDK release
- User authentication and management
- Balance queries for native and ERC20 tokens
- Multisig wallet creation and management
- Transaction creation, signing, and execution
- Credit card wallet support
- Device information collection across all platforms
- Dora API integration for transaction history
- Cross-platform support (iOS, Android, Web, Desktop)
- Comprehensive example application
- Full TypeScript to Dart model conversion
- HTTP client with request/response interceptors
- Platform-specific device info integration

### Features
- **Authentication**: Login code generation and confirmation
- **Wallet Management**: Create, accept, and manage multisig wallets
- **Transactions**: Create, sign, and execute transactions
- **Balance Queries**: Get token balances with price information
- **Device Info**: Cross-platform device identification and user agent detection
- **API Integration**: Both Merapi and Dora API clients

### Platform Support
- iOS (via device_info_plus)
- Android (via device_info_plus)
- Web (via browser APIs)
- macOS (via device_info_plus)
- Windows (via device_info_plus)
- Linux (via device_info_plus)
