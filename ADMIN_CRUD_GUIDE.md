# Admin CRUD Operations Guide

## 🎯 Overview

This guide explains how to test and verify that admin users can perform full CRUD (Create, Read, Update, Delete) operations on user profiles through the Directus API.

## 🔑 Admin Authentication

### 1. Login as Admin
Use these credentials to login as an admin:
```
Email: admin@example.com
Password: admin123
```

### 2. Verify Admin Status
After login, you should see:
- Admin actions (Create, Edit, Delete buttons) are visible
- Role-based permissions are enforced
- Full CRUD access is granted

## 🧪 Testing Admin CRUD Operations

### Method 1: Using the Admin Test Page

1. **Navigate to Admin Test Page**
   ```
   http://localhost:3000/admin-test
   ```

2. **Test Each CRUD Operation**
   - **GET Profiles**: Test reading all profiles
   - **CREATE Profile**: Test creating a new profile
   - **UPDATE Profile**: Test updating an existing profile
   - **DELETE Profile**: Test deleting a profile

3. **Check Results**
   - Each test shows detailed results
   - Success/error messages are displayed
   - API responses are logged

### Method 2: Using the Main Application

#### 1. Create Profile (Admin Only)
1. Login as admin
2. Go to `/profiles`
3. Click "Add Profile" button
4. Fill in the form:
   ```
   Name: John Doe
   Email: john@example.com
   Phone: +1234567890
   Bio: Software Developer
   Role: User
   ```
5. Upload an avatar (optional)
6. Click "Create Profile"

#### 2. View Profile
1. Go to `/profiles`
2. Click "View" on any profile
3. Verify all profile details are displayed

#### 3. Edit Profile (Admin Only)
1. Go to `/profiles`
2. Click "Edit" on any profile
3. Modify the profile data
4. Click "Update Profile"

#### 4. Delete Profile (Admin Only)
1. Go to `/profiles`
2. Click "Delete" on any profile
3. Confirm deletion in the dialog

## 🔧 API Endpoints Used

### Authentication
```
POST /auth/login
GET /users/me
```

### Profile CRUD
```
GET /items/profiles          # List all profiles
GET /items/profiles/{id}     # Get single profile
POST /items/profiles         # Create profile
PATCH /items/profiles/{id}   # Update profile
DELETE /items/profiles/{id}  # Delete profile
```

### File Upload
```
POST /files                  # Upload avatar
```

## 🛠️ Troubleshooting

### Issue: Admin Role Not Detected
**Symptoms:**
- Admin buttons not visible
- CRUD operations fail
- "Permission denied" errors

**Solutions:**
1. Check Directus user role configuration
2. Verify role name is "Administrator"
3. Check token is valid
4. Clear browser storage and re-login

### Issue: API Calls Failing
**Symptoms:**
- Network errors
- 401/403 status codes
- CORS errors

**Solutions:**
1. Verify Directus URL is correct
2. Check CORS configuration in Directus
3. Ensure authentication token is valid
4. Verify collection permissions

### Issue: Role-Based Access Not Working
**Symptoms:**
- Regular users can see admin actions
- Admin users can't perform actions

**Solutions:**
1. Check role detection logic
2. Verify user role structure
3. Test with different user accounts
4. Check middleware configuration

## 📋 Testing Checklist

### ✅ Authentication
- [ ] Admin can login successfully
- [ ] Admin role is detected correctly
- [ ] Token is stored securely
- [ ] Logout clears all data

### ✅ Read Operations
- [ ] Admin can view profile list
- [ ] Admin can view individual profiles
- [ ] Search and filter work correctly
- [ ] Pagination works (if implemented)

### ✅ Create Operations
- [ ] Admin can access create form
- [ ] Form validation works
- [ ] Avatar upload works
- [ ] Profile is created successfully
- [ ] Success message is shown

### ✅ Update Operations
- [ ] Admin can access edit form
- [ ] Existing data is loaded
- [ ] Changes are saved correctly
- [ ] Avatar can be updated
- [ ] Success message is shown

### ✅ Delete Operations
- [ ] Admin can initiate delete
- [ ] Confirmation dialog appears
- [ ] Profile is deleted successfully
- [ ] Success message is shown

### ✅ Security
- [ ] Regular users cannot access admin actions
- [ ] API calls include authentication headers
- [ ] Role-based UI elements are hidden/shown correctly
- [ ] Unauthorized actions are blocked

## 🎯 Expected Behavior

### Admin User Experience
1. **Login**: Success with admin privileges
2. **Dashboard**: All CRUD buttons visible
3. **Create**: Full form access with validation
4. **Read**: View all profiles with details
5. **Update**: Edit any profile with full access
6. **Delete**: Remove any profile with confirmation

### Regular User Experience
1. **Login**: Success with user privileges
2. **Dashboard**: Only view buttons visible
3. **Create**: Access denied
4. **Read**: View all profiles (read-only)
5. **Update**: Access denied
6. **Delete**: Access denied

## 🔍 Debug Information

### Check User Role
```javascript
// In browser console
const authStore = useAuthStore()
console.log('User:', authStore.user)
console.log('Is Admin:', authStore.isAdmin)
console.log('Is Authenticated:', authStore.isAuthenticated)
```

### Check API Token
```javascript
// In browser console
console.log('Token:', localStorage.getItem('directus_token'))
```

### Test API Call
```javascript
// In browser console
const { getProfiles } = useDirectusApi()
getProfiles().then(response => {
  console.log('Profiles:', response)
}).catch(error => {
  console.error('Error:', error)
})
```

## 🚀 Production Considerations

1. **Security**: Implement proper token refresh
2. **Error Handling**: Add comprehensive error logging
3. **Validation**: Server-side validation for all operations
4. **Audit Trail**: Log all admin actions
5. **Rate Limiting**: Prevent abuse of CRUD operations
6. **Backup**: Regular backups of profile data

This guide ensures that admin CRUD operations are working correctly and provides troubleshooting steps for common issues. 