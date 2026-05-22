import HealthPage from './pages/HealthPage';
import UldTablePage from './pages/UldTablePage';

function App() {
  const isTestPage = window.location.pathname === '/test';

  if (isTestPage) {
    return <UldTablePage />;
  }

  return <HealthPage />;
}
export default App;
