# KPMG SAP EMA Hub WRICEF Estimation Tool Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Key Features](#key-features)
4. [Technical Stack](#technical-stack)
5. [Project Structure](#project-structure)
6. [Core Components](#core-components)
7. [Data Management](#data-management)
8. [Business Logic](#business-logic)
9. [Export Features](#export-features)
10. [Adding New Features](#adding-new-features)
11. [Deployment](#deployment)

## Overview
The WRICEF Estimation Tool is a web application designed to help estimate effort for SAP WRICEF components (Workflows, Reports, Interfaces, Conversions, Enhancements, Forms, Fiori apps, and Innovation & Automation). It provides a user-friendly interface for creating work packages and estimating effort based on complexity levels.

## Architecture

### Client-Side
- React-based SPA (Single Page Application)
- State management using React hooks
- Browser-based storage using IndexedDB
- Excel/PDF export functionality

### Server-Side
- Express.js server
- Static file serving
- Production-ready middleware setup
- Cloud Foundry compatible

## Key Features
1. Work Package Management
   - Create, edit, and delete work packages
   - Add/remove WRICEF components
   - Set contingency factors
   - Define project timeline
   - Calculate FTE requirements

2. Estimation System
   - Three complexity levels (High, Medium, Low)
   - Pre-defined effort matrices
   - Automatic calculations
   - Effort split between functional and technical teams
   - Role-based effort allocation

3. Draft System
   - Save work packages as drafts
   - Browser-based persistence
   - Bulk draft management

4. Bulk Operations
   - Excel template download
   - Excel-based import
   - Bulk export of estimates
   - Automatic component distribution
   - PDF report generation with detailed analysis

5. Resource Planning
   - Timeline-based FTE calculation
   - Role-based effort distribution
   - Separate tracking for functional and technical teams
   - Consultant level categorization (Junior/Mid/Senior)

## Technical Stack
- Frontend:
  - React 18.x
  - TypeScript
  - Tailwind CSS
  - XLSX library for Excel operations
  - jsPDF for PDF generation
  - Lucide React for icons

- Backend:
  - Node.js
  - Express.js
  - Compression middleware
  - Security middleware

## Project Structure
```
├── src/
│   ├── components/        # React components
│   ├── data/             # Static data and configurations
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── server/
│   ├── config/           # Server configuration
│   └── middleware/       # Express middleware
└── public/               # Static assets
```

## Core Components

### EstimationForm
Main container component managing the overall estimation workflow.

### WorkPackagePanel
Handles individual work package display and editing, including:
- Timeline management
- Contingency settings
- Component management
- FTE calculations

### WRICEFPanel
Manages WRICEF component estimations within work packages:
- Complexity-based estimation
- Effort distribution
- Role-based calculations

### EffortSplitPanel
Displays detailed breakdown of functional and technical effort:
- Lead/Architect allocation
- Consultant level distribution
- Effort visualization

### TimelineSlider
Manages project timeline:
- Visual timeline selection
- FTE calculation basis
- Range validation

### FTEDisplay
Shows FTE requirements:
- Team-wise breakdown
- Role-based allocation
- Timeline-based calculations

## Business Logic

### Effort Calculation
```typescript
interface EffortSplit {
  functional: {
    lead: number;      // 5% of functional
    consultant: {
      senior: number;  // High complexity
      mid: number;     // Medium complexity
      junior: number;  // Low complexity
    }
  };
  technical: {
    architect: number; // 10% of technical
    consultant: {
      senior: number;  // High complexity
      mid: number;     // Medium complexity
      junior: number;  // Low complexity
    }
  }
}
```

### FTE Calculation
```typescript
interface FTECalculation {
  timeline: number;
  functional: {
    lead: number;
    seniorConsultant: number;
    consultant: number;
    juniorConsultant: number;
  };
  technical: {
    architect: number;
    seniorConsultant: number;
    consultant: number;
    juniorConsultant: number;
  };
}

// Formula: FTE = effort_days / timeline_days
```

### Component Distribution
The system supports two modes of estimation:

1. Manual Mode
   - Users specify quantities per WRICEF type
   - Individual complexity levels

2. Bulk Distribution Mode
   - Users specify total counts per complexity
   - System automatically distributes across types
   - Priority order: Enhancement > Report > Form > Others

### Distribution Algorithm
```typescript
function distributeBulkEstimates(counts: Record<Complexity, number>) {
  // 1. Calculate even distribution
  // 2. Handle remainders by priority
  // 3. Validate final distribution
}
```

## Export Features

### Excel Export
- Summary sheet with overall metrics
- Detailed view with component breakdowns
- Work package information
- Effort split calculations
- FTE calculations per role
- Timeline information

### PDF Export
- Executive summary
- Work package details
- Component breakdowns
- Effort distribution charts
- Role-based effort allocation
- FTE requirements
- Timeline analysis

## Adding New Features

### Adding a New WRICEF Type
1. Update types:
   ```typescript
   export type WRICEFType = 'Existing' | 'NewType';
   ```

2. Add estimation matrix:
   ```typescript
   NewType: {
     High: { 
       baseDays: number,
       functionalSplit: number,
       technicalSplit: number
     },
     Medium: { ... },
     Low: { ... }
   }
   ```

3. Add tooltips and documentation

### Adding New Metrics
1. Update calculation utilities
2. Modify UI components
3. Update export formats

## Best Practices
1. Code Organization:
   - Keep components small and focused
   - Extract reusable logic
   - Maintain clear file structure
   - Use TypeScript for type safety

2. State Management:
   - Use React hooks effectively
   - Implement proper error handling
   - Maintain atomic state updates

3. Performance:
   - Implement proper memoization
   - Optimize re-renders
   - Handle large datasets efficiently

4. Security:
   - Validate all inputs
   - Implement proper CORS policies
   - Use security headers