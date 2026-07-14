import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const router = useNavigate();

    const isAuthenticated = () => {
      if (sessionStorage.getItem("token")) {
        return true;
      }
      return false;
    };

    useEffect(() => {
      if (!isAuthenticated()) {
        router("/auth", {
          replace: true,
          state: {
            message: "Please sign in to access this page.",
          },
        });
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
