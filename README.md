# 🛒 Shopping Cart

A modern shopping cart application built with Next.js, React, and TypeScript, following clean architecture principles and feature-driven development.

---

## 📋 Project Overview

A successful promotional campaign can bring many advantages to businesses looking to acquire new customers, increase sales, or clear out stock. Our goal is to create a shopping cart system with a promotional campaign and differentiated pricing based on user type.

### 🎯 Promotions

#### 1. Get 3 for the Price of 2

Customers who add multiple products to their cart will receive the third product for free. The free product will always be the lowest-priced item.

- **Buy 1** → pay for 1
- **Buy 2** → pay for 2
- **Buy 3** → pay for 2 _(lowest-priced item is free)_
- **Buy 4** → pay for 3, and so on

#### 2. VIP Discount

VIP customers enjoy a **15% discount** on all purchases. However, VIP customers **cannot combine this discount with the "Get 3 for the Price of 2" promotion**.

The system **automatically calculates and suggests the best pricing option** (either using the VIP discount or the "Get 3 for 2" promotion) based on the user's cart contents and user type (VIP or common).

### ✅ Key Requirements

- **Add/Remove Items**: The API can add and remove items from the shopping cart
- **User Type Detection**: The API identifies whether the customer is VIP or common
- **Smart Pricing Calculation**: The system calculates the total price based on:
  - **"Get 3 for 2" promotion** for common users
  - **VIP discount (15%)** for VIP customers
  - **Best Deal Recommendation**: For VIP customers, the API decides whether it's better to apply the 15% discount or the "Get 3 for 2" promotion and recommends the best deal

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd shopping-cart
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run the development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

### 🧪 Testing

```bash
# Run unit and integration tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Open Cypress test runner
pnpm test:e2e:open
```

---

## 🏗️ Architecture

### Overview

This project follows a **feature-driven architecture** with **unidirectional data flow** principles, designed for scalability, maintainability, and team collaboration.

### 📁 Folder Structure

```
src/
│
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
│
├── components/          # Shared components
│   ├── error/           # Error boundary components
│   └── layout/          # Layout components
│
├── features/            # Feature-based modules
│   ├── products/        # Product-related features
│   │   ├── product-list.tsx
│   │   └── product-card.tsx
│   └── cart/            # Cart-related features
│       ├── actions/     # Server Actions
│       ├── components/  # Feature-specific components
│       ├── services/    # Business logic
│       ├── types/       # TypeScript types
│       ├── utils/       # Utility functions
│       └── testing/     # Test utilities
│
├── lib/                 # Shared libraries and configurations
│   ├── constants.ts     # Application constants
│   └── mock-api.ts      # API mocking utilities
│
├── context/             # React Context providers
│
└── types/               # Shared TypeScript types
```

### 🎯 Feature-Driven Development

Each feature is self-contained and follows this structure:

```
src/features/[feature-name]/
│
├── actions/         # Server Actions and API calls
├── components/      # Feature-specific components
├── services/        # Business logic and data processing
├── types/          # TypeScript types for the feature
├── utils/          # Utility functions
└── testing/        # Test utilities and mocks
```

**Benefits:**

- **Scalability**: Easy to add new features without affecting existing code
- **Maintainability**: Clear separation of concerns and responsibilities
- **Team Collaboration**: Multiple developers can work on different features simultaneously
- **Code Organization**: Prevents monolithic file structures
- **Testing**: Isolated testing of individual features

### 🔄 Unidirectional Architecture

The codebase follows a strict unidirectional flow:

```
Shared → Features → App
```

**Rules:**

- Shared components and utilities can be used by any part of the application
- Features can only import from shared parts
- Features cannot import from other features
- App layer can import from both features and shared parts

This architecture can be enforced using ESLint rules to prevent cross-feature dependencies.

---

## 🎨 Design Decisions

### ⚡ Server-First Approach

