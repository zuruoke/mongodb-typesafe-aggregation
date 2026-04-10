# Contributing

Thank you for taking the time to contribute.

## Local Setup

```bash
git clone https://github.com/zuruoke/mongodb-typesafe-aggregation.git
npm install
```

## Development Workflow

```bash
# Run tests (watch mode)
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Check types
npx tsc --noEmit

# Lint
npm run lint

# Format
npm run format

# Build
npm run build
```

## Branch Convention

| Branch prefix | When to use                           |
| ------------- | ------------------------------------- |
| `feat/`       | New stage or operator                 |
| `fix/`        | Bug fix                               |
| `docs/`       | Documentation only                    |
| `refactor/`   | Code restructure, no behaviour change |
| `test/`       | New or improved tests                 |
| `chore/`      | Tooling, deps, CI                     |

Branch off `main` and target `main` with your PR.

## Adding a New Pipeline Stage

1. Create `stages/my-stage.ts` following the existing pattern (export `MyStageSpec` interface + `myStage()` function).
2. Export it from `stages/index.ts`.
3. Add the corresponding method to `PipelineBuilder` in `builder.ts`.
4. Write a test case in `__tests__/stages.test.ts` and `__tests__/builder.test.ts`.
5. Document it in `CHANGELOG.md` under an `[Unreleased]` section.

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(stages): add $sortByCount stage
fix(filter): handle null in exists operator
docs: update API reference table
```

## Pull Request Checklist

- [ ] Tests pass (`npm test`)
- [ ] No new lint errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] New behaviour is covered by a test
- [ ] `CHANGELOG.md` updated under `[Unreleased]`

## Releasing (Maintainers)

1. Update `CHANGELOG.md` — move `[Unreleased]` to the new version with today's date.
2. Bump the version: `npm version patch | minor | major`
3. Push the commit and the tag: `git push && git push --tags`
4. The `release.yml` GitHub Action publishes to npm automatically.
