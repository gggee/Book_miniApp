import React, { createContext, useState, useContext } from 'react';
const ThemeContext = createContext();

const themes = {
  light: {
    background: '#f0f0f0',
    text: '#333',
    cardBackground: '#ffffff',
    footerBackground: '#a9a59c',
    shadowColor: '#ddd',
    headerBackground: '#fff',
    headerText: '#333',
  },
  dark: {
    background: '#1e1e1e',
    text: '#f0f0f0',
    cardBackground: '#2c2c2c',
    footerBackground: '#3a3a3a',
    shadowColor: '#000',
    headerBackground: '#333',
    headerText: '#f0f0f0',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, styles: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
