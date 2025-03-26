import React, { useEffect, useState } from "react";
import errorSound from "../../assets/audio/error-sound.wav";
import "../../styles/alerter.css";


// sound for error alert from: https://pixabay.com/sound-effects/error-8-206492/

function Alerter({ message, type }) {
    const [visible, setVisible] = useState(true);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        if (type === "error") {
            const audio = new Audio(errorSound);
            audio.play();            
            audio.play().catch((e) => {
                console.warn("Error playing sound:", e);
            });
        }
    }, [type]);

    const handleClose = () => {
        setFading(true);
        setTimeout(() => setVisible(false), 300);
    };

    if (!visible) return null;

    let alertContent;
    let alertClass;

    switch (type) {
        case "success":
            alertContent = "✅ Success!";
            alertClass = "alerter-success";
            break;
        case "error":
            alertContent = "❌ Error!";
            alertClass = "alerter-error";
            break;
        case "warning":
            alertContent = "⚠️ Warning!";
            alertClass = "alerter-warning";
            break;
        case "info":
            alertContent = "ℹ️ Info:";
            alertClass = "alerter-info";
            break;
        default:
            alertContent = "🔔 Alert:";
            alertClass = "alerter-default";
            break;
    }

    return (
        <div className={`alerter-container ${fading ? "fade-out" : "fade-in"}`}>
            <div className="alerter-header">
                <strong>{alertContent}</strong>
                <button className="close-alerter" onClick={handleClose}>X</button>
            </div>
            <div className="alerter-body">
                <p className={alertClass}>{message}</p>
            </div>
        </div>
    );
}

export default Alerter;
