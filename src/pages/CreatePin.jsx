import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreatePin.css";

const CreatePin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleCreatePin = async () => {
    try {
      if (pin !== confirmPin) {
        return alert("PINs do not match");
      }

      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/create-pin`,
        {
          userId: user.id,
          pin
        }
      );

      alert(res.data.message);
      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="create-pin-container">
      <div className="create-pin-card">
        <h2>Create Transaction PIN</h2>
        <p>Set a secure 4-digit PIN for transfers and withdrawals.</p>

        <input
          className="pin-input"
          type="password"
          maxLength="4"
          placeholder="Enter 4-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <input
          className="pin-input"
          type="password"
          maxLength="4"
          placeholder="Confirm PIN"
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value)}
        />

        <button
          className="create-pin-btn"
          onClick={handleCreatePin}
        >
          Create PIN
        </button>
      </div>
    </div>
  );
};

export default CreatePin;