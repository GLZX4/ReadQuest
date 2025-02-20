import React from "react";
import "../styles/alerter.css";

function Alerter({ message, type }) {

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
        <div className="alerter-container">
            <div className="alerter-header">
                <strong>{alertContent}</strong>
                <button className="close-alerter">X</button>
            </div>
            <div className="alerter-body">
                <p className={alertClass}>{message}</p>
            </div>
        </div>
    )
}

export default Alerter;