# 🔗 Git Submodule Management Guide

## Table of Contents

1. [Overview](#overview)
2. [Initial Setup](#initial-setup)
3. [Working with the Submodule](#working-with-the-submodule)
4. [Best Practices](#best-practices)
5. [Common Commands](#common-commands)
6. [Troubleshooting](#troubleshooting)

## 📖 Overview <a name="overview"></a>

This repository includes the `mongodb-pipeline-demo` as a git submodule. The submodule is intentionally added to `.gitignore` to prevent accidental commits of submodule changes to the main repository.

**Submodule Repository:** https://github.com/augustinebest/mongodb-pipeline-demo.git

## 🚀 Initial Setup <a name="initial-setup"></a>

The submodule has already been added to this repository. For new team members cloning this repository:

```bash
# Clone the main repository with submodules
git clone --recursive <main-repo-url>

# OR if already cloned, initialize submodules
git submodule update --init --recursive
```

## 🛠 Working with the Submodule <a name="working-with-the-submodule"></a>

### 🔹 Step 1: Navigate to Submodule Directory

```bash
cd mongodb-pipeline-demo
```

### 🔹 Step 2: Pull Latest Changes from Origin

```bash
# Fetch all branches and updates
git fetch origin

# Check available branches
git branch -r
```

### 🔹 Step 3: Switch to Desired Branch

```bash
# Switch to the branch you want to work on
git checkout origin/<branch-name>

# Example: switching to a feature branch
git checkout origin/feature/new-aggregation-patterns
```

### 🔹 Step 4: Create Your Own Working Branch

**⚠️ IMPORTANT:** Never work directly on the original branch. Always create your own branch:

```bash
# Create and switch to a new branch based on the current HEAD
git checkout -b your-feature-branch-name

# Example:
git checkout -b chimzuru/test-aggregation-updates
```

### 🔹 Step 5: Make Your Changes

```bash
# Make your changes to files
# Edit, add, modify as needed

# Stage changes
git add .

# Commit changes
git commit -m "Your descriptive commit message"
```

### 🔹 Step 6: Push Your Branch (Optional)

```bash
# Push your branch to origin (if you have write access)
git push origin your-feature-branch-name

# OR create a local-only branch for testing
# (no push required)
```

## ✅ Best Practices <a name="best-practices"></a>

### 🛡️ Safety Guidelines

1. **Never commit submodule changes to main repo:** The submodule is in `.gitignore` for this reason
2. **Always create your own branch:** Don't work directly on upstream branches
3. **Use descriptive branch names:** Include your name/initials for clarity
4. **Test thoroughly:** Validate changes before pushing

### 🔄 Workflow Examples

#### Testing a Specific Branch:
```bash
cd mongodb-pipeline-demo
git fetch origin
git checkout origin/feature/advanced-lookups
git checkout -b your-name/test-advanced-lookups
# Make changes and test
```

#### Updating to Latest Master:
```bash
cd mongodb-pipeline-demo
git fetch origin
git checkout origin/master
git checkout -b your-name/latest-master-test
# Test latest changes
```

#### Working on Multiple Features:
```bash
# Feature 1
cd mongodb-pipeline-demo
git checkout origin/feature/feature-1
git checkout -b your-name/test-feature-1

# Go back to main repo, then test feature 2
cd ..
cd mongodb-pipeline-demo
git checkout origin/feature/feature-2
git checkout -b your-name/test-feature-2
```

## 📋 Common Commands <a name="common-commands"></a>

### Navigation & Status
```bash
# Navigate to submodule
cd mongodb-pipeline-demo

# Check current branch and status
git status
git branch

# See available remote branches
git branch -r

# Return to main repo
cd ..
```

### Branch Management
```bash
# Update submodule to latest
git submodule update --remote mongodb-pipeline-demo

# Switch branches in submodule
cd mongodb-pipeline-demo
git checkout <branch-name>

# Create new branch
git checkout -b <new-branch-name>

# Delete local branch (when done testing)
git branch -d <branch-name>
```

### Syncing Changes
```bash
# Pull latest changes from origin
git fetch origin
git pull origin <branch-name>

# Push your changes (if you have access)
git push origin <your-branch-name>
```

## 🔧 Troubleshooting <a name="troubleshooting"></a>

### Issue: Submodule not initialized
```bash
git submodule update --init --recursive
```

### Issue: Submodule appears modified in main repo
This is expected! The submodule is in `.gitignore` to prevent accidental commits.
```bash
# In main repo - this is normal and expected
git status
# Should show: mongodb-pipeline-demo (modified content, untracked content)
```

### Issue: Can't switch branches in submodule
```bash
cd mongodb-pipeline-demo
# Stash any uncommitted changes
git stash
# Then switch branches
git checkout <target-branch>
```

### Issue: Submodule directory is empty
```bash
# Re-initialize the submodule
git submodule update --init --recursive mongodb-pipeline-demo
```

### Issue: Lost changes in submodule
```bash
cd mongodb-pipeline-demo
# Check for stashed changes
git stash list
# Apply if any exist
git stash pop
```

## 🎯 Quick Reference

| Action | Command |
|--------|---------|
| Navigate to submodule | `cd mongodb-pipeline-demo` |
| Check available branches | `git branch -r` |
| Switch to branch | `git checkout origin/<branch>` |
| Create your branch | `git checkout -b your-name/branch` |
| Return to main repo | `cd ..` |
| Update submodule | `git submodule update --remote` |

## 📝 Notes

- The submodule points to: https://github.com/augustinebest/mongodb-pipeline-demo.git
- Changes in the submodule do NOT affect the main repository
- Always work on your own branches within the submodule
- The `.gitignore` entry prevents accidental commits to main repo
- Test your changes thoroughly before pushing to the submodule repository 