import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShareIcon from '@mui/icons-material/Share';
import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { sampleData } from './FormData';
import InfoDialog from './InfoDialog';
import { stateToQueryStringUrl } from './QueryStringUtil';
import ShareDialog from './ShareDialog';

export default function Header({ state, handleSampleData }) {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const handleMenuClose = () => setMenuAnchorEl(null);
  const sampleDataLen = sampleData.length;

  const selectMenuItem = n => {
    handleSampleData(n);
    handleMenuClose();
  };
  const buttonStyle = { px: 2 };
  const link = stateToQueryStringUrl(state);

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
        {[...Array(sampleDataLen).keys()].map(n => (
          <MenuItem key={n} onClick={() => selectMenuItem(n)}>
            Sample Data {n + 1}
          </MenuItem>
        ))}
      </Menu>

      <InfoDialog
        isInfoDialogOpen={isInfoDialogOpen}
        setIsInfoDialogOpen={setIsInfoDialogOpen}
      />

      <ShareDialog
        link={link}
        isShareDialogOpen={isShareDialogOpen}
        setIsShareDialogOpen={setIsShareDialogOpen}
      />
    </>
  );
}
