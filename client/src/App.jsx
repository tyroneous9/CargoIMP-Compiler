import EmailXxxTablePage from './pages/EmailXxxTablePage';
import HawbTablePage from './pages/HawbTablePage';
import IndexPage from './pages/IndexPage';
import MawbTablePage from './pages/MawbTablePage';
import NewMessagesPage from './pages/NewMessagesPage';
import NotFoundPage from './pages/NotFoundPage';
import OfficeOperationPage from './pages/OfficeOperationPage';
import ParseErrorsPage from './pages/ParseErrorsPage';
import UldTablePage from './pages/UldTablePage';

function App() {
  const path = window.location.pathname;
  const isEmailXxxTablePage = path === '/email-xxx-table';
  const isIndexPage = path === '/' || path === '/index';
  const isHawbTablePage = path === '/hawb-table';
  const isMawbTablePage = window.location.pathname === '/mawb-table';
  const isNewMessagesPage = path === '/new-messages';
  const isOfficeOperationPage = path === '/office-operation';
  const isParseErrorsPage = path === '/parse-errors';
  const isUldTablePage = window.location.pathname === '/uld-table';

  if (isIndexPage) {
    return <IndexPage />;
  }

  if (isNewMessagesPage) {
    return <NewMessagesPage />;
  }

  if (isParseErrorsPage) {
    return <ParseErrorsPage />;
  }

  if (isEmailXxxTablePage) {
    return <EmailXxxTablePage />;
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

  if (isOfficeOperationPage) {
    return <OfficeOperationPage />;
  }

  return <NotFoundPage />;
}
export default App;
