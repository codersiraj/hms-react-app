// src/hooks/usePageLoader.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function usePageLoader() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // When route changes, show loader for 2 seconds
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return loading;
}
