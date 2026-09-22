# Appointment Booking Component Layout Specification

## Overview
Create a modern, responsive appointment booking component with the exact same layout, styling, and functionality as the reference component.

## Component Structure

### 1. Main Container
- **Background**: White (`bg-white`)
- **Border Radius**: 3xl (`rounded-3xl`)
- **Shadow**: 2xl (`shadow-2xl`)
- **Border**: Light gray (`border border-gray-100`)
- **Padding**: 8 (`p-8`)
- **Responsive**: Full width with proper spacing

### 2. Header Section
```jsx
<div className="text-center mb-12">
  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
    Choose Your Preferred Location
  </h2>
  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
    [Doctor Name] is available at two premium healthcare facilities in [City]
  </p>
</div>
```

### 3. Hospital Cards Grid
- **Grid Layout**: 1 column on mobile, 2 columns on medium+ screens (`grid grid-cols-1 md:grid-cols-2`)
- **Gap**: 6 (`gap-6`)
- **Items**: Stretch to equal height (`items-stretch`)

### 4. Individual Hospital Card Structure
```jsx
<div className="group relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full">
```

#### Card Components:

**A. Hospital Header (Centered)**
- Icon container: 14x14, gradient background, rounded-2xl
- Icon: MapPin (7x7, white)
- Hospital name: text-xl, font-bold, gray-900
- Description: text-sm, gray-600, line-clamp-2

**B. Hospital Details (Flex-grow)**
- Address section with MapPin icon
- Available times section with Clock icon
- Each detail has: icon (4x4, blue-600), title (font-semibold), content (text-sm, gray-600)
- "Get Directions" link with Navigation icon

**C. Book Appointment Button (Bottom)**
- Gradient button: blue-600 to indigo-600
- Hover effects: darker gradient
- Icon: Calendar (4x4)
- Text: "Book Appointment"
- Shadow effects on hover

**D. Hover Accent Bar**
- Bottom border: gradient from blue-500 via indigo-500 to purple-500
- Transform: scale-x-0 to scale-x-100 on hover
- Duration: 500ms

### 5. Additional Information Section
```jsx
<div className="mt-12 p-6 bg-blue-50 rounded-2xl">
  <h3 className="text-lg font-semibold text-blue-900 mb-4 text-center">
    Important Information
  </h3>
  <div className="grid md:grid-cols-2 gap-4">
    {/* Two columns of information items */}
  </div>
</div>
```

#### Information Items Structure:
- CheckCircle icon (4x4, blue-600)
- Text: small, blue-800
- Flex layout with proper spacing

## Required Icons (Lucide React)
- `Calendar`
- `Clock` 
- `MapPin`
- `CheckCircle`
- `Navigation`

## Color Scheme
- **Primary**: Blue-600 to Indigo-600 gradients
- **Text**: Gray-900 (headings), Gray-600 (body), Gray-800 (info)
- **Backgrounds**: White, Gray-50, Blue-50
- **Borders**: Gray-200, Blue-200 (hover)
- **Shadows**: 2xl, xl (hover)

## Responsive Behavior
- **Mobile**: Single column layout
- **Medium+**: Two column grid
- **Hover Effects**: Scale, shadow, border color changes
- **Transitions**: 300ms for most, 500ms for accent bar

## Data Structure
```typescript
interface Hospital {
  name: string;
  address: string;
  availableAt: string;
  website: string;
  mapLink: string;
  description: string;
}
```

## Key Features to Implement
1. **Equal Height Cards**: Use `flex flex-col h-full`
2. **Hover Animations**: Scale, shadow, border changes
3. **Gradient Accents**: Bottom border animation
4. **Icon Integration**: Proper sizing and colors
5. **External Links**: Target blank, proper rel attributes
6. **Accessibility**: Proper ARIA labels and semantic HTML
7. **Responsive Grid**: Mobile-first approach
8. **Information Section**: Two-column grid with checkmarks

## Styling Classes Reference
- **Container**: `bg-white rounded-3xl shadow-2xl border border-gray-100 p-8`
- **Header**: `text-center mb-12`
- **Grid**: `grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch`
- **Card**: `group relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full`
- **Button**: `inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 shadow-lg group-hover:shadow-xl text-sm`
- **Info Section**: `mt-12 p-6 bg-blue-50 rounded-2xl`

## Implementation Notes
1. Use TypeScript for type safety
2. Make component reusable with props
3. Ensure all external links open in new tabs
4. Add proper loading states if needed
5. Implement proper error handling
6. Use semantic HTML elements
7. Ensure WCAG accessibility compliance
8. Test on multiple screen sizes
9. Optimize for performance
10. Add proper focus management for keyboard navigation
