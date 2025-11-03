# GitHub Setup Instructions

## Step 1: Create a Personal Access Token (PAT)

1. Go to GitHub.com and sign in as **neerajupa17-rgb**
2. Click your profile picture → **Settings**
3. Scroll down and click **Developer settings** (left sidebar)
4. Click **Personal access tokens** → **Tokens (classic)**
5. Click **Generate new token** → **Generate new token (classic)**
6. Give it a name like: `ai-studio-assignment`
7. Select scope: Check **repo** (this gives full repository access)
8. Click **Generate token**
9. **COPY THE TOKEN** - You won't see it again!

## Step 2: Push using the token

Option A - Update remote URL with token:
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/neerajupa17-rgb/fullstack-ai-studio.git
git push -u origin main
```

Option B - Use token when pushing (you'll be prompted):
```bash
git push -u origin main
# When prompted for username: enter "neerajupa17-rgb"
# When prompted for password: paste your PAT token
```

## Step 3: Create Pull Requests (Required by Assignment)

After pushing, create at least 2 Pull Requests:

### PR #1: Initial Setup
```bash
git checkout -b chore/initial-setup
# Make a small change or add a comment
git add .
git commit -m "docs: Update project structure"
git push -u origin chore/initial-setup
```
Then on GitHub: Create PR from `chore/initial-setup` to `main`

### PR #2: Feature Enhancement
```bash
git checkout main
git checkout -b feature/image-generation
# Make a small enhancement
git add .
git commit -m "feat: Enhance image generation with better error handling"
git push -u origin feature/image-generation
```
Then on GitHub: Create PR from `feature/image-generation` to `main`

## Alternative: Use GitHub CLI (if installed)
```bash
gh auth login
git push -u origin main
```

