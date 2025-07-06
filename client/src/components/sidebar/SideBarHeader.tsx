import styled from '@emotion/styled';
import React from 'react';
import { Typography } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';

const StyledSidebarHeader = styled.div`
  height: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;

  > div {
    width: 100%;
    overflow: hidden;
  }
`;

const StyledLogo = styled.div`
  width: 35px;
  min-width: 35px;
  height: 35px;
  min-height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: white;
  font-size: 24px;
  font-weight: 700;
  background-color: #009fdb;
  background: linear-gradient(45deg, rgb(21 87 205) 0%, rgb(90 225 255) 100%);
`;

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    collapsed: boolean;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed, theme, setTheme, ...rest }) => {
    return (
        <StyledSidebarHeader {...rest}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StyledLogo>GS</StyledLogo>
                    {!collapsed && <Typography variant="subtitle1" fontWeight={700} color="#0098e5">
                        Dashboard
                    </Typography>}
                </div>
                {!collapsed && <div>
                    {
                        theme === 'light' ?
                            <DarkMode onClick={() => setTheme('dark')} style={{ cursor: 'pointer' }} /> :
                            <LightMode onClick={() => setTheme('light')} style={{ color: 'yellow', cursor: 'pointer' }} />
                    }

                </div>}
            </div>
        </StyledSidebarHeader>
    );
}; 