import React from "react";

interface SubmitButtonProps {
    label: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label }) => {
    return (
        <div style={{marginTop: 10, textAlign: 'right'}}>
            <button type="submit" className="signup-btn">{label}</button>
        </div>
    )
}
export default SubmitButton; 