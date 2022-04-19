import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShareIcon from '@mui/icons-material/Share';
import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import InfoDialog from './InfoDialog';
import ShareDialog from './ShareDialog';

export default function Header({ state, handleSampleData }) {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const handleMenuClose = () => setMenuAnchorEl(null);

  const selectMenuItem = n => {
    handleSampleData(n);
    handleMenuClose();
  };
  const buttonStyle = { px: 2 };

  return (
    <>
      <ButtonGroup variant="text" sx={{ justifyContent: 'center' }}>
        <Button onClick={() => setIsInfoDialogOpen(true)} sx={buttonStyle}>
          Information
        </Button>
        <Button
          onClick={e => setMenuAnchorEl(e.currentTarget)}
          endIcon={<KeyboardArrowDownIcon />}
          sx={buttonStyle}
        >
          Examples
        </Button>
        <Button
          onClick={() => setIsShareDialogOpen(true)}
          startIcon={<ShareIcon />}
          sx={buttonStyle}
        >
          Share
        </Button>
      </ButtonGroup>

      <Menu
        keepMounted
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectMenuItem(0)}>Sample Data 1</MenuItem>
        <MenuItem onClick={() => selectMenuItem(1)}>Sample Data 2</MenuItem>
        <MenuItem onClick={() => selectMenuItem(2)}>Sample Data 3</MenuItem>
      </Menu>

      <InfoDialog
        isInfoDialogOpen={isInfoDialogOpen}
        setIsInfoDialogOpen={setIsInfoDialogOpen}
      />

      <ShareDialog
        state={state}
        isShareDialogOpen={isShareDialogOpen}
        setIsShareDialogOpen={setIsShareDialogOpen}
      />
    </>
  );
}
