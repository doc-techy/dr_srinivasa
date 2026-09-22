'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, User, Shield, Bell, Database } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <p className="text-sm text-gray-900">{user?.first_name} {user?.last_name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-sm text-gray-900">{user?.email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <p className="text-sm text-gray-900">{user?.username}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <p className="text-sm text-gray-900">
                {user?.is_superuser ? 'Super Admin' : user?.is_staff ? 'Admin' : 'User'}
              </p>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-800">JWT Authentication</p>
                <p className="text-xs text-green-600">Secure token-based authentication enabled</p>
              </div>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-800">Admin Access</p>
                <p className="text-xs text-green-600">Full administrative privileges granted</p>
              </div>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-6 w-6 text-yellow-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive notifications for new appointments</p>
              </div>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Status Updates</p>
                <p className="text-xs text-gray-500">Get notified when appointment status changes</p>
              </div>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-6 w-6 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">System Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Version</label>
              <p className="text-sm text-gray-900">v1.0.0</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backend Status</label>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-green-600">Connected</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Database</label>
              <p className="text-sm text-gray-900">PostgreSQL</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="text-sm font-medium text-gray-900">Export Data</div>
            <div className="text-xs text-gray-500">Download appointment data</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="text-sm font-medium text-gray-900">Backup System</div>
            <div className="text-xs text-gray-500">Create system backup</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="text-sm font-medium text-gray-900">View Logs</div>
            <div className="text-xs text-gray-500">System activity logs</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="text-sm font-medium text-gray-900">System Health</div>
            <div className="text-xs text-gray-500">Check system status</div>
          </button>
        </div>
      </div>
    </div>
  );
}
