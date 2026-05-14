import React, { createContext, useContext, useState } from 'react';

export interface ActiveRoute {
  from: { name: string; center: [number, number] };
  to: { name: string; center: [number, number] };
  coordinates: [number, number][]; // polyline
  profile: string;
  kind: string;
  color: string;
}

interface RouteContextType {
  activeRoute: ActiveRoute | null;
  setActiveRoute: (route: ActiveRoute | null) => void;
}

const RouteContext = createContext<RouteContextType>({
  activeRoute: null,
  setActiveRoute: () => {},
});

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [activeRoute, setActiveRoute] = useState<ActiveRoute | null>(null);

  return (
    <RouteContext.Provider value={{ activeRoute, setActiveRoute }}>
      {children}
    </RouteContext.Provider>
  );
}

export const useActiveRoute = () => useContext(RouteContext);
