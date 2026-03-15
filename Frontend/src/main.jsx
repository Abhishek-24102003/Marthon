import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import './index.css'
import AppRouter from './router/AppRouter'
import { Provider } from 'react-redux'
import { store } from './store/store'
import Preloader from './components/Preloader' // Path to your preloader
import { ToastContainer } from 'react-toastify';
const RootApp = () => {
  const [isLoading, setIsLoading] = useState(()=>!sessionStorage.getItem("hasloaded"));

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // 3.5 seconds
    sessionStorage.setItem("hasloaded","true");
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return <AppRouter />;
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RootApp />
    <ToastContainer/>
  </Provider>
)