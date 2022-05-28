import { TableCell, styled } from '@mui/material';

export function TableCellLabel({ children, sx = {} }) {
  return (
    <TableCell
      sx={{
        border: 0,
        paddingLeft: 0,
        paddingTop: '6px',
        paddingBottom: '6px',
        paddingRight: {
          xs: '15px',
          sm: '25px',
        },
        fontSize: 'inherit',
        lineHeight: 'inherit',
        letterSpacing: 'inherit',
        width: 'auto',
        textAlign: 'right',
        verticalAlign: 'top',
        ...sx,
      }}
    >
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'right',
        }}
      >
        {children}
      </div>
    </TableCell>
  );
}

export const TableCellValue = styled(TableCell)({
  border: 0,
  padding: '6px 0',
  fontSize: 'inherit',
});

export function FieldError({ children, display }) {
  return (
    <div
      style={{
        display: display ? 'block' : 'none',
        color: '#d32f2f',
        fontSize: '.75rem',
        lineHeight: '1.66',
        letterSpacing: '.03333em',
        margin: '3px 10px 0',
        maxWidth: 226,
      }}
    >
      {children}
    </div>
  );
}
