import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const Settings: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAllData = () => {
    // Clear all data from localStorage
    localStorage.removeItem('subtrack_subscriptions');
    localStorage.removeItem('subtrack_loans');
    setShowDeleteConfirm(false);

    // Reload the page to reflect changes
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your application preferences
        </p>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Appearance
          </h2>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Dark Mode
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Switch between light and dark theme
              </p>
            </div>

            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={isDarkMode}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Data Management
          </h2>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-red-900 dark:text-red-300 mb-1">
                  Delete All Data
                </h3>
                <p className="text-sm text-red-700 dark:text-red-400 mb-3">
                  Permanently delete all subscriptions and loans. This action cannot be undone.
                </p>

                {showDeleteConfirm ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-red-900 dark:text-red-300">
                      ⚠️ Are you absolutely sure? This will delete all your data permanently!
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDeleteAllData}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        Yes, Delete Everything
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Delete All Data
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
