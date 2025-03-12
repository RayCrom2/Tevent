import React from "react";

const checkPasswordStrength = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[\W_]/.test(password);

    let strength = 0;
    if (password.length >= minLength) strength++;
    if (hasUppercase) strength++;
    if (hasLowercase) strength++;
    if (hasNumber) strength++;
    if (hasSpecialChar) strength++;

    if (strength === 5) return { label: "Strong", color: "green" };
    if (strength >= 3) return { label: "Medium", color: "orange" };
    return { label: "Weak", color: "red" };
};

const PasswordStrengthMeter = ({ password }) => {
    const { label, color } = checkPasswordStrength(password);

    return (
        <div>
            <p style={{ color }}>Password Strength: {label}</p>
        </div>
    );
};

export default PasswordStrengthMeter;