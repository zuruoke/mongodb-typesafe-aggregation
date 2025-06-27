# 🔗 Git Submodule Management Guide

## Table of Contents

1. [Overview](#overview)
2. [Initial Setup](#initial-setup)
3. [Package Integration Setup](#package-integration)
4. [Working with the Submodule](#working-with-the-submodule)
5. [Development Workflow](#development-workflow)
6. [Best Practices](#best-practices)
7. [Common Commands](#common-commands)
8. [Troubleshooting](#troubleshooting)

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

## 📦 Package Integration Setup <a name="package-integration"></a>

### 🔗 How the Integration Works

The submodule accesses the main aggregation module through a **local file dependency**. This solves the issue that git submodules cannot access parent directory files through relative paths like `../../`.

#### 🛠 Setup Process (Already Done)

1. **Parent Package Configuration:**
   ```json
   // aggregation/package.json
   {
     "name": "mongodb-typesafe-aggregation",
     "main": "index.ts",
     "types": "index.ts",
     "exports": {
       "./builder": "./builder.ts",
       "./types/filter": "./types/filter.ts"
     }
   }
   ```

2. **Local File Installation:**
   ```bash
   cd mongodb-pipeline-demo
   npm install file:../
   ```

3. **Import Configuration:**
   ```typescript
   // In submodule files
   import { PipelineBuilder } from 'mongodb-typesafe-aggregation/builder';
   import { FilterOperator } from 'mongodb-typesafe-aggregation/types/filter';
   ```

#### 🔍 What Happens Under the Hood

- **Symbolic Link:** `npm install file:../` creates a symlink in `node_modules/mongodb-typesafe-aggregation -> ../..`
- **Live Updates:** Changes in the main aggregation module are immediately reflected in the submodule
- **Type Safety:** Full TypeScript support with autocomplete and error checking

### 🔄 Ensuring Changes Are Integrated

When you make changes to the aggregation module, follow this workflow to guarantee integration:

#### 🔹 Step 1: Make Changes in Main Module
```bash
# Work in the main aggregation directory
cd /path/to/aggregation
# Edit builder.ts, types/filter.ts, etc.
```

#### 🔹 Step 2: Test in Submodule Immediately
```bash
# Navigate to submodule
cd mongodb-pipeline-demo

# No reinstall needed! Changes are live via symlink
# Run TypeScript check
npx tsc --noEmit

# Test your code
npm run demo
```

#### 🔹 Step 3: Verify Integration
```bash
# Check if symlink is working
ls -la node_modules/mongodb-typesafe-aggregation
# Should show: mongodb-typesafe-aggregation -> ../..

# Verify imports work
node -e "console.log(require('mongodb-typesafe-aggregation/package.json').name)"
```

#### 🔹 Step 4: Handle Breaking Changes
If you make breaking changes to the aggregation module:

```bash
# Update imports in submodule if needed
# Test thoroughly
npm run setup && npm run demo

# Reinstall if symlink breaks
npm uninstall mongodb-typesafe-aggregation
npm install file:../
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

## 🚀 Development Workflow <a name="development-workflow"></a>

### 🔄 Working with Both Repositories

When developing features that span both the aggregation module and the submodule demo:

#### 🔹 Typical Development Flow

```bash
# 1. Start in main aggregation repo
cd /path/to/aggregation

# 2. Create feature branch
git checkout -b feature/new-aggregation-stage

# 3. Make changes to aggregation code
# Edit builder.ts, add new stages, modify types, etc.

# 4. Test immediately in submodule
cd mongodb-pipeline-demo
git checkout -b chimzuru/test-new-stage

# 5. Update demo code to use new features
# Edit src/index.ts to showcase new functionality

# 6. Verify everything works
npm run setup && npm run demo

# 7. Commit changes in submodule
git add . && git commit -m "feat: demo new aggregation stage"

# 8. Go back and commit main changes
cd ..
git add . && git commit -m "feat: add new aggregation stage"
```

### ⚡ Quick Testing Cycle

```bash
# Make change in aggregation module
echo "// New feature" >> builder.ts

# Instantly test in submodule (no reinstall needed!)
cd mongodb-pipeline-demo
npx tsc --noEmit  # Check types
npm run demo      # Run demo
```

### 🔍 Debugging Integration Issues

If imports stop working:

```bash
# 1. Check symlink status
ls -la node_modules/mongodb-typesafe-aggregation

# 2. Verify package structure
cat ../package.json | grep -A 10 "exports"

# 3. Test direct import
node -e "console.log(require.resolve('mongodb-typesafe-aggregation/builder'))"

# 4. Reinstall if needed
npm uninstall mongodb-typesafe-aggregation
npm install file:../
```

### 📊 Integration Testing Checklist

Before pushing changes:

- [ ] TypeScript compilation passes: `npx tsc --noEmit`
- [ ] Demo runs successfully: `npm run demo`
- [ ] All imports resolve correctly
- [ ] No runtime errors in aggregation pipeline execution
- [ ] New features are properly demonstrated in demo code

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

### Issue: Package imports not working
```bash
# Check if the symlink exists
ls -la node_modules/mongodb-typesafe-aggregation

# If broken, reinstall the local dependency
npm uninstall mongodb-typesafe-aggregation
npm install file:../

# Verify the package is properly linked
npm ls mongodb-typesafe-aggregation
```

### Issue: TypeScript errors with imports
```bash
# Check the parent package exports
cat ../package.json | grep -A 10 "exports"

# Clear TypeScript cache
rm -rf node_modules/.cache
npx tsc --noEmit

# Test specific import resolution
node -e "console.log(require.resolve('mongodb-typesafe-aggregation/builder'))"
```

### Issue: Changes in aggregation module not reflected
This usually means the symlink is broken:

```bash
# Verify symlink target
ls -la node_modules/mongodb-typesafe-aggregation
# Should show: mongodb-typesafe-aggregation -> ../..

# If not, reinstall
npm install file:../

# Changes should now be live instantly
```

### Issue: Demo doesn't run after aggregation changes
```bash
# Check for compilation errors
npx tsc --noEmit

# Verify database connection
npm run setup

# Run with verbose logging
DEBUG=* npm run demo
```

## 🎯 Quick Reference

### Git Submodule Commands
| Action | Command |
|--------|---------|
| Navigate to submodule | `cd mongodb-pipeline-demo` |
| Check available branches | `git branch -r` |
| Switch to branch | `git checkout origin/<branch>` |
| Create your branch | `git checkout -b your-name/branch` |
| Return to main repo | `cd ..` |
| Update submodule | `git submodule update --remote` |

### Package Integration Commands
| Action | Command |
|--------|---------|
| Install aggregation module | `npm install file:../` |
| Check symlink status | `ls -la node_modules/mongodb-typesafe-aggregation` |
| Verify TypeScript | `npx tsc --noEmit` |
| Test integration | `npm run demo` |
| Reinstall if broken | `npm uninstall mongodb-typesafe-aggregation && npm install file:../` |
| Check package linking | `npm ls mongodb-typesafe-aggregation` |

## 📝 Notes

- The submodule points to: https://github.com/augustinebest/mongodb-pipeline-demo.git
- **Package Integration:** The submodule uses `npm install file:../` to access the main aggregation module
- **Live Updates:** Changes in the aggregation module are immediately reflected in the submodule via symlink
- **Isolation:** Changes in the submodule do NOT affect the main repository
- **Branch Safety:** Always work on your own branches within the submodule
- **Git Ignore:** The `.gitignore` entry prevents accidental commits to main repo
- **Testing:** Use `npm run demo` to test integration after making aggregation changes
- **TypeScript:** Full type safety and autocomplete support across both repositories 