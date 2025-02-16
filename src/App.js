import { HashRouter } from 'react-router-dom';

import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import './locales/i18n'
// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <HashRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Router />
        </ThemeProvider>
      </HashRouter>
    </HelmetProvider>
  );
}
