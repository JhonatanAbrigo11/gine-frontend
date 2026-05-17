import { useState, useEffect, useCallback } from 'react';
import { api } from '@/shared/api/base';

export interface BusinessSettings {
  id: string;
  clinicName: string | null;
  taxId: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logoUrl: string | null;
  reportHeader: string | null;
  reportFooter: string | null;
  billingSeries: string | null;
  billingNextNumber: number;
  currency: string;
}

export function useBusinessSettings() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings');
      setSettings(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error loading business settings');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = async (data: Partial<BusinessSettings>) => {
    try {
      const response = await api.post('/settings', data);
      setSettings(response.data);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Error updating settings');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refresh: fetchSettings
  };
}
