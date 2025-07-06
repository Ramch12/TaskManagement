import { Store, NOTIFICATION_TYPE } from 'react-notifications-component';
import axios from 'axios';
import FileDownload from 'js-file-download';
import { confirmAlert } from "react-confirm-alert";

export interface NotificationOptions {
    title?: string;
    message: string;
    type?: NOTIFICATION_TYPE;
}

export const notification = ({ title = '', message, type = 'success' }: NotificationOptions) => {
    Store.addNotification({
        title,
        message,
        type: type as NOTIFICATION_TYPE,
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    });
}

// hex to rgba converter
export function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export interface Theme {
    sidebar: {
        backgroundColor: string;
        color: string;
    };
    menu: {
        menuContent: string;
        icon: string;
        hover: {
            backgroundColor: string;
            color: string;
        };
        disabled: {
            color: string;
        };
    };
}

export interface Themes {
    light: Theme;
    dark: Theme;
}

export const themes: Themes = {
    light: {
        sidebar: {
            backgroundColor: '#ffffff',
            color: '#607489',
        },
        menu: {
            menuContent: '#fbfcfd',
            icon: '#0098e5',
            hover: {
                backgroundColor: '#c5e4ff',
                color: '#44596e',
            },
            disabled: {
                color: '#9fb6cf',
            },
        },
    },
    dark: {
        sidebar: {
            backgroundColor: '#0b2948',
            color: '#8ba1b7',
        },
        menu: {
            menuContent: '#082440',
            icon: '#59d0ff',
            hover: {
                backgroundColor: '#00458b',
                color: '#b6c8d9',
            },
            disabled: {
                color: '#3e5e7e',
            },
        },
    },
};

export interface DeletePopupOptions {
    title?: string;
    message?: string;
    onConfirm: (id?: any) => void;
    id?: any;
}

export const deletePopup = ({ title, message, onConfirm, id }: DeletePopupOptions) => {
    confirmAlert({
        title: title || "Confirm to Delete",
        message: message || "Are you sure you want to delete this?.",
        buttons: [
            {
                label: "Yes",
                onClick: () => onConfirm(id),
            },
            {
                label: "No",
            },
        ],
    });
} 