# Event Filter Widget

A lightweight, standalone JavaScript widget for filtering and searching events on any webpage. This widget is designed to work with existing event listings without requiring any framework dependencies.

## Features

- **Search Functionality**: Filter events by title
- **Month Filtering**: Filter events by month with a dropdown selector
- **Map Integration**: Click on location links to open in Google Maps or Apple Maps
- **Responsive Design**: Works on both desktop and mobile devices
- **Framework Agnostic**: Works with any existing webpage structure
- **Customizable**: Easy to style and integrate with your existing design

## Installation

1. Include the widget files in your project:
```html
<link rel="stylesheet" href="widget.css">
<script src="widget.js"></script>
```

2. Add a container element where you want the widget to appear:
```html
<div id="eventSearchContainer"></div>
```

3. Initialize the widget:
```javascript
EventFilterWidget.init({
  container: '#eventSearchContainer',
  months: ['January 2025', 'February 2025', 'March 2025'], // Optional: list of available months
  onFilter: function({search, month}) {
    // Optional: callback when filters change
    console.log('Search term:', search);
    console.log('Selected month:', month);
  }
});
```

## HTML Structure Requirements

The widget expects your events to be structured in a specific way. Each event should be wrapped in a div with the class `event-block`:

```html
<div class="event-block">
  <h4>Event Title</h4>
  <p><strong>Date: January 1, 2025</strong></p>
  <p><strong>Location: <a href="https://maps.google.com/?daddr=123+Main+St">Building Name</a></strong></p>
</div>
```

## Customization

### CSS Variables
You can customize the widget's appearance by overriding these CSS variables, here's an example:
```css
:root {
  --efw-primary: #005f73;
  --efw-secondary: #e0fbfc;
  --efw-accent: #ffb703;
  --efw-text: #22223b;
  --efw-light-grey: #f1faee;
  --efw-dark-grey: #3d5a80;
}
```

### CSS Classes
All widget classes are prefixed with `efw-` to avoid conflicts with existing styles:
- `.efw-container`: Main container
- `.efw-search-box`: Search input container
- `.efw-month-filter`: Month dropdown container
- `.efw-map-options`: Map options modal

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## License

MIT License - feel free to use this widget in your projects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 
