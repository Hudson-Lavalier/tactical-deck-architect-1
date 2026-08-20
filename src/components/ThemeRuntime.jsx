import React, { useEffect } from 'react';
import { applyTheme, getTheme } from '@/lib/theme';

export default function ThemeRuntime() {
  useEffect(() => { applyTheme(getTheme()); }, []);
  return null;
}