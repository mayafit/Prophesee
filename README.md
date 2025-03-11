# Prophesee - SAR Imagery Analysis Platform

A web-based situational awareness platform for visualizing Synthetic Aperture Radar (SAR) imagery on interactive geospatial maps. This platform provides advanced terrain and imagery analysis capabilities using Cesium.js for 3D visualization.

## Features

- Interactive 3D geospatial visualization powered by Cesium.js
- NaturalEarthII base layer integration
- SAR imagery overlay and analysis tools
- Temporal and spatial query capabilities
- Modern React-based user interface

## Technology Stack

- Frontend:
  - React with TypeScript
  - Cesium.js for 3D mapping
  - Material-UI and Shadcn UI components
  - TanStack Query for data fetching
  - Wouter for routing

- Backend:
  - Express.js server
  - PostgreSQL database with Drizzle ORM
  - RESTful API architecture

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Access the application:
- Open http://localhost:5000 in your browser

## Project Structure

```
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable React components
│   │   ├── pages/      # Page components
│   │   └── lib/        # Utility functions and configurations
├── server/             # Backend Express server
│   ├── routes.ts       # API route definitions
│   └── storage.ts      # Data storage interface
└── shared/             # Shared types and schemas
    └── schema.ts       # Database and API schemas
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License
