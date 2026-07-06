import React, { createContext, useContext, useState, useCallback } from "react";

// Drives the left slide-in InfoPanel. `openPanel(path)` shows a footer info
// page inside the panel instead of navigating to it. Pages rendered inside the
// panel see `inPanel: true` (via the nested provider in InfoPanel) so they can
// drop their full-page chrome (Header, CategoryNav, ChatBot).
export const PanelContext = createContext({
  path: null,
  openPanel: () => {},
  closePanel: () => {},
  inPanel: false,
});

export const usePanel = () => useContext(PanelContext);

export function PanelProvider({ children }) {
  const [path, setPath] = useState(null);
  const openPanel = useCallback((p) => setPath(p), []);
  const closePanel = useCallback(() => setPath(null), []);

  return (
    <PanelContext.Provider value={{ path, openPanel, closePanel, inPanel: false }}>
      {children}
    </PanelContext.Provider>
  );
}
