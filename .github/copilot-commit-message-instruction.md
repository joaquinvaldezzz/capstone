# Copilot Instructions - Conventional Commits

## Overview

This project uses Conventional Commits for all commit messages. Follow these guidelines strictly when generating commit messages or suggesting code changes.

## Commit Message Format

```
<type>([optional scope]): <description>

[optional body]

[optional footer]
```

### Structure Rules

- **First line**: Type, optional scope in parentheses, colon, space, description
- **Empty line** between description and body (if body exists)
- **Empty line** between body and footer (if footer exists)
- Maximum 100 characters for the first line (type + scope + description)

## Commit Types

### Primary Types

#### `feat`

Add, adjust, or remove API or UI features

- **Use when**: Implementing new functionality, modifying existing features, or removing features
- **Examples**:
  - `feat(auth): add OAuth2 authentication`
  - `feat(api): add user profile endpoint`
  - `feat: remove deprecated payment methods`

#### `fix`

Fix API or UI bugs from preceding `feat` commits

- **Use when**: Correcting bugs in existing features
- **Examples**:
  - `fix(auth): prevent token expiration edge case`
  - `fix(api): correct user validation logic`
  - `fix: resolve null pointer in payment processing`

#### `refactor`

Rewrite code without altering its external behavior

- **Use when**: Improving code structure, readability, or maintainability
- **Examples**:
  - `refactor(auth): simplify token validation logic`
  - `refactor: extract common utility functions`
  - `refactor(database): reorganize query builders`

#### `perf`

Special refactor type that improves performance

- **Use when**: Making changes specifically to improve performance
- **Examples**:
  - `perf(database): add index on user_id column`
  - `perf(api): cache frequently accessed data`
  - `perf: optimize image loading algorithm`

#### `style`

Code formatting changes only (whitespace, semicolons, etc.)

- **Use when**: Making formatting changes with no behavior impact
- **Examples**:
  - `style: fix indentation in auth module`
  - `style(api): add missing semicolons`
  - `style: apply prettier formatting`

#### `test`

Add or correct tests

- **Use when**: Adding new tests or fixing existing test cases
- **Examples**:
  - `test(auth): add unit tests for token validation`
  - `test: fix flaky integration tests`
  - `test(api): add edge case coverage for user endpoints`

#### `docs`

Documentation-only changes

- **Use when**: Updating README, comments, API docs, or other documentation
- **Examples**:
  - `docs: update API documentation`
  - `docs(readme): add installation instructions`
  - `docs(api): clarify authentication requirements`

#### `build`

Build tools, dependencies, versions, CI/CD pipelines

- **Use when**: Updating dependencies, build scripts, or CI/CD configurations
- **Examples**:
  - `build: upgrade to Node.js 20`
  - `build(deps): update express to v5.0.0`
  - `build(ci): add automated deployment pipeline`

#### `ops`

Infrastructure, deployment, backup, recovery

- **Use when**: Making operational or infrastructure changes
- **Examples**:
  - `ops: configure database backup schedule`
  - `ops(deploy): update production environment variables`
  - `ops: add health check endpoint for monitoring`

#### `chore`

Miscellaneous changes that don't fit other types

- **Use when**: Making minor changes like updating .gitignore, cleanup tasks
- **Examples**:
  - `chore: update .gitignore`
  - `chore: remove unused dependencies`
  - `chore: clean up temporary files`

## Scope Guidelines

### When to Use Scope

- Provide contextual information about what part of the codebase is affected
- Use lowercase, kebab-case if multi-word: `user-management`
- Keep scopes consistent across the project
- Common scopes: `api`, `auth`, `database`, `ui`, `config`, `docs`

### When NOT to Use Scope

- Do NOT use issue identifiers as scopes (use footer instead)
- Avoid overly specific scopes that won't be reused
- Skip scope if the change affects the entire project

### Examples

- `feat(api): add pagination support`
- `fix(auth): resolve session timeout issue`
- `refactor(database): migrate to TypeORM`

## Description Guidelines

### Format Rules

- **Mandatory**: Every commit must have a description
- **Imperative mood**: Use present tense ("add" not "added" or "adds")
- **No capitalization**: Start with lowercase letter
- **No period**: Don't end with a period
- **Concise**: Keep it short and clear (50 characters or less ideal)

### Good Examples

- `add user registration endpoint`
- `fix validation error in login form`
- `remove deprecated payment gateway`
- `update documentation for API versioning`

### Bad Examples

- ~~`Added user registration endpoint`~~ (past tense)
- ~~`Fix validation error in login form`~~ (capitalized)
- ~~`remove deprecated payment gateway.`~~ (ends with period)
- ~~`This commit updates the documentation for API versioning to reflect the new changes`~~ (too verbose)

## Breaking Changes

### Indicating Breaking Changes

- Add `!` before the colon: `<type>(<scope>)!: <description>`
- Must include `BREAKING CHANGE:` in footer if description lacks detail

