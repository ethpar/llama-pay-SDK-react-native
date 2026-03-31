# llama-pay-sdk

Official SDK for ethpar services.

## Overview
This repository provides SDK that exposes API to connect to the ethpar backend.

## Installation

### react-native
```sh
npm install llama-pay-sdk react-native-device-info
```

### web (react)
```sh
npm install llama-pay-sdk
```

## Usage
```
import { MerapiClient } from 'llama-pay-sdk'

const API_URL = 'https://api.dev.rampatm.net/ramp'
const CLIENT_ID = '<your_client_id>
const client = new MerapiClient({
  baseUrl: API_URL,
  clientId: CLIENT_ID
})
```

## License
Apache 2.0
