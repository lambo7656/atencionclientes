import { useState } from 'react';
import './index.css';
import { flowData } from './Flow';
import type { FlowState, Option } from './Flow';

function App() {
  const [currentState, setCurrentState] = useState<string>('START_MENU');
  const [history, setHistory] = useState<{ stateId: string, question: string, answer: string }[]>([]);

  const node = flowData[currentState as keyof typeof flowData] as FlowState;

  const handleOptionClick = (next: string | null, answerLabel: string) => {
    if (!node.isResult) {
      setHistory([...history, { stateId: currentState, question: node.question || '', answer: answerLabel }]);
    }
    if (next) {
      setCurrentState(next);
    }
  };

  const resetFlow = () => {
    setCurrentState('START_MENU');
    setHistory([]);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setCurrentState(previous.stateId);
    setHistory(history.slice(0, -1));
  };

  return (
    <div className="app-container">
      <div className="wizard-card">
        <h1 className="wizard-header">📞 Soporte Nivel 1</h1>

        {node.isResult ? (
          <div className={`result-card ${node.type || 'success'}`}>
            <h3>{node.type === 'danger' ? '⚠️ Acción Crítica' : '✅ Resolución'}</h3>
            <p className="result-action"><strong>{node.question}</strong></p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="reset-btn" onClick={goBack}>
                🔙 Corregir respuesta anterior
              </button>
              <button className="reset-btn" onClick={resetFlow}>
                🔄 Iniciar Nuevo Llamado
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="question">{node.question}</h2>
            <div className="options-container">
              {node.options?.map((opt: Option, idx: number) => (
                <button
                  key={idx}
                  className={`btn ${opt.type || ''}`}
                  onClick={() => handleOptionClick(opt.next, opt.label)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="history">
            <h4>Historial del flujo:</h4>
            {history.map((h, i) => (
              <div key={i} className="history-item">
                <span style={{ opacity: 0.7, marginRight: '8px' }}>Q: {h.question}</span>
                <strong>A: {h.answer}</strong>
              </div>
            ))}
            {!node.isResult && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <button className="reset-btn" onClick={goBack}>
                  🔙 Volver un paso atrás
                </button>
                <button className="reset-btn" onClick={resetFlow}>
                  🔄 Reiniciar Flujo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
