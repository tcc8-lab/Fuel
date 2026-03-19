# Deployment

## Program Deployment

### Devnet

```bash
# Build
anchor build

# Get program ID
solana address -k target/deploy/fuel_protocol-keypair.json

# Update declare_id! in lib.rs and Anchor.toml

# Deploy
anchor deploy --provider.cluster devnet

# Initialize protocol
npx ts-node scripts/initialize.ts
```

### Mainnet

```bash
# Build with mainnet config
anchor build

# Deploy (requires sufficient SOL)
anchor deploy --provider.cluster mainnet-beta

# Verify program
anchor verify <PROGRAM_ID>
```

## Frontend Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Environment variables to set in Vercel:
- `NEXT_PUBLIC_SOLANA_NETWORK` — `devnet` or `mainnet-beta`
- `NEXT_PUBLIC_SOLANA_RPC_URL` — Your RPC endpoint
- `NEXT_PUBLIC_FUEL_PROGRAM_ID` — Deployed program ID

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
EXPOSE 3000
```

```bash
docker build -t fuel-frontend .
docker run -p 3000:3000 fuel-frontend
```

## Post-Deployment Checklist

- [ ] Program deployed and verified
- [ ] Protocol initialized with correct fee parameters
- [ ] Frontend environment variables configured
- [ ] RPC endpoint is reliable (consider Helius, Triton, or QuickNode)
- [ ] Wallet adapter configured for correct network
- [ ] 3D assets loading correctly
- [ ] Mobile responsive layout verified
- [ ] Error monitoring configured
