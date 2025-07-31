import './App.css'
import 'valkoma-package/dist/style.css';

import { ThemeProvider } from 'valkoma-package/hooks'
import { ModeToggle } from 'valkoma-package/design-system'
import { Calculator } from './components/calculator';
function App() {

  return (
    <ThemeProvider>
      <div className="fixed bottom-4 left-4 z-50">
        <ModeToggle />
      </div>
      <Calculator />
    </ThemeProvider>
  )
}

export default App

