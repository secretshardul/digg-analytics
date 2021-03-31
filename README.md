# Diggmetrics: DIGG analytics dashboard
![Diggmetrics](https://user-images.githubusercontent.com/49580849/113136714-50240700-9241-11eb-9b7e-2d922516b3c5.png)

DIGG is an elastic supply rebase token pegged to the Bitcoin. Here's a dashboard which lets you study the relation between the two.

## Features
1. DIGG vs BTC price over time: You can pick a time period from 1 day to all time.
2. DIGG ownership: Shows a pie chart on percentage ownership and available circulation.
3. DIGG staking: Shows how DIGG is deposited in various setts.

## Screenshots
### Desktop
![1 1-pc-top](https://user-images.githubusercontent.com/49580849/113136575-27037680-9241-11eb-9565-eb95ea83c3ae.png)

![1 2-pc-bottom](https://user-images.githubusercontent.com/49580849/113136577-2834a380-9241-11eb-80c5-509eed5c0d14.png)

### Mobile
![2 1-mob-top](https://user-images.githubusercontent.com/49580849/113136567-24088600-9241-11eb-9951-9f210b19693d.png)

![2 2-mob-bottom](https://user-images.githubusercontent.com/49580849/113136574-266ae000-9241-11eb-95eb-cc5d7037e939.png)

## Tech stack
- The Graph: Uses the official [Badger subgraph](https://thegraph.com/explorer/subgraph/darruma/badger) to fetch DIGG balance for various accounts.

  ```graphql
  query getBalance($id: ID!) {
      tokenBalance(id: $id) {
          id
          balance
          token {
          name
          }
      }
  }
  ```

- Bootstrap 5
- Netlify
- Vanilla javascript
- Badger finance API
- Google fonts
- CoinGecko price comparison widget

## Gitcoin GR9 qualifying bounties
- [Badger](https://gitcoin.co/issue/Badger-Finance/badger-system/70/100025037)
- [The Graph](https://gitcoin.co/issue/graphprotocol/gitcoin-grants-round-9-hackathon/1/100025068)
