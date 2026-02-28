# DEVELOPMENT GUIDELINES

These guidelines define coding standards and best practices for developing in the Gluten Guardian Project. They are meant to ensure code quality, observability, maintainability, and seamless collaboration within AI-augmented workflows.

The guideline is here to produce traceable, testable, and validated code.
## 1. Logging

### ✅ Use Structured Logging
- Use the Logger class which wraps [Pino](https://getpino.io/).
- All logs must be structured JSON.
- Avoid using `console.log` ,vite log or raw `pino` instances.

### 🔧 Logging Format
Every log entry should include:
- `timestamp`
- `level`
- `context` (module or file name)
- `traceID`
- `message`
- `metadata` (structured key-value)

### 📍 Logging Example
```ts
import { logger } from './logger';

logger.info({
  context: 'user-service',
  userId: 'abc123',
  action: 'UserCreated'
}, 'New user created');
```
## 2. OpenTelemetry Integration
📌 Instrumentation
All services and HTTP routes must be traced.

Use the project-standard OpenTelemetry middleware for automatic instrumentation whi

Manual spans should be used for critical business logic.

📍 Manual Span Example
```ts

const span = tracer.startSpan('process-order');
try {
  await processOrder(orderId);
} finally {
  span.end();
}
```
📎 Correlation
Ensure trace IDs are injected into logs.

Use the logger’s context linking feature to enrich logs with trace information.

## 3. Documentation
📄 File Header
Each file must start with a header block:

```ts
/**
 * @fileoverview [Short description of what this module does]
 * @module [module-name]
 */
```
📑 Function & Method Docs
Use JSDoc format:

```ts
/**
 * Processes a new order and updates inventory.
 * 
 * @param {Order} order - The order object.
 * @returns {Promise<boolean>} - Returns true if successful.
 */
async function processOrder(order) { ... }
```

## 4. Unit Testing
🧪 Test Framework
Use the defined project testing framework - Jest .
test are implemented in the `__tests__` folder. each code file should have a dedicated test code file

Tests must cover:

- Normal paths
- Edge cases
- Invalid inputs

✅ Best Practices
- 100% coverage for business logic.
- Avoid relying on external services (use mocks).
- Place tests in __tests__ folders or co-located as .test.ts.

## 5. Input Validation
🔍 Runtime Validation

All external inputs (HTTP, CLI, etc.) must be validated.

Fail-fast on invalid input.

📍 Example
```ts
const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email()
});
const validated = userSchema.parse(input);
```
use The following libraries to implement input validation "  

| Language       |   Library        |
|----------------|------------------|
| Javascript /typescript    |   Zod            | 
| C#             | FluentValidation |
| Python         | Pydantic         |


## 6. Versioning
🔢 SemVer
Follow Semantic Versioning:

MAJOR: Breaking changes

MINOR: New features, backward compatible

PATCH: Fixes and improvements

🛠️ Internal Change Policy
Even internal refactors must bump patch version if deployed.

Library contracts must be versioned with public changelogs.

## 7. Commit Handling
✍️ Conventional Commits
Use the Conventional Commits standard:

```swift

<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
Allowed Types:
feat: New feature

fix: Bug fix

chore: Maintenance or build changes

docs: Documentation only

refactor: Code refactoring

test: Adding or updating tests
```
📍 Examples
```csharp
feat(auth): add OAuth2 flow support
fix(api): handle null response from endpoint
```
## 8. Git Branching
🌿 Feature Branch Flow
Use feature branches for each unit of work:

feature/<short-description>

bugfix/<short-description>

🔄 Process
Branch from dev


Open Pull Request when complete

Use Squash and Merge strategy

## 9. Exception Handling  

There should be a consistent and robust approach to exception handling across. It ensures clarity, maintainability, and reliability , and improves observability, debugging, and user experience.

### 🔒 Principles

1. **Fail Fast, But Fail Clearly**
   Code should fail early when something goes wrong, with exceptions that clearly indicate *what*, *where*, and *why* the error occurred.

2. **Never Swallow Exceptions Silently**
   Always log or propagate exceptions. Silent failures are the hardest to debug and the most dangerous.

3. **Don't Use Exceptions for Flow Control**
   Use exceptions for **exceptional** conditions, not as part of regular logic.

4. **Preserve the Stack Trace**
   Always rethrow exceptions correctly to avoid losing context. In C#: `throw;` not `throw ex;`.

5. **Enrich Exceptions, Don’t Replace Without Cause**
   Wrap or extend exceptions only when adding valuable context. Do not replace exceptions just to “simplify” — clarity is more valuable.


### ✅ Mandatory Guidelines

#### 1. **Define Clear Exception Boundaries**

* Only catch exceptions **when you can handle or enrich them.**
* Let exceptions bubble up to a central handler (middleware, controller filter, etc.) when not recoverable at the current layer.

#### 2. **Log Meaningfully**

* Always include:

  * Exception type and message
  * Stack trace
  * Context (user ID, request ID, inputs, feature flag states)
* Use structured logging where possible.

#### 3. **Wrap External Exceptions With Context**

* Wrap only when necessary. Always keep the original exception as the inner/root cause.
* Example (C#):

  ```csharp
  try {
      externalService.Call();
  } catch (HttpException ex) {
      throw new ExternalServiceException("Failed to call PaymentService", ex);
  }
  ```

#### 4. **Use Custom Exceptions Sparingly and Precisely**

* Create custom exceptions only for domain-specific errors.
* All custom exceptions must inherit from a common base (`AppException`, `DomainException`, etc.).
* Always document their purpose.

#### 5. **Validation Is Not an Exception**

* Use validation result objects (`Result<T>`, `Either`, etc.) for expected input failures.
* Throw exceptions only when a failure is unexpected or unrecoverable.


### 🚨 Anti-Patterns to Avoid

| Anti-pattern                                           | Why It’s Bad                            |
| ------------------------------------------------------ | --------------------------------------- |
| `catch (Exception) {}`                                 | Swallows all issues silently.           |
| Logging without rethrowing                             | Hides the real error source.            |
| Over-catching (e.g., `catch (Exception)`) in deep code | Leads to misbehavior and hidden bugs.   |
| Using exceptions for control flow                      | Poor performance and readability.       |
| Empty catch blocks                                     | Makes debugging and logging impossible. |


### 🔄 Error Handling Strategy by Layer

| Layer                    | Responsibility                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------- |
| **Domain Layer**         | Throw domain-specific exceptions for rule violations (e.g., `InvalidStateException`). |
| **Application Layer**    | Catch and translate infrastructure errors into domain/application exceptions.         |
| **API/Controller Layer** | Catch known exceptions and return meaningful error responses (e.g., HTTP 400/500).    |
| **Global Middleware**    | Fallback for uncaught exceptions, logs and returns generic error messages.            |

## 🛠 Tools & Practices

* **Structured Logging**: Use tools like Serilog (C#), Pino (Node.js), or Loguru (Python).
* **OpenTelemetry Tracing**: Ensure exceptions are captured in distributed traces.
* **Alerting**: Exceptions reaching the global handler should trigger monitoring alerts when thresholds are exceeded.

## 📌 Review Checklist

Before merging, ensure:

* [ ] All caught exceptions are logged and/or rethrown.
* [ ] No generic `catch (Exception)` blocks exist without strong justification.
* [ ] Exception messages include context but avoid leaking sensitive data.
* [ ] Unit tests assert that expected exceptions are thrown when appropriate.
* [ ] API responses for errors are properly shaped and documented.


## 📎 Appendix

### Recommended Base Exception Class (C#)

```csharp
public abstract class AppException : Exception {
    protected AppException(string message, Exception inner = null)
        : base(message, inner) { }
}
```
Certainly! Here's a **comprehensive Coding Standard Directive** tailored for a software engineering team working with **JavaScript**, **C#**, and **Python**. This directive addresses coding style, structure, and best practices, and references the most widely respected public guidelines for each language.

## 9. Coding Standards

The purpose of this directive is to enforce **consistency**, **readability**, and **maintainability** across our codebase. Adherence to clear, language-specific coding standards ensures easier onboarding, fewer bugs, and improved collaboration.

### 🧭 Key Principles (All Languages)

1. **Readability First**
   Code is read more often than written. Write clean, expressive, and self-documenting code.

2. **Consistency Beats Cleverness**
   Follow a consistent style even if it feels verbose or less elegant. Prioritize team alignment over individual preference.

3. **Fail Early and Explicitly**
   Validate assumptions and inputs early. Avoid silent failures and ambiguous behaviors.

4. **Keep It Small and Focused**
   Functions, classes, and modules should do one thing well.

5. **Avoid Duplication**
   Use DRY (Don't Repeat Yourself) principles with caution. Sometimes repetition is better than improper abstraction.

6. **Automate Formatting and Linting**
   All languages must use linters, formatters, and CI-enforced code style checks.

### 🔵 JavaScript/TypeScript

#### ✅ Adopted Guideline:

* [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
* [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
* TypeScript: [Microsoft TypeScript Style Guide](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines)

#### 🔑 Key Practices:

* Use `const` and `let`, never `var`
* Prefer arrow functions and anonymous callbacks for clarity
* Destructure objects and arrays when possible
* Enforce strict equality (`===`)
* Avoid deep nesting (>2 levels); refactor into functions
* Use async/await over promise chaining
* Use ESLint with Airbnb config:

  ```bash
  npx eslint --init # Choose Airbnb style
  ```

#### 🔧 Tools:

* ESLint + Prettier
* TypeScript for strict typing
* Husky + Lint-staged for pre-commit checks


### 🟣 C\#

#### ✅ Adopted Guideline:

* [Microsoft C# Coding Conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
* [StyleCop Analyzers](https://github.com/DotNetAnalyzers/StyleCopAnalyzers)

#### 🔑 Key Practices:

* Use **PascalCase** for classes, methods, and properties
* Use **camelCase** for local variables and parameters
* Prefer `var` when the type is obvious
* Always specify access modifiers (public/private)
* Use expression-bodied members when appropriate
* Use `async`/`await`, avoid `Task.Result` and `Task.Wait`
* Never abbreviate names (e.g., use `customerId`, not `custId`)
* One class per file

#### 🔧 Tools:

* Roslyn analyzers
* StyleCop + FxCop
* dotnet-format for automatic formatting

### 🟠 Python

#### ✅ Adopted Guideline:

* [PEP 8 – Style Guide for Python Code](https://peps.python.org/pep-0008/)
* [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
* Optionally: [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)

#### 🔑 Key Practices:

* Use **snake\_case** for functions and variables
* Use **PascalCase** for classes
* Indent with 4 spaces, no tabs
* Use `is`/`is not` for identity, `==`/`!=` for equality
* Never catch generic `Exception` unless rethrowing
* Write docstrings for modules, classes, and public functions
* Avoid implicit behavior; be explicit

#### 🔧 Tools:

* `black` for formatting
* `flake8` or `ruff` for linting
* `mypy` for static typing

### 🛠 Common Practices Across All Languages

| Area               | Standard                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **Naming**         | Use descriptive names. Avoid one-letter variables outside loops.                                        |
| **Comments**       | Use them to explain “why”, not “what”. Prefer expressive code.                                          |
| **Error Handling** | See [Exception Handling Directive](#)                                                                   |
| **Testing**        | Write unit tests. Follow test naming conventions (e.g., `MethodName_Should_DoSomething_When_Condition`) |
| **Documentation**  | Public APIs and modules must be documented. Use docstrings/XML comments/JSDoc.                          |
| **Code Reviews**   | Mandatory before merge. Enforce linters and tests via CI.                                               |

---

### 🧪 Review Checklist

Before committing, ensure:

* [ ] Code follows language-specific style guides.
* [ ] No linting or formatting errors.
* [ ] Names are clear and meaningful.
* [ ] No dead code or unused imports.
* [ ] Edge cases are handled gracefully.
* [ ] Unit tests cover critical paths.
* [ ] Code is appropriately modular and scoped.

