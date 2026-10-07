# KASISA App

A cross-platform State Asset Maintenance application built with React, TypeScript, and Capacitor. Features web, Android, and iOS support from a single codebase.

## Overview

KASISA is a comprehensive asset management system designed for state-level infrastructure and asset tracking. It provides role-based access, detailed inspection workflows with live grading, GPS-stamped photo documentation, offline functionality, and mobile-first features.

### Key Features

- **Multi-Platform**: Web, Android, and iOS from a single codebase
- **Authentication & Authorization**: Secure login with role-based routing
- **Asset Assignment**: Manage and track asset assignments
- **Detailed Inspections**: 20-question inspection forms with live grading
- **Photo Documentation**: Capture 4+ GPS-stamped photos per inspection
- **Offline Support**: Complete offline queue with auto-sync when back online
- **PWA Support**: Install as app on web browsers
- **Scoring**: LGA (Local Government Area) scorecard system
- **Responsive UI**: Tailwind CSS for modern, responsive design

### Planned Features

- QR code scanning for quick asset lookup
- Interactive map view for asset locations
- Alert system for critical maintenance needs
- Digital certificates
- Citizen report form
- Hausa language support
- Two-factor authentication (2FA)
- Native SQLite storage for large photo batches

## Tech Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.5.0
- **Routing**: React Router DOM 6.26.0
- **Mobile Toolkit**: Capacitor 6.0.0
  - Android
  - iOS
  - Camera
  - Geolocation
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Build Tool**: Vite 5.4.0
- **Styling**: Tailwind CSS 4.0.0
- **PWA**: Vite PWA Plugin 0.20.0
- **Offline Data**: idb-keyval 6.2.1 (IndexedDB storage)
- **UI Components**: Ionic PWA Elements 3.2.2

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm
- [Supabase Account](https://supabase.com)
- Xcode (for iOS builds - requires macOS)
- Android Studio (for Android builds)

### Installation

1. **Setup Supabase Database**
   - Navigate to the `../supabase` directory
   - Follow the README to run SQL migrations and setup

2. **Configure Environment Variables**
   ```bash
   cd app
   cp .env.example .env
