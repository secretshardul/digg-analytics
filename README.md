# Features
- BTC vs DIGG prices
- Setts (DIGG, Sushiswap, Uniswap): Total deposits, ROI

    ```
    curl https://api.sett.vision/protocol/farm
    ```

- Token data: total supply, supply pie chart (vesting funds, rewards escrow, DAO funds, Airdrop, circulation). Get from CoinGecko API
    - Total and circulating supply: https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=digg
    - Circulation breakdown: Subtract these from total supply to get circulating supply
        1. Team vesting funds: https://etherscan.io/token/0x798d1be841a82a273720ce31c822c61a67a601c3?a=0x124fd4a9bd4914b32c77c9ae51819b1181dbb3d4
        2. Rewards escrow: https://etherscan.io/token/0x798d1be841a82a273720ce31c822c61a67a601c3?a=0x19d099670a21bc0a8211a89b84cedf59abb4377f
        3. DAO funds: https://etherscan.io/token/0x798d1be841a82a273720ce31c822c61a67a601c3?a=0x5a54ca44e8f5a1a695f8621f15bfa159a140bb61
        4. Airdrop: https://etherscan.io/token/0x798d1be841a82a273720ce31c822c61a67a601c3?a=0x5e79958efbb8afdedb6ec7107110f329e4eafffa (It's 0 now)

            ```sh
            curl 'https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x798d1be841a82a273720ce31c822c61a67a601c3&address=0x5e79958efbb8afdedb6ec7107110f329e4eafffa&tag=latest&apikey=S6BUBDEGTTTYHTQT3UN1Y6SAJ4F8UVFHZW'
            ```
- Google search interest: Not possible

## Subgraph usage
```graphql
{
  tokenBalances(orderBy: balance, orderDirection: desc) {
    id
    balance
    token {
      name
    }
  }
}
```

```json
{
  "data": {
    "tokenBalances": [
      {
        "balance": "46316835694926478169428394003475163141307993866256225615783033601600000000000",
        "id": "0x5a54ca44e8f5a1a695f8621f15bfa159a140bb61-0x798d1be841a82a273720ce31c822c61a67a601c3",
        "token": {
          "name": "Digg"
        }
      },
      {
        "balance": "20173219154436926608344814587747762963314633070231619877797290934340870482621",
        "id": "0x4a8651f2edd68850b944ad93f2c67af817f39f62-0x798d1be841a82a273720ce31c822c61a67a601c3",
        "token": {
          "name": "Digg"
        }
      },
```

ID Format in `0x5a54ca44e8f5a1a695f8621f15bfa159a140bb61-0x798d1be841a82a273720ce31c822c61a67a601c3`
1. First address is holder address (DAO funds)
2. Last address is DIGG contract address

Must be in lowercase

Find DIGG balance
```
{
  tokenBalance(id: "0x124fd4a9bd4914b32c77c9ae51819b1181dbb3d4-0x798d1be841a82a273720ce31c822c61a67a601c3") {
    id
    balance
    token {
      name
    }
  }
}
```

BigInt issue
- https://thegraph.com/docs/assemblyscript-api#built-in-types
- https://github.com/graphprotocol/graph-ts : Can have decoder
- https://stackoverflow.com/questions/59317194/how-to-use-npm-package-as-normal-javascript-in-html

Call GraphQL
```
curl -X POST \
-H "Content-Type: application/json" \
-d '{"query": "{ hello }"}' \
https://api.thegraph.com/subgraphs/name/darruma/badger
```