# Features
- BTC vs DIGG prices
- Setts (DIGG, Sushiswap, Uniswap): Total deposits, ROI

    ```
    curl https://api.sett.vision/protocol/farm
    ```

- Token data: total supply, supply pie chart (vesting funds, rewards escrow, DAO funds, Airdrop, circulation). Get from CoinGecko API
    - Total and circulating supply: https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=digg
    - Circulation breakdown: Subtract these from total supply to get circulating supply
        1. Team vesting funds: https://etherscan.io/token/0x798d1be841a82a273720ce31c822c61a67a601c3?a=0x124FD4A9bd4914b32c77C9AE51819b1181dbb3D4
        2. Rewards escrow: https://etherscan.io/token/0x798d1be841a82a273720ce31c822c61a67a601c3?a=0x19d099670a21bc0a8211a89b84cedf59abb4377f
        3. DAO funds: https://etherscan.io/token/0x798d1be841a82a273720ce31c822c61a67a601c3?a=0x5A54Ca44e8F5A1A695f8621f15Bfa159a140bB61
        4. Airdrop: https://etherscan.io/token/0x798d1be841a82a273720ce31c822c61a67a601c3?a=0x5e79958efbb8afdedb6ec7107110f329e4eafffa (It's 0 now)

            ```sh
            curl 'https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x798d1be841a82a273720ce31c822c61a67a601c3&address=0x5e79958efbb8afdedb6ec7107110f329e4eafffa&tag=latest&apikey=S6BUBDEGTTTYHTQT3UN1Y6SAJ4F8UVFHZW'
            ```