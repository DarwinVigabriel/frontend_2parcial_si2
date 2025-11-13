import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para detectar escaneo de código de barras
 * Los escáneres de código de barras simulan escritura rápida del teclado
 */
const useBarcodeScanner = (onScan, options = {}) => {
  const {
    minLength = 3,
    maxLength = 20,
    timeout = 100, // tiempo máximo entre caracteres (ms)
    preventDefault = true,
    stopPropagation = true,
    captureKeys = true
  } = options;

  const [buffer, setBuffer] = useState('');
  const [lastKeyTime, setLastKeyTime] = useState(Date.now());
  const [isScanning, setIsScanning] = useState(false);

  const resetBuffer = useCallback(() => {
    setBuffer('');
    setIsScanning(false);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime;

      // Si el tiempo entre teclas es mayor al timeout, reiniciar buffer
      if (timeDiff > timeout) {
        setBuffer('');
      }

      // Capturar solo caracteres alfanuméricos y algunos especiales
      if (e.key.length === 1 && /[a-zA-Z0-9\-_]/.test(e.key)) {
        if (preventDefault) e.preventDefault();
        if (stopPropagation) e.stopPropagation();

        setIsScanning(true);
        setBuffer(prev => {
          const newBuffer = prev + e.key;
          
          // Si alcanzamos la longitud máxima, procesar
          if (newBuffer.length >= maxLength) {
            if (newBuffer.length >= minLength) {
              onScan(newBuffer);
            }
            return '';
          }
          
          return newBuffer;
        });
        setLastKeyTime(currentTime);
      }

      // Enter finaliza el escaneo
      if (e.key === 'Enter' && buffer.length >= minLength) {
        if (preventDefault) e.preventDefault();
        if (stopPropagation) e.stopPropagation();
        
        onScan(buffer);
        resetBuffer();
      }
    };

    if (captureKeys) {
      window.addEventListener('keypress', handleKeyPress);
      return () => window.removeEventListener('keypress', handleKeyPress);
    }
  }, [buffer, lastKeyTime, timeout, minLength, maxLength, onScan, preventDefault, stopPropagation, captureKeys, resetBuffer]);

  // Auto-reset después del timeout
  useEffect(() => {
    if (buffer.length > 0) {
      const timer = setTimeout(() => {
        if (buffer.length >= minLength) {
          onScan(buffer);
        }
        resetBuffer();
      }, timeout + 50);

      return () => clearTimeout(timer);
    }
  }, [buffer, timeout, minLength, onScan, resetBuffer]);

  return {
    isScanning,
    buffer,
    resetBuffer
  };
};

export default useBarcodeScanner;
