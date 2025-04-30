import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/ToggleThemeButton.css'; // 👈 new CSS file you'll create

const ToggleThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle-btn fixed" onClick={toggleTheme}>
    {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
};

export default ToggleThemeButton;