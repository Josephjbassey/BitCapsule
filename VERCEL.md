# Hosting BitCapsule on Vercel

To host this project on Vercel, follow these steps:

1. **Push your changes to GitHub**:
   Ensure all changes are committed and pushed to your repository (e.g., `main` branch).

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com/new).
   - Import your GitHub repository.

3. **Configure Project**:
   - **Root Directory**: Select `apps/dapp`.
   - **Build Command**: `pnpm build` (or `next build`).
   - **Install Command**: `pnpm install`.
   - **Framework Preset**: `Next.js`.

4. **Set Environment Variables**:
   In the Vercel dashboard, add the following variables:
   - `NEXT_PUBLIC_TIME_CAPSULE_ADDRESS`: The deployed address of your TimeCapsule contract.
   - `NEXT_PUBLIC_VAULT_ADDRESS`: The deployed address of your Vault contract.

5. **Deploy**:
   Click "Deploy". Vercel will automatically build and host your dApp.

## Why I couldn't host it directly:
As an AI agent, I don't have access to your personal Vercel account or the ability to perform OAuth connections. However, I have prepared the codebase (including `vercel.json` and the Navbar) to make the process seamless for you.
