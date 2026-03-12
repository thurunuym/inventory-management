import { useAuth } from '../context/AuthContext';

export const PermissionGate = ({ permission, children }) => {
  const { user } = useAuth();
  
  if (user?.permissions?.includes(permission)) {
    return <>{children}</>;
  }
  return null; // Hide the element if user doesn't have the right permission
};