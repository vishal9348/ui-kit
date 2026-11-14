# Angular UI Kit

A reusable Angular component library built with standalone components, Angular CDK and TypeScript.

## Requirements

- Node.js 22+
- Angular 22+
- Angular CDK 22+

## Installation

```bash
npm install @vishal_team/angular-ui-kit
```

## Global Styles

Add the following import to your application's `src/styles.css`:

```css
@import '@vishal_team/angular-ui-kit/styles/global.css';
```

This stylesheet includes:
- Angular CDK overlay styles
- UI Kit global styles
- Default design tokens
- Theme variables

## Usage

Import the standalone component into your Angular component.

Example:

```typescript
import { Component } from '@angular/core';
import { UiButtonComponent } from '@vishal_team/angular-ui-kit';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UiButtonComponent],
  template: `
    <ui-button>Click me</ui-button>
  `
})
export class AppComponent {}
```

## Available Components

- Button
- Dropdown
- Checkbox
- Radio Group
- Dialog
- Loader
- Progress Bar
- Breadcrumb
- Toast
- Input
- Textarea
- Switch
- Data Table
- Date Picker
- Tabs
- Tooltip
- Ellipsis
- Avatar
- Badge
- Accordion
- Select
- File Upload
- Stepper
- Tree View
- Chip

## Theming

The library provides CSS custom properties for colors, surfaces, borders, focus rings and border radius.

Use the `data-ui-theme="dark"` attribute to activate the provided dark theme variables.

```html
<div data-ui-theme="dark">
  <!-- UI Kit components -->
</div>
```

## Development

Build the library:

```bash
npx ng build ui-kit --configuration production
```

The distributable package is generated in:

```text
dist/ui-kit
```

## License

MIT