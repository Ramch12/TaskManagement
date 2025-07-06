import React from "react";
import { Link } from "react-router-dom";

interface CustomLinkProps {
    link: string;
    label: string;
    text?: string;
}

const CustomLink: React.FC<CustomLinkProps> = ({ link, label, text = '' }) => {
    return (
        <div style={{ padding: '10px 0px', textAlign: 'right'}}>
            <span>{text}<Link to={link}>{label}</Link></span>
        </div>
    )
}

export default CustomLink; 