### Examples

```
feat(api)!: remove status endpoint

The /status endpoint has been removed. Use /health instead.

BREAKING CHANGE: The /status endpoint is no longer available. All clients should migrate to the new /health endpoint which provides enhanced status information.
```

```
refactor(auth)!: change token payload structure

BREAKING CHANGE: Token payload structure has changed from flat object to nested structure. All token validation logic must be updated.
```

## Body Guidelines

### When to Use Body

- Explain **why** the change was made
- Describe **motivation** for the change
- Contrast with **previous behavior**
- Provide additional context not obvious from description

### Format

- Use imperative mood
- Wrap at 72 characters per line
- Separate from description with blank line

### Example

```
fix(api): prevent race condition in user creation

Under high load, concurrent requests could create duplicate users
with the same email address. This fix adds a unique database
constraint and implements optimistic locking to prevent this scenario.

The race condition was discovered during load testing and could
affect production if multiple signup requests occur simultaneously.
```

## Footer Guidelines

### Issue References

- Reference related issues or tickets
- Format: `Closes #123`, `Fixes #456`, `Resolves JIRA-789`
- Can reference multiple issues: `Closes #123, #456`

### Breaking Changes

- Must start with `BREAKING CHANGE:` followed by description
- Required for all breaking changes unless fully described in commit description

### Examples

```
feat(api): add user search endpoint

Closes #142
```

```
fix(auth): resolve token refresh bug

This fixes an edge case where tokens would fail to refresh if the
user's session was close to expiration.

Fixes #289
Closes #301
```

## Complete Examples

### Simple Feature

```
feat(api): add user profile endpoint
```

### Feature with Body

```
feat(auth): implement JWT refresh token rotation

Implements automatic rotation of refresh tokens for enhanced security.
When a refresh token is used, a new one is issued and the old one is
invalidated to prevent token replay attacks.

Closes #156
```

### Breaking Change

```
feat(api)!: change user response format

BREAKING CHANGE: User API responses now return camelCase field names
instead of snake_case. Clients must update their field mapping logic.
- user_name -> userName
- created_at -> createdAt
- updated_at -> updatedAt

Closes #201
```

### Bug Fix

```
fix(database): prevent connection pool exhaustion

Under sustained high load, database connections were not being
properly released back to the pool, causing eventual exhaustion.
This fix ensures connections are always returned using try-finally
blocks.

Fixes #312
```

### Refactor

```
refactor(api): extract validation middleware

Moved validation logic from individual route handlers into reusable
middleware functions. This improves consistency and reduces code
duplication across endpoints.
```

## Special Commit Types

### Initial Commit

```
chore: init
```

### Merge Commits

- Use default git merge message format
- Example: `Merge branch 'feature/user-auth' into main`

### Revert Commits

```
revert: feat(api): add user search endpoint

This reverts commit a1b2c3d4.
```

## Versioning Impact

Understanding how commits affect versioning:

- **Breaking changes** (`!` or `BREAKING CHANGE:`) → Increment MAJOR version (1.0.0 → 2.0.0)
- **Features** (`feat`) → Increment MINOR version (1.0.0 → 1.1.0)
- **Fixes** (`fix`) → Increment PATCH version (1.0.0 → 1.0.1)
- **All other types** → Increment PATCH version (1.0.0 → 1.0.1)

## Quick Reference Checklist

When generating or reviewing commits, verify:

- [ ] Correct commit type from the standard list
- [ ] Scope is lowercase and meaningful (if used)
- [ ] Description uses imperative mood, lowercase, no period
- [ ] Description is concise and clear
- [ ] Breaking changes marked with `!` before colon
- [ ] Body explains why (if needed)
- [ ] Footer includes `BREAKING CHANGE:` (if applicable)
- [ ] Footer references issues (if applicable)
- [ ] No personal identifiers or sensitive information

## Common Mistakes to Avoid

1. ~~`Fix: bug in auth`~~ - Don't capitalize type
2. ~~`feat: Added new feature`~~ - Use imperative mood ("add" not "Added")
3. ~~`fix(#123): resolve bug`~~ - Don't use issue numbers as scope
4. ~~`feat: new feature.`~~ - Don't end description with period
5. ~~`update: change config`~~ - Use proper type (`chore`, `feat`, `fix`, etc.)
6. ~~`feat(API): add endpoint`~~ - Don't capitalize scope
7. ~~`fix(): resolve issue`~~ - Don't use empty scope (omit if not needed)

## Summary

Always follow this format for maximum clarity and consistency:

```
<type>([scope]): <imperative description>
<blank line>
[why was this needed?]
[what did it change?]
<blank line>
[BREAKING CHANGE: details]
[Closes #123]
```

When in doubt:

- Keep it simple and concise
- Focus on the "what" and "why"
- Use imperative mood consistently
- Be specific but brief in descriptions
