import { useSelector } from 'react-redux';

// Type definitions
interface AppState {
  token: string;
}

interface RootState {
  app: AppState;
}

interface AuthHookReturn {
  token: string;
}

export const useAuth = (): AuthHookReturn => {
  const { token } = useSelector((state: RootState) => state.app);
  return { token };
};