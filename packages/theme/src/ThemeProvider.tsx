import React, { useMemo } from "react";
import { darkThemeVars } from "./themes/dark";
import { lightThemeVars } from "./themes/light";
import "./global.css";

export type Theme = "dark" | "light" | "custom";

export interface ThemeProviderProps {
  theme?: Theme;
  overrides?: Record<string, string>;
  children: React.ReactNode;
  className?: string;
}

export function ThemeProvider({ 
  theme = "dark", 
  overrides, 
  children,
  className 
}: ThemeProviderProps) {
  
  const styleVars = useMemo(() => {
    let base = darkThemeVars;
    if (theme === "light") {
      base = lightThemeVars;
    }
    
    return {
      ...base,
      ...overrides,
    } as React.CSSProperties;
  }, [theme, overrides]);

  return (
    <div 
      className={`vi-theme-root ${className || ""}`} 
      style={styleVars}
      data-theme={theme}
    >
      {/* Import default fonts if not provided by host application */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />
      
      {children}
    </div>
  );
}
