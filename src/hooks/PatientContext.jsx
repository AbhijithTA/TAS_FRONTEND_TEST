import React, { createContext, useContext } from 'react';

const PatientContext = createContext();

export const usePatient = () => useContext(PatientContext);

export const PatientProvider = ({ children, value }) => (
  <PatientContext.Provider value={value}>
    {children}
  </PatientContext.Provider>
);
