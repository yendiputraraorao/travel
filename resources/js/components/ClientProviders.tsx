'use client';

import React, { ReactNode } from 'react';
import { SettingsProvider } from '@/context/SettingsContext';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      {children}
    </SettingsProvider>
  );
}