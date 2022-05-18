import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShareIcon from '@mui/icons-material/Share';
import { Button, ButtonGroup, Menu } from '@mui/material';
import { useState } from 'react';
import { sampleData } from '../FormData';
import { stateToQueryStringUrl } from '../common/QueryStringUtil';
import LegalDialog from './LegalDialog';
import ShareDialog from './ShareDialog';

export default function Header({ state, handleSampleData }) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isLegalDialogOpen, setIsLegalDialogOpen] = useState(false);
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
        <Button onClick={() => setIsLegalDialogOpen(true)} sx={buttonStyle}>
          Legal
        </Button>
      </ButtonGroup>

      <Menu
        keepMounted
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {[...Array(sampleDataLen).keys()].map(n => (
          <Button
            key={n}
            onClick={() => selectMenuItem(n)}
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            Example {n + 1}
          </Button>
        ))}
      </Menu>

      <ShareDialog
        link={link}
        isShareDialogOpen={isShareDialogOpen}
        setIsShareDialogOpen={setIsShareDialogOpen}
      />

      <LegalDialog
        isLegalDialogOpen={isLegalDialogOpen}
        setIsLegalDialogOpen={setIsLegalDialogOpen}
      />
    </>
  );
}
