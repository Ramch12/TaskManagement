import React from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    label: string;
    customId: string;
    register: any;
    errors?: string;
}

const TextField: React.FC<TextFieldProps> = ({ placeholder, label, customId, register, errors, ...restProps }) => {
    return (
        <div className="text_field_div">
            <label htmlFor={customId} className="text-label mb-1" style={{ display: 'block', fontWeight: "400" }}>
                {label}
            </label>
            <input placeholder={placeholder} id={customId} {...restProps} {...register(customId)} className="text-field" />
            {errors && <span style={{ color: 'red', marginBottom: "0px" }}>{errors}</span>}
        </div>
    )
}
export default TextField; 