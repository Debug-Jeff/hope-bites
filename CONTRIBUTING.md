# Contributing to Hope Bites

We love your input! We want to make contributing to Hope Bites as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Setup Steps

1. **Fork and clone the repository:**
```bash
git clone https://github.com/your-username/hope-bites.git
cd hope-bites
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Seed the database:**
```bash
npm run seed
```

5. **Start development server:**
```bash
npm run dev
```

## Code Style

### JavaScript Style Guide

We follow these conventions:

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use camelCase for variables and functions
- Use PascalCase for classes and constructors
- Use UPPER_SNAKE_CASE for constants

### Example:
```javascript
const express = require('express');
const asyncHandler = require('../middleware/async');

const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  
  res.status(200).json({
    success: true,
    data: products
  });
});

module.exports = { getProducts };
```

### CSS Style Guide

- Use kebab-case for class names
- Use CSS custom properties for theming
- Follow BEM methodology when appropriate
- Use meaningful class names

### Example:
```css
.product-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 1rem;
}

.product-card__title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color);
}

.product-card--featured {
  border: 2px solid var(--secondary-color);
}
```

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format:
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples:
```
feat(auth): add password reset functionality

fix(cart): resolve quantity update issue

docs(api): update authentication endpoints

style(css): improve responsive design for mobile

refactor(controllers): extract common validation logic

test(payment): add Stripe integration tests

chore(deps): update dependencies to latest versions
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

We use Jest for testing. Test files should be placed in the `tests/` directory.

#### Example Test:
```javascript
const request = require('supertest');
const app = require('../server');

describe('Products API', () => {
  test('GET /api/products should return products', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

## Documentation

### API Documentation
- Update `docs/API.md` when adding or modifying API endpoints
- Include request/response examples
- Document all parameters and their types

### Code Documentation
- Use JSDoc comments for functions and classes
- Include parameter types and return values
- Provide usage examples for complex functions

#### Example:
```javascript
/**
 * Calculate order total including tax and shipping
 * @param {Object} orderData - Order data object
 * @param {Array} orderData.items - Array of order items
 * @param {number} orderData.taxRate - Tax rate (e.g., 0.08 for 8%)
 * @param {number} orderData.shippingCost - Shipping cost
 * @returns {number} Total order amount
 */
const calculateOrderTotal = (orderData) => {
  // Implementation here
};
```

## Issue Reporting

### Bug Reports

When filing a bug report, please include:

1. **Bug Description:** A clear and concise description
2. **Steps to Reproduce:** Detailed steps to reproduce the behavior
3. **Expected Behavior:** What you expected to happen
4. **Actual Behavior:** What actually happened
5. **Environment:** OS, browser, Node.js version, etc.
6. **Screenshots:** If applicable

### Feature Requests

When suggesting a feature:

1. **Feature Description:** Clear description of the feature
2. **Use Case:** Why this feature would be useful
3. **Implementation Ideas:** Any thoughts on implementation
4. **Alternatives:** Alternative solutions you've considered

## Security

### Reporting Security Issues

Please do not report security vulnerabilities through public GitHub issues. Instead, email us at security@hopebites.com.

### Security Guidelines

- Never commit sensitive data (API keys, passwords, etc.)
- Use environment variables for configuration
- Follow OWASP security guidelines
- Validate all user inputs
- Use parameterized queries to prevent SQL injection

## Code Review Process

### For Contributors

1. Ensure your code follows the style guide
2. Add tests for new functionality
3. Update documentation as needed
4. Ensure all tests pass
5. Create a detailed pull request description

### For Reviewers

1. Check code quality and style
2. Verify tests are adequate
3. Test functionality manually if needed
4. Provide constructive feedback
5. Approve when ready

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR:** Incompatible API changes
- **MINOR:** Backward-compatible functionality additions
- **PATCH:** Backward-compatible bug fixes

### Release Steps

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag
4. Deploy to production
5. Announce release

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

### Getting Help

- Check existing issues and documentation first
- Use GitHub Discussions for questions
- Join our community chat (if available)
- Email support@hopebites.com for urgent issues

## Recognition

Contributors will be recognized in:

- `CONTRIBUTORS.md` file
- Release notes
- Project documentation
- Annual contributor highlights

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Don't hesitate to reach out if you have questions about contributing:

- Create an issue with the `question` label
- Email us at dev@hopebites.com
- Check our documentation at docs.hopebites.com

Thank you for contributing to Hope Bites! 🎉