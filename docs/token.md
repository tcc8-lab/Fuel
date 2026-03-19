# $FUEL Token Economics

## Overview

$FUEL is the native token of the FUEL protocol. It serves as the medium for compute credit purchases, staking, and future governance.

## Supply

- **Total Supply:** 1,000,000,000 $FUEL
- **Token Standard:** SPL Token on Solana

## Distribution

| Allocation | Percentage | Tokens | TGE Unlock | Cliff | Vesting |
|---|---|---|---|---|---|
| Community & Ecosystem | 40% | 400,000,000 | 15% | None | 24mo linear |
| Protocol Development | 20% | 200,000,000 | 10% | 3mo | 24mo linear |
| Team & Advisors | 15% | 150,000,000 | 0% | 6mo | 24mo linear |
| Liquidity & Market Making | 15% | 150,000,000 | 50% | None | 12mo linear |
| Treasury Reserve | 10% | 100,000,000 | 0% | 12mo | 36mo linear |

## Token Utility

### 1. Compute Credits

Agents deposit $FUEL to receive compute credits at a 1:1 ratio. Credits are:
- Non-transferable
- Protocol-bound
- Consumed when jobs settle

### 2. Staking

$FUEL holders can stake to earn protocol fees:
- 50% of all settlement fees flow to stakers
- Rewards proportional to stake amount
- No lock-up period (unstake anytime)

### 3. Fee Accrual

Every settled job generates a 2.5% protocol fee:
- 50% → Staker rewards
- 30% → Protocol reserve
- 20% → Development fund

### 4. Governance (Future)

Planned governance powers:
- Provider whitelisting
- Fee parameter adjustments
- Treasury allocation votes
- Protocol upgrades

## Fee Mechanics

```
Job settles with 10,000 credits used:
├── Protocol fee: 250 credits (2.5%)
│   ├── Staker rewards: 125 credits (50%)
│   ├── Protocol reserve: 75 credits (30%)
│   └── Development fund: 50 credits (20%)
├── Provider payment: 9,750 credits
└── Agent refund: (allocated - used) credits
```

## Staking APY

Staking APY is variable and depends on:
- Total protocol fee revenue
- Total $FUEL staked
- Formula: `APY = (annual_fees * staker_share) / total_staked`
