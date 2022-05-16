import { TableCell, styled } from '@mui/material';

export const TableCellLabel = styled(TableCell)(({ theme }) => ({
  border: 0,
  paddingLeft: 0,
  paddingTop: 9,
  paddingBottom: 9,
  paddingRight: 25,
  [theme.breakpoints.down('sm')]: {
    paddingRight: 15,
  },
  fontSize: 'inherit',
  lineHeight: 'inherit',
  letterSpacing: 'inherit',
  width: 'auto',
  textAlign: 'right',
}));

export const TableCellValue = styled(TableCell)({
  border: 0,
  padding: '6px 0',
  fontSize: 'inherit',
});
