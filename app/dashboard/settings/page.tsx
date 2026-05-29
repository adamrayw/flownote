'use client';

import { Button } from '@/components/ui/button';
import { Settings, Bell, Lock, Palette, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-lg bg-accent/10">
            <Settings className="text-accent" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-foreground/60">Manage your account and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Account Section */}
        <div className="p-6 rounded-lg border border-border bg-card/50">
          <h2 className="text-xl font-semibold text-foreground mb-4">Account</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input
                type="text"
                defaultValue="Jane Doe"
                className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                defaultValue="jane@example.com"
                className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <Button variant="outline">Update Account</Button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="p-6 rounded-lg border border-border bg-card/50">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={20} className="text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-foreground/60">Receive updates via email</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  emailNotifications ? 'bg-accent' : 'bg-foreground/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
            <div className="flex items-center justify-between border-t border-border/50 pt-4">
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-foreground/60">Get real-time updates</p>
              </div>
              <button
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  pushNotifications ? 'bg-accent' : 'bg-foreground/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    pushNotifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="p-6 rounded-lg border border-border bg-card/50">
          <div className="flex items-center gap-3 mb-4">
            <Palette size={20} className="text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-foreground/60">Use dark theme for better visibility at night</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-accent' : 'bg-foreground/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="p-6 rounded-lg border border-border bg-card/50">
          <div className="flex items-center gap-3 mb-4">
            <Lock size={20} className="text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Security</h2>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Lock size={16} className="mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Two-Factor Authentication
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-lg border border-destructive/50 bg-destructive/5">
          <h2 className="text-xl font-semibold text-destructive mb-4">Danger Zone</h2>
          <p className="text-sm text-foreground/60 mb-4">
            These actions cannot be undone. Please be careful.
          </p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
              <LogOut size={16} className="mr-2" />
              Sign Out from All Devices
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
