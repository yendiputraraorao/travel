'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';
import { AppSetting, AppSettingCategory } from '@/lib/types';

interface SettingsContextType {
  settings: Record<string, AppSettingCategory>;
  loading: boolean;
  error: string | null;
  getSetting: (category: string, key: string) => string | number | boolean | null;
  getSettingValue: (category: string, key: string) => string | number | boolean | null;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, AppSettingCategory>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSettings();
      setSettings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal memuat pengaturan';
      setError(message);
      console.error('Settings fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getSetting = (category: string, key: string): string | number | boolean | null => {
    return settings[category]?.[key] ?? null;
  };

  const getSettingValue = (category: string, key: string): string | number | boolean | null => {
    const value = settings[category]?.[key];
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') {
      if (value === 'true') return true;
      if (value === 'false') return false;
      if (!isNaN(Number(value)) && value !== '') return Number(value);
    }
    return value;
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      loading,
      error,
      getSetting,
      getSettingValue,
      refreshSettings: fetchSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export function useSetting(category: string, key: string) {
  const { getSetting, loading } = useSettings();
  const value = getSetting(category, key);
  return { value, loading };
}