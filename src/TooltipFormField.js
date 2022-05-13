import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Tooltip, styled } from '@mui/material';
import { useState } from 'react';

const FormValueTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} componentsProps={{ tooltip: { className } }} />
))(`
    font-size: 14px;
`);

export default function TooltipFormField({ tooltip, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '14px' }}>
      <FormValueTooltip open={isOpen} title={tooltip} arrow placement="top">
        <Box sx={{ display: 'inline-flex', gap: '14px' }}>{children}</Box>
      </FormValueTooltip>
      <Tooltip
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        title="no text"
        enterTouchDelay={0}
        leaveTouchDelay={10000}
        componentsProps={{
          tooltip: {
            sx: {
              display: 'none',
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            ml: '-4px',
            mt: '-2px',
            color: '#AAA',
            '&:hover': { color: '#666' },
            p: '2px',
          }}
        >
          <InfoOutlinedIcon
            sx={{
              fontSize: '1.75rem',
            }}
          />
        </Box>
      </Tooltip>
    </Box>
  );
}
