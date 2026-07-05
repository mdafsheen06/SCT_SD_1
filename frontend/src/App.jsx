import ThemeToggle from './components/ThemeToggle';
import ConverterForm from './components/ConverterForm';

function App() {
  return (
    <div className="app-container">
      <ThemeToggle />
      <div className="converter-card">
        <h1>Temperature Converter</h1>
        <ConverterForm />
      </div>
    </div>
  );
}

export default App;
