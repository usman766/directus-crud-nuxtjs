# User Profile CRUD System

A complete User Profile CRUD frontend built with **Nuxt.js 3**, **Element Plus**, and **Directus REST API** integration.

## 🚀 Features

### ✅ Core Functionality
- **Authentication System**: Login with Directus email/password
- **JWT Token Management**: Secure token storage with Pinia
- **Role-based Access Control**: Admin vs Regular user permissions
- **Complete CRUD Operations**: Create, Read, Update, Delete profiles

### 🎨 UI/UX Features
- **Modern Design**: Clean, responsive interface with Element Plus
- **Avatar Upload**: Image upload with preview and validation
- **Search & Filter**: Real-time search and role-based filtering
- **Responsive Layout**: Mobile-friendly design
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: Comprehensive error messages and validation

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Composition API**: Modern Vue 3 syntax with script setup
- **Auto-imports**: Automatic component and composable imports
- **Middleware**: Route protection and authentication guards
- **File Upload**: Directus file management integration

## 📋 Prerequisites

- Node.js 18+ 
- Directus instance running
- Directus collection for profiles

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd user-crud-nuxt
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the root directory:
```env
DIRECTUS_URL=http://localhost:8055
DIRECTUS_PROJECT_ID=your-project-id
```

4. **Directus Setup**
Ensure your Directus instance has a `profiles` collection with the following fields:
- `id` (Primary Key)
- `name` (String, Required)
- `email` (String, Required, Unique)
- `phone` (String, Optional)
- `bio` (Text, Optional)
- `avatar` (File, Optional)
- `role` (String, Optional)
- `created_at` (DateTime, Auto)
- `updated_at` (DateTime, Auto)

5. **Run the development server**
```bash
npm run dev
```

## 🏗️ Project Structure

```
user-crud-nuxt/
├── components/          # Reusable Vue components
├── composables/         # Vue composables (useDirectusApi)
├── layouts/            # Nuxt layouts
├── middleware/         # Route middleware (auth, guest)
├── pages/              # Application pages
│   ├── login.vue       # Login page
│   ├── profiles/       # Profile management
│   │   ├── index.vue   # Profile list
│   │   ├── create.vue  # Create profile
│   │   └── [id]/       # Dynamic routes
│   │       ├── index.vue  # View profile
│   │       └── edit.vue   # Edit profile
├── plugins/            # Nuxt plugins (Element Plus)
├── stores/             # Pinia stores (auth)
├── types/              # TypeScript interfaces
└── nuxt.config.ts      # Nuxt configuration
```

## 🔑 Authentication

### Login Credentials
The system includes demo credentials for testing:

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

**Regular User:**
- Email: `user@example.com`
- Password: `user123`

### Role-based Permissions
- **Admin Users**: Can create, edit, and delete profiles
- **Regular Users**: Can only view profiles

## 📱 Pages & Routes

### Public Routes
- `/login` - Authentication page

### Protected Routes
- `/` - Redirects based on auth status
- `/profiles` - Profile list with search and filters
- `/profiles/create` - Create new profile (Admin only)
- `/profiles/[id]` - View profile details
- `/profiles/[id]/edit` - Edit profile (Admin only)

## 🎯 Key Components

### 1. Directus API Composable (`composables/useDirectusApi.ts`)
```typescript
// Authentication
const { login, logout, getCurrentUser, isAuthenticated, isAdmin } = useDirectusApi()

// Profile CRUD
const { getProfiles, getProfile, createProfile, updateProfile, deleteProfile } = useDirectusApi()

// File operations
const { uploadFile } = useDirectusApi()
```

### 2. Auth Store (`stores/auth.ts`)
```typescript
const authStore = useAuthStore()

// State
authStore.user
authStore.isAuthenticated
authStore.isLoading
authStore.error

// Actions
await authStore.login(credentials)
authStore.logout()
await authStore.checkAuth()
```

### 3. TypeScript Interfaces (`types/index.ts`)
```typescript
interface UserProfile {
  id?: string
  name: string
  email: string
  phone?: string
  bio?: string
  avatar?: string
  role?: string
  created_at?: string
  updated_at?: string
}
```

## 🔧 Configuration

### Nuxt Configuration (`nuxt.config.ts`)
- Element Plus integration
- Pinia state management
- Auto-imports for composables and stores
- Environment variables
- Build optimizations

### Environment Variables
- `DIRECTUS_URL`: Your Directus instance URL
- `DIRECTUS_PROJECT_ID`: Your Directus project ID

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Generate Static Site
```bash
npm run generate
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality
- [ ] View profile list
- [ ] Search and filter profiles
- [ ] Create new profile (Admin)
- [ ] Edit existing profile (Admin)
- [ ] Delete profile (Admin)
- [ ] Upload avatar image
- [ ] Role-based access control
- [ ] Responsive design on mobile

## 🐛 Troubleshooting

### Common Issues

1. **Element Plus not loading**
   - Ensure the plugin is properly configured
   - Check if CSS is imported correctly

2. **Authentication not working**
   - Verify Directus URL and project ID
   - Check browser console for API errors
   - Ensure CORS is configured in Directus

3. **File upload failing**
   - Verify file size limits
   - Check Directus file permissions
   - Ensure proper authentication

4. **TypeScript errors**
   - Run `npm install` to ensure all dependencies
   - Check type definitions in `types/` directory

## 📚 API Reference

### Directus Endpoints Used
- `POST /auth/login` - User authentication
- `GET /users/me` - Get current user
- `GET /items/profiles` - List profiles
- `GET /items/profiles/[id]` - Get single profile
- `POST /items/profiles` - Create profile
- `PATCH /items/profiles/[id]` - Update profile
- `DELETE /items/profiles/[id]` - Delete profile
- `POST /files` - Upload file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Interview Assignment Notes

This project demonstrates:

### ✅ Technical Skills
- **Modern Vue 3/Nuxt 3** with Composition API
- **TypeScript** implementation throughout
- **State Management** with Pinia
- **UI Framework** integration (Element Plus)
- **API Integration** with Directus REST API
- **Authentication** and authorization
- **File Upload** functionality
- **Responsive Design** principles

### ✅ Architecture & Best Practices
- **Modular Structure** with clear separation of concerns
- **Reusable Components** and composables
- **Type Safety** with comprehensive interfaces
- **Error Handling** and user feedback
- **Performance Optimization** with auto-imports
- **Security** with JWT token management
- **Accessibility** considerations

### ✅ Development Workflow
- **Rapid Development** with modern tooling
- **Clean Code** with proper documentation
- **Scalable Architecture** for future enhancements
- **Testing Strategy** with manual testing checklist

This project showcases the ability to deliver a production-ready, full-stack application with modern technologies and best practices.
