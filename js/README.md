# IoT Ultrasonic Dashboard - Frontend Modular Architecture

## 📁 Project Structure

```
public/
├── js/
│   ├── app.js                 # Main application entry point
│   ├── script.js             # Legacy monolithic script (backup)
│   └── modules/
│       ├── config.js         # Configuration constants
│       ├── utils.js          # Utility functions
│       ├── api.js            # API communication layer
│       ├── auth.js           # Authentication module
│       ├── distance.js       # Distance sensor data handling
│       ├── control.js        # Device control functionality
│       ├── logs.js           # User logs management
│       ├── chart.js          # Chart.js wrapper and management
│       └── realtime.js       # Real-time data refresh system
├── style/
│   └── style.css            # Styling
├── index.html               # Login page
├── dashboard1.html          # Distance sensor 1 dashboard
├── dashboard2.html          # Distance sensor 2 dashboard
└── super.html              # Super admin dashboard
```

## 🧩 Module Overview

### 📋 **config.js**

- Contains all configuration constants
- API URLs, refresh intervals, chart settings
- Centralized configuration management

### 🔧 **utils.js**

- Reusable utility functions
- Message display, loading states, formatting
- Page type detection and common helpers

### 🌐 **api.js**

- Centralized API communication
- Base request handler with authentication
- Consistent error handling and token management

### 🔐 **auth.js**

- User authentication and authorization
- Login/logout functionality
- Session management and role-based routing

### 📏 **distance.js**

- Distance sensor data display
- Table rendering and data formatting
- Error handling for sensor data

### 🎛️ **control.js**

- Device control functionality (TV switch)
- Control state loading and updating
- Real-time control feedback

### 📝 **logs.js**

- User activity logs management
- Log display and refresh functionality
- Manual refresh with visual feedback

### 📊 **chart.js**

- Chart.js integration and management
- Chart instance lifecycle management
- Real-time chart updates and configuration

### ⚡ **realtime.js**

- Automatic data refresh system
- Page-specific refresh intervals
- Performance optimization with visibility handling

### 🚀 **app.js**

- Main application orchestrator
- Module coordination and global function exposure
- Application lifecycle management

## 🔄 Migration from Monolithic Script

The original `script.js` has been refactored into modular components:

### Before (Monolithic):

```javascript
// All functions in one large file
const ip = "192.168.1.12";
async function login() {
  /* ... */
}
async function loadDistance() {
  /* ... */
}
// ... 500+ lines of mixed concerns
```

### After (Modular):

```javascript
// config.js
export const CONFIG = { IP: "192.168.1.12", ... };

// auth.js
export async function login() { /* ... */ }

// distance.js
export async function loadDistance() { /* ... */ }

// app.js - orchestrates everything
import { login } from './modules/auth.js';
// ...
```

## 🎯 Benefits of Modular Architecture

### ✅ **Maintainability**

- **Single Responsibility**: Each module handles one specific concern
- **Easy Updates**: Changes isolated to relevant modules
- **Clear Dependencies**: Explicit imports show module relationships

### ✅ **Scalability**

- **Easy Extension**: Add new modules without affecting existing code
- **Team Development**: Multiple developers can work on different modules
- **Feature Isolation**: New features can be developed independently

### ✅ **Testing**

- **Unit Testing**: Each module can be tested independently
- **Mock Dependencies**: Easy to mock API calls and dependencies
- **Isolated Testing**: Test specific functionality without side effects

### ✅ **Performance**

- **Tree Shaking**: Unused code can be eliminated
- **Lazy Loading**: Modules can be loaded on demand
- **Caching**: Browser can cache individual modules

### ✅ **Code Reusability**

- **Shared Utilities**: Common functions available across modules
- **Consistent Patterns**: Standardized approaches to common tasks
- **DRY Principle**: Eliminate code duplication

## 🚀 Usage Examples

### Basic Usage (HTML onclick handlers still work):

```html
<button onclick="login(event)">Login</button>
<button onclick="refreshUserLogs()">Refresh</button>
```

### Advanced Usage (Module imports):

```javascript
// Import specific functionality
import { API } from "./modules/api.js";
import { showMessage } from "./modules/utils.js";

// Use in custom code
const data = await API.getDistanceData("1");
showMessage("Data loaded successfully!", "success");
```

### Application Management:

```javascript
// Access application instance
const app = window.IoTApp;
console.log(app.getConfig());

// Access individual modules
const { auth, distance } = window.IoTModules;
await auth.login(username, password);
await distance.loadDistance("1");
```

## 🔧 Development Guidelines

### Adding New Modules:

1. Create module in `/modules/` directory
2. Export functions using ES6 export syntax
3. Import dependencies from other modules
4. Add to `app.js` imports and global exports if needed

### Module Dependencies:

- **config.js**: No dependencies (base layer)
- **utils.js**: No dependencies (utility layer)
- **api.js**: Depends on config.js
- **auth.js**: Depends on api.js, utils.js
- **Other modules**: Can depend on any lower-level modules

### Best Practices:

- Keep modules focused on single responsibility
- Use explicit imports/exports
- Handle errors gracefully
- Document public APIs
- Maintain backward compatibility

## 🔄 Backward Compatibility

The modular refactor maintains full backward compatibility:

- All HTML onclick handlers continue to work
- Global functions still available on window object
- Same API signatures and behavior
- No changes required to existing HTML files

## 📈 Performance Considerations

- **Real-time Updates**: Optimized intervals and efficient chart updates
- **Memory Management**: Proper cleanup of chart instances and intervals
- **Network Efficiency**: Centralized API layer with consistent error handling
- **Resource Management**: Pause updates when page is not visible

This modular architecture provides a solid foundation for future development while maintaining the existing functionality and user experience.
