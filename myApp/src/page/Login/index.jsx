import React, { useState } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const { token } = useParams();

  const verifyEmail = async () => {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  React.useEffect(() => {
    verifyEmail();
  }, [token]);

  return (
    <div>
      <h2>Verificando e-mail...</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
