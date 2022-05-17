import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
} from '@mui/material';
import copy from 'copy-to-clipboard';
import { createRef, useState } from 'react';

export default function ShareDialog({
  link,
  isShareDialogOpen,
  setIsShareDialogOpen,
}) {
  const clickToCopyText = 'Click to copy';
  const copiedText = 'Copied!';
  const [isOpen, setIsOpen] = useState(false);
  const [tooltip, setTooltip] = useState(clickToCopyText);
  const handleClose = () => setIsShareDialogOpen(false);
  const textField = createRef();

  const handleClick = () => {
    textField.current.select();
    copy(link, {
      format: 'text/plain',
      onCopy: () => setTooltip(copiedText),
    });
    // setTimeout so that the copy() doesn't close the tooltip on mobile
    setTimeout(() => setIsOpen(true), 0);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isShareDialogOpen}
      onClose={handleClose}
    >
      <DialogTitle>Share</DialogTitle>
      <DialogContent>
        <Tooltip
          open={isOpen}
          onMouseOver={() => setTooltip(clickToCopyText)}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          title={tooltip}
          disableInteractive
          arrow
          enterTouchDelay={0}
          leaveTouchDelay={10000}
        >
          <Box onClick={handleClick}>
            <TextField
              fullWidth
              variant="filled"
              value={link}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <ContentCopyIcon
                    sx={{ pointerEvents: 'none' }}
                    onClick={handleClick}
                  />
                ),
                sx: {
                  '&:hover': {
                    cursor: 'pointer',
                  },
                },
                inputProps: {
                  sx: {
                    '&:hover': {
                      cursor: 'pointer',
                    },
                  },
                  ref: textField,
                },
              }}
            />
          </Box>
        </Tooltip>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
