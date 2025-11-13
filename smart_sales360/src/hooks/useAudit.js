import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import auditService from '../services/auditService';

export const useAudit = (modulo, descripcion = null) => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      auditService.logView(modulo, descripcion);
    }
  }, [modulo, user]);
  
  return {
    logCreate: (desc, datos) => auditService.logCreate(modulo, desc, datos),
    logUpdate: (desc, datos) => auditService.logUpdate(modulo, desc, datos),
    logDelete: (desc, datos) => auditService.logDelete(modulo, desc, datos),
  };
};
