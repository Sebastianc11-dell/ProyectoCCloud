# PriceWatch - Price Monitoring System

A comprehensive React-based web application for monitoring product prices across the internet. Get instant alerts when prices drop, track savings, and view detailed price history charts.

## Features

- **User Authentication** - Secure login and registration with email/password
- **Product Search** - Browse and search thousands of products with advanced filtering
- **Price Tracking** - Monitor multiple products simultaneously
- **Price History** - View interactive charts showing price trends over time
- **Smart Alerts** - Configure percentage-based or target price alerts
- **Dashboard** - Overview of all tracked products and recent updates
- **User Profile** - Manage account settings and notification preferences
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite

> Note: The app runs with Vite + React Router from the `src/` folder. There is an unused Next.js scaffold under `app/` that is not part of the current build.

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd price-monitoring-system
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Start the development server
\`\`\`bash
npm run dev
\`\`\`

The application will open at `http://localhost:3000`

### Development

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
\`\`\`

## Project Structure

\`\`\`
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Modal.jsx
│   ├── Loader.jsx
│   ├── ProductCard.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── Tracking.jsx
│   ├── PriceHistory.jsx
│   ├── Alerts.jsx
│   └── Profile.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
\`\`\`

## Available Routes

| Route | Description |
|-------|-------------|
| `/login` | User login page |
| `/register` | User registration page |
| `/forgot-password` | Password recovery |
| `/dashboard` | Main dashboard (protected) |
| `/products` | Product search and browse (protected) |
| `/tracking` | View tracked products (protected) |
| `/price-history/:productId` | Price history and charts (protected) |
| `/alerts` | Manage price alerts (protected) |
| `/profile` | User profile and settings (protected) |

## API Integration

The application expects a backend API running at `http://localhost:3001`. Update the base URL in `src/services/api.js` if needed.

### Required API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/products` - Get products
- `POST /api/tracking` - Add product to tracking
- `GET /api/tracking` - Get tracked products
- `GET /api/prices/:productId` - Get price history
- `POST /api/alerts` - Create alert
- `GET /api/alerts` - Get user alerts

## Features in Detail

### Authentication
- Email and password-based authentication
- Secure token storage in localStorage
- Protected routes with automatic redirection
- Password recovery flow

### Product Management
- Advanced search with filters (category, price range, condition)
- Multiple sort options (price, rating, relevance)
- Product cards with ratings and reviews
- Quick add to tracking functionality

### Price Tracking
- Card and table view options
- Real-time price updates
- Price change indicators (up/down)
- Total savings calculation
- Days tracked counter

### Price Analytics
- Interactive area charts with Recharts
- Time range selection (7, 30, 90 days)
- Key statistics (min, max, average, variation)
- Recent price changes timeline

### Alerts System
- Percentage-based alerts (e.g., "Notify on 10% drop")
- Target price alerts (e.g., "Notify when below $1800")
- Alert history with timestamps
- Sent alerts tracking

### User Settings
- Profile information management
- Password change functionality
- Notification preferences
- Email notification controls

## Color Theme

The application uses a professional dark theme with cyan accents:
- Background: `#0f172a`
- Surface: `#1e293b`
- Primary: `#0ea5e9` (Cyan)
- Success: `#10b981` (Green)
- Danger: `#ef4444` (Red)
- Warning: `#f59e0b` (Amber)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Email notifications integration
- Price alerts via SMS
- Product reviews and ratings
- Wishlist sharing
- Multi-language support
- Dark/Light theme toggle
- Mobile app version

## License

MIT License - feel free to use this project for any purpose.

## Support

For issues or questions, please open an issue in the repository or contact the development team.
