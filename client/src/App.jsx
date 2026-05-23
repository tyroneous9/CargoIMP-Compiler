import HealthPage from './pages/HealthPage';
import HawbTablePage from './pages/HawbTablePage';
import IndexPage from './pages/IndexPage';
import MawbTablePage from './pages/MawbTablePage';
import UldTablePage from './pages/UldTablePage';

function App() {
  const path = window.location.pathname;
  const isIndexPage = path === '/' || path === '/index';
  const isHealthPage = path === '/health';
  const isHawbTablePage = path === '/hawb-table';
  const isMawbTablePage = window.location.pathname === '/mawb-table';
  const isUldTablePage = window.location.pathname === '/uld-table';

  if (isIndexPage) {
    return <IndexPage />;
  }

  if (isHealthPage) {
    return <HealthPage />;
  }

  if (isHawbTablePage) {
    return <HawbTablePage />;
  }

  if (isMawbTablePage) {
    return <MawbTablePage />;
  }

  if (isUldTablePage) {
    return <UldTablePage />;
  }

  return <IndexPage />;
}
export default App;
