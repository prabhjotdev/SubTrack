# Firebase Setup Guide for SubTrack

This guide will walk you through setting up Firebase for SubTrack to enable cross-device data synchronization.

## Prerequisites

- A Google account
- Node.js installed on your machine
- SubTrack project cloned locally

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "SubTrack")
4. (Optional) Enable Google Analytics if you want usage analytics
5. Click **"Create project"** and wait for it to be created

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (</>) to add a web app
2. Register your app with a nickname (e.g., "SubTrack Web")
3. **Do NOT** check "Also set up Firebase Hosting" (unless you want to use it)
4. Click **"Register app"**
5. You'll see your Firebase configuration object - **keep this page open**, you'll need these values!

## Step 3: Enable Authentication

1. In the Firebase Console, go to **Build → Authentication**
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle **"Enable"** to ON
   - Click **"Save"**
5. Enable **Anonymous**:
   - Click on "Anonymous"
   - Toggle **"Enable"** to ON
   - Click **"Save"**

## Step 4: Enable Firestore Database

1. In the Firebase Console, go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll deploy custom rules next)
4. Select your preferred location (choose closest to your users)
5. Click **"Enable"**

## Step 5: Deploy Firestore Security Rules

### Option A: Using Firebase CLI (Recommended)

1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select **Firestore** (use spacebar to select, enter to confirm)
   - Choose **"Use an existing project"** and select your SubTrack project
   - Accept the default file names:
     - `firestore.rules` for rules
     - `firestore.indexes.json` for indexes
   - **Note:** The files already exist in the project, so you can overwrite or keep them

4. Deploy the rules and indexes:
   ```bash
   firebase deploy --only firestore
   ```

### Option B: Manual Setup via Console

1. In Firebase Console, go to **Firestore Database → Rules**
2. Copy the contents of `firestore.rules` from this project
3. Paste into the Rules editor
4. Click **"Publish"**

5. For indexes:
   - Go to **Firestore Database → Indexes**
   - Click **"Add index"**
   - Create two compound indexes:

   **Index 1 (Subscriptions):**
   - Collection ID: `subscriptions`
   - Fields to index:
     - `userId` (Ascending)
     - `renewalDate` (Ascending)
   - Query scope: Collection

   **Index 2 (Loans):**
   - Collection ID: `loans`
   - Fields to index:
     - `userId` (Ascending)
     - `paymentDate` (Ascending)
   - Query scope: Collection

## Step 6: Configure Environment Variables

1. In your project root, create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Go back to your Firebase project settings:
   - Click the **gear icon** ⚙️ next to "Project Overview"
   - Select **"Project settings"**
   - Scroll down to **"Your apps"** section
   - You'll see your web app with the configuration

3. Copy the Firebase configuration values into your `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

   Example:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
   VITE_FIREBASE_AUTH_DOMAIN=subtrack-12345.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=subtrack-12345
   VITE_FIREBASE_STORAGE_BUCKET=subtrack-12345.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   ```

4. **Important:** Never commit the `.env` file to Git! It's already in `.gitignore`.

## Step 7: Run the Application

1. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the URL shown (usually `http://localhost:5173`)

4. You should see the login/signup page!

## Step 8: Test the Setup

1. **Create an account:**
   - Click "Don't have an account? Sign up"
   - Enter an email and password (min 6 characters)
   - Click "Create Account"

2. **Add some data:**
   - Add a subscription or loan
   - Go to Settings and check your account info

3. **Test cross-device sync:**
   - Open the app in a different browser or incognito window
   - Log in with the same account
   - You should see the same data!

4. **Test anonymous mode:**
   - Log out
   - Click "Continue Without Account"
   - Add some data
   - The data will sync across devices even without an account!

## Data Migration

**Good news!** If you were using SubTrack before Firebase (with localStorage), your existing data will automatically migrate to Firebase when you first log in!

The migration happens once per account and includes:
- All subscriptions
- All loans

After migration, your data will be synced across all devices where you're logged in.

## Troubleshooting

### "Missing or insufficient permissions" error
- Check that you deployed the Firestore security rules correctly
- Verify you're logged in to the app
- Make sure the rules were published

### "Failed to get document because the client is offline" error
- Check your internet connection
- Make sure Firestore is enabled in your Firebase project
- Verify your Firebase configuration in `.env` is correct

### Environment variables not loading
- Make sure your `.env` file is in the project root (same level as `package.json`)
- Restart your development server after changing `.env`
- All Vite env vars must start with `VITE_`

### Indexes not working / "The query requires an index" error
- Deploy the indexes using Firebase CLI: `firebase deploy --only firestore:indexes`
- Or create them manually in the Firebase Console
- Wait a few minutes for indexes to build (check status in Console)

### Authentication not working
- Verify Email/Password and Anonymous auth are enabled in Firebase Console
- Check the Firebase Auth configuration in your project settings
- Make sure your API key is correct in `.env`

## Deployment to Production

When deploying to a hosting service (Vercel, Netlify, etc.):

1. **Add environment variables** to your hosting platform:
   - All the `VITE_FIREBASE_*` variables from your `.env` file
   - Most platforms have an "Environment Variables" section in settings

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy the `dist` folder** (hosting platform specific)

## Firebase Free Tier Limits

Your SubTrack app is well within the free tier:

- **Firestore:**
  - 1 GB storage ✅
  - 50,000 reads/day ✅
  - 20,000 writes/day ✅
  - 20,000 deletes/day ✅

- **Authentication:**
  - 10,000 phone auth/day (not using)
  - Unlimited email/password
  - Unlimited anonymous auth

You won't need to upgrade unless you have thousands of users!

## Security Notes

- ✅ **API Key is public:** It's safe to include in your frontend code
- ✅ **Security Rules protect your data:** Only users can access their own data
- ✅ **Anonymous users get unique IDs:** Their data is still private
- ❌ **Never commit `.env` to Git:** Keep your configuration secure

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth/web/start)

Happy tracking! 🎉
