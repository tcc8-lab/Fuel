# Local Development

## Prerequisites

- Node.js 18+
- Rust 1.70+
- Solana CLI 1.17+
- Anchor CLI 0.29+

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/fuel-protocol/fuel.git
cd fuel
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_FUEL_PROGRAM_ID=<your-program-id>
```

### 3. Start Local Validator (optional)

```bash
solana-test-validator
```

### 4. Build Program

```bash
cd programs/fuel-protocol
anchor build
```

### 5. Deploy to Devnet

```bash
anchor deploy --provider.cluster devnet
```

### 6. Run Frontend

```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js pages (App Router)
│   ├── page.tsx           # Home page
│   ├── dashboard/         # Dashboard page
│   ├── how-it-works/      # How It Works page
│   ├── providers/         # Providers page
│   ├── docs/              # Docs page
│   ├── sdk/               # SDK page
│   ├── token/             # Token page
│   ├── security/          # Security page
│   └── roadmap/           # Roadmap page
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── ui/                # Button, Card, Badge, StatsPanel, GlowText
│   ├── three/             # 3D components (ReactorCore, AgentNodes, etc.)
│   ├── home/              # Home page sections
│   ├── dashboard/         # Dashboard components
│   └── providers/         # WalletProvider
├── lib/
│   ├── constants.ts       # Config and constants
│   ├── utils.ts           # Utility functions
│   └── demo-data.ts       # Seeded demo data
└── hooks/
    ├── useScrollProgress.ts
    └── useFuelProgram.ts  # Simulated devnet interactions
```

## SDK Development

```bash
cd packages/sdk
npm install
npm run build
```

## Testing

```bash
# Program tests
anchor test

# Frontend (no test suite yet)
npm run build
```

## Common Issues

**WebGL not working locally:** Ensure your browser supports WebGL2. The 3D scene has a fallback for unsupported devices.

**Wallet not connecting:** Make sure you're on devnet in your wallet settings.

**Program deploy fails:** Ensure you have enough SOL on devnet. Request airdrop: `solana airdrop 2`