The application follows a **"server-first"** philosophy with client-side interactivity as the exception:

- **React Server Components (RSC)**: Used by default for all components
- **Server Actions**: Handle form submissions and data mutations
- **Minimal Client State**: Reduces JavaScript bundle size and improves performance

### 🛠️ Key Technologies

- **React Server Components**: For server-side rendering and data fetching
- **Server Actions**: Handle form submissions and data mutations
- **TypeScript**: Full type safety across the application
- **TailwindCSS**: Utility-first styling approach
- **Next.js App Router**: File-based routing and layouts

### 🧩 Component Strategy

#### Server Components by Default

Every component starts as a Server Component unless client-side interactivity is specifically required. This approach:

- Reduces JavaScript bundle size
- Improves initial page load performance
- Enables better SEO and accessibility
- Simplifies data fetching and state management

#### Client Components as Exception

Client components are only used when necessary for:

- Interactive UI elements (forms, buttons with immediate feedback)
- State management that requires client-side reactivity
- Browser-specific APIs (localStorage, geolocation, etc.)
- Third-party libraries that require client-side execution

#### Optimistic Updates

The application implements optimistic UI updates for better user experience:

- Immediate visual feedback for user actions
- Graceful handling of network failures
- Consistent state management across server and client

### 📊 State Management Philosophy

#### Minimalist Approach

- **Server State**: Primary source of truth lives on the server
- **Client State**: Only when absolutely necessary for UI interactions
- **Form State**: Handled by Server Actions with progressive enhancement
- **Context Usage**: Limited to cross-cutting concerns

### 🚀 Performance Optimizations

1. **Server-Side Rendering**: Faster initial page loads
2. **Code Splitting**: Automatic code splitting by features
3. **Bundle Optimization**: Minimal client-side JavaScript

---

## 🧪 Testing Strategy

The goal was to ensure confidence in the system's behavior with effective and maintainable tests, focused on what truly matters to the end user.

### 📋 Principles Followed

- ✅ Test **observable behavior**, not internal implementation details
- ✅ Write tests that only fail **when expected behavior changes**, not just when implementation changes
- ✅ Prioritize **integration tests**, complemented by some unit tests for pure logic and a few E2E tests for critical flows
- 🚫 Avoid fragile tests that depend on internal implementation, such as isolated hooks or internal function calls

### 🏆 Test Distribution

| Test Type                  | Purpose                                                                                  | Tool Used |
| -------------------------- | ---------------------------------------------------------------------------------------- | --------- |
| **Unit tests**             | Test pure calculation functions in isolation                                             | Jest      |
| **Integration (priority)** | Test the system as a whole, ensuring business rules and promotions are correctly applied | Jest      |
| **End-to-End (E2E)**       | Validate the main flows from the user's perspective in the browser                       | Cypress   |

### 📦 What Was Tested

- Adding and removing items from the cart
- Correctly identifying the user type (VIP or common)
- Correctly calculating the total for all defined scenarios
- Applying the correct promotions (_Get 3 for 2_ and _VIP 15%_), always choosing the most advantageous one
- Proper recommendations to the user in each scenario

### 📄 Notes

- The `mock-api.ts` file was not tested, as it is just a temporary mock while the real API is not yet available
- The focus was on the system logic and user flow, not on rendering React components

---

## 📈 Scalability Considerations

- **Domain Separation**: Features can evolve into domain-specific modules
- **Sub-features**: Support for nested features within larger features
- **Micro-frontends**: Architecture supports evolution to micro-frontend patterns

---

## 🚦 Future Enhancements

- **ESLint Rules**: Add custom rules to enforce unidirectional architecture
- **Suspense Integration**: Implement React Suspense for better loading states and error boundaries
- **Monitoring**: Add performance and error monitoring
- **CI/CD**: Automated deployment and testing pipelines

---

**Built with ❤️ using Next.js, React, and TypeScript**
