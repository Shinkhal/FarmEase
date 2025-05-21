// color.js - Central location for all app color definitions

export const colors = {
  white: '#FFFFFF',
  primary: '#45484A',
  secondary: '#AEB5BB',
  gray: '#D9D9D9',
  yellow: '#FAFA33',
  green: '#cefad0',
  greentea: '#FEF6EB',
  sunflower: '#FFCE55',
  sourapple: '#DBF68F',
  jade: '#92C3A5',
  softforest: '#568366'
};

// Additional color utility functions can be added here

// Function to adjust color opacity 
export const withOpacity = (color, opacity) => {
  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  };

  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
};

// Theme presets that can be used across the app
export const themes = {
  light: {
    background: colors.greentea,
    text: colors.primary,
    accent: colors.jade,
  },
  dark: {
    background: colors.primary,
    text: colors.white,
    accent: colors.softforest,
  }
};

export default colors;