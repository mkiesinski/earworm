import React, { useState, useContext } from "react";

export const AppContext = React.createContext({
  setCommandKey: () => {},
  commandKey: null,
});

export function DefaultAppContext({ children }) {
  const [ state, setState ] = useState({
    setCommandKey: (commandKey) => {
      setState(s => ({
        ...s,
        timestamp: new Date().toISOString(),
        commandKey,
      }));
    },
    commandKey: null,
  });


  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  );
}
