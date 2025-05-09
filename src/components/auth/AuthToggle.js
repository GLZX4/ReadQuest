import React, { useState } from "react";
import Login from "./Login";
import StudentRegister from "./StudentRegister";
import TutorRegister from "./TutorRegister";
import AdminRegister from "./AdminRegister";
import Alerter from "../common/alerter";
import { AnimatePresence, motion } from "framer-motion";
import "../../styles/authToggle.css";

// Detect if running inside Electron production build
const isProd = !window.location.href.includes("localhost");

function AuthToggle() {
    const [isLogin, setIsLogin] = useState(true);
    const [isTutor, setIsTutor] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [alert, setAlert] = useState(null); 

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const toggleRole = () => {
        setIsTutor(!isTutor);
    };

    const toggleAdmin = () => {
        setIsAdmin(!isAdmin);
    };

    const showSuccessMessage = (message) => {
        setAlert({ message, type: "success" });
        setIsLogin(true);

        setTimeout(() => setAlert(null), 5000);
    };

    const animationVariants = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 100 }
    };

    return (
        <div className="authContainer">
            {alert && <Alerter message={alert.message} type={alert.type} />}

            <AnimatePresence wait>
                {isLogin ? (
                    <motion.div
                        key="login"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={animationVariants}
                        transition={{ duration: 0.5 }}
                        className="auth-form"
                    >
                        <Login />
                    </motion.div>
                ) : isAdmin ? (
                    <motion.div
                        key="adminRegister"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={animationVariants}
                        transition={{ duration: 0.5 }}
                        className="auth-form"
                    >
                        <AdminRegister onSuccess={showSuccessMessage} />
                    </motion.div>
                ) : isTutor ? (
                    <motion.div
                        key="tutorRegister"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={animationVariants}
                        transition={{ duration: 0.5 }}
                        className="auth-form"
                    >
                        <TutorRegister onSuccess={showSuccessMessage} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="studentRegister"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={animationVariants}
                        transition={{ duration: 0.5 }}
                        className="auth-form"
                    >
                        <StudentRegister onSuccess={showSuccessMessage} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="auth-buttons">
                <button className="authToggler-Btn noselect" onClick={toggleForm}>
                    {isLogin ? "Need to Register?" : "Already Registered?"}
                </button>

                {!isLogin && (
                    <>
                        <button className="roleToggler-Btn noselect" onClick={toggleRole}>
                            {isTutor ? "Register as Student" : "Register as Tutor"}
                        </button>

                        {!isProd && (
                            <button className="roleToggler-Btn noselect" onClick={toggleAdmin}>
                                {isAdmin ? "Register as Student/Tutor" : "Register as Admin"}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default AuthToggle;
