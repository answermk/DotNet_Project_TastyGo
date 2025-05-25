import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Sun, Bell, Globe, Lock, Shield } from 'lucide-react';

const UserPreferences: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage } = useTheme();
  const { user, updateProfile } = useAuth();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'en' | 'fr' | 'rw');
  };

  const handleNotificationPreferenceChange = async (key: string, value: boolean) => {
    if (!user) return;
    
    try {
      await updateProfile({
        notificationPreferences: {
          ...user.notificationPreferences,
          [key]: value,
        },
      });
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">User Preferences</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            {theme === 'dark' ? (
              <Moon className="h-6 w-6 text-gray-600 dark:text-gray-300 mr-3" />
            ) : (
              <Sun className="h-6 w-6 text-gray-600 dark:text-gray-300 mr-3" />
            )}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Theme Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  theme === 'dark' ? 'bg-orange-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-6 w-6 text-gray-600 dark:text-gray-300 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Language Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Preferred Language
              </label>
              <select
                id="language"
                value={language}
                onChange={handleLanguageChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="rw">Kinyarwanda</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
              <button
                onClick={() => handleNotificationPreferenceChange('email', !user?.notificationPreferences?.email)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  user?.notificationPreferences?.email ? 'bg-orange-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    user?.notificationPreferences?.email ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
              <button
                onClick={() => handleNotificationPreferenceChange('push', !user?.notificationPreferences?.push)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  user?.notificationPreferences?.push ? 'bg-orange-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    user?.notificationPreferences?.push ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-gray-600 dark:text-gray-300 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
              <button
                onClick={() => handleNotificationPreferenceChange('mfa', !user?.notificationPreferences?.mfa)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  user?.notificationPreferences?.mfa ? 'bg-orange-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    user?.notificationPreferences?.mfa ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <button
              onClick={() => {/* Implement password change */}}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences; 