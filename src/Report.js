import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Fragment, memo, useState } from 'react';
import {
  createAmortizationChartOptions,
  createBalanceChartOptions,
  createCashEquityChartOptions,
  createComparisonChartOptions,
  createInterestChartOptions,
  setCommonOptions,
} from './ChartOptions';
import createReportData from './report-logic';

const calcPerformanceRanges = netWorthDifferences => {
  const ranges = [];
  let isPositiveNow;
  let prevIsPositive;
  const firstDate = netWorthDifferences[0].date;
  const lastDate = netWorthDifferences[netWorthDifferences.length - 1].date;
  let prevDate = firstDate;
  const pushResult = (startDate, endDate, isPositive) => {
    ranges.push({
      startDate,
      endDate,
      isPositive,
    });
    prevDate = endDate;
  };
  for (const nwd of netWorthDifferences) {
    isPositiveNow = nwd.difference > 0;
    const isZeroNow = nwd.difference === 0;
    if (isPositiveNow !== prevIsPositive && prevIsPositive !== undefined) {
      pushResult(prevDate, nwd.date, prevIsPositive);
    }
    prevIsPositive = isZeroNow ? undefined : isPositiveNow;
  }
  pushResult(prevDate, lastDate, prevIsPositive);
  return ranges;
};

function Report({ reportState }) {
  const [showDetails, setShowDetails] = useState(false);

  const data = createReportData(reportState);
  setCommonOptions(data);
  data.performanceRanges = calcPerformanceRanges(data.netWorthDifferences);

  const tableCellStyle = {
    border: 0,
    fontSize: 'initial',
    padding: 0,
  };

  return (
    <>
      <Divider variant="middle" />
      <br />
      <br />
      <Table
        sx={{
          width: 'fit-content',
          '&.MuiTable-root': { m: 'auto' },
        }}
      >
        <TableBody>
          <TableRow>
            <TableCell
              sx={{
                ...tableCellStyle,
                verticalAlign: 'top',
                whiteSpace: 'nowrap',
              }}
            >
              Scenario 1:
            </TableCell>
            <TableCell sx={tableCellStyle}>
              &nbsp;
              {data.isRefinance
                ? `You keep Mortgage 1 instead of refinancing.`
                : `You purchase a home with Mortgage 1.`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{
                ...tableCellStyle,
                verticalAlign: 'top',
                whiteSpace: 'nowrap',
              }}
            >
              Scenario 2:
            </TableCell>
            <TableCell sx={tableCellStyle}>
              &nbsp;
              {data.isRefinance
                ? `You refinance Mortgage 1 with Mortgage 2.`
                : `You purchase a home with Mortgage 2.`}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <br />
      {data.performanceRanges.map((range, n) => (
        <Fragment key={n}>
          From {range.startDate.format('MM-YYYY')} to{' '}
          {range.endDate.format('MM-YYYY')}, Scenario {range.isPositive ? 2 : 1}{' '}
          outperforms Scenario {range.isPositive ? 1 : 2}.
          <br />
        </Fragment>
      ))}
      <br />
      <HighchartsReact
        highcharts={Highcharts}
        options={createComparisonChartOptions(data)}
      />
      <p>
        The Comparison graph shows how Scenario 1 and Scenario 2 compare in
        value over time in terms of Net Worth. Net Worth is defined here as Cash
        plus Equity -- see below. Each point on the line above is equal to
        &quot;Scenario 2 Net Worth&quot; minus &quot;Scenario 1 Net Worth.&quot;
        Therefore, if a point&apos;s value is greater than $0, then Scenario 2
        is outperforming Scenario 1 at that time (taking into account past
        performance).
      </p>
      <Button
        variant="outlined"
        onClick={() => {
          setShowDetails(!showDetails);
        }}
        sx={{
          width: {
            xs: '60%',
            sm: 'fit-content',
          },
          alignSelf: 'center',
          p: '10px 56px',
          '&.MuiButtonBase-root': { mt: '35px' },
        }}
      >
        {showDetails ? (
          <>
            Hide details <ExpandLessIcon />
          </>
        ) : (
          <>
            Show details <ExpandMoreIcon />
          </>
        )}
      </Button>
      <Accordion
        expanded={showDetails}
        sx={{
          m: 0,
          boxShadow: 'none',
          '&::before': {
            display: 'none',
          },
        }}
      >
        <AccordionSummary sx={{ display: 'none' }} />
        <AccordionDetails sx={{ p: 0 }}>
          <br />
          <HighchartsReact
            highcharts={Highcharts}
            options={createCashEquityChartOptions(data.mortgages)}
          />
          <p>
            For each monthly mortgage payment made, Cash goes down by that
            amount. Equity goes up by the principal portion of the payment. Cash
            has additional value over time, as it can be invested. To account
            for the time value of money, each month Cash is multiplied by a
            monthly ROI value (which is derived from the yearly ROI value
            supplied above). If Cash is positive, then this value is added to
            Cash. If Cash is negative, then this value is an opportunity cost
            that gets subtracted from Cash.
            <br />
            <br />
            The tool assumes that each mortgage closing date is two months
            before the starting date supplied above. If this comparison is for a
            refinance, then the starting cash starts off increased by the
            cash-out amount and equity starts off decreased by the cash-out
            amount.
            <br />
            <br />
            If mortgage interest itemization is enabled, then Cash is increased
            each month by some amount. First, the total itemizable mortgage
            interest for that year is determined. This amount is reduced by N,
            where N is the standard deduction minus other itemized deductions.
            (This accounts for years where your standard deduction is greater
            than your itemizable mortgage interest, in which case you would end
            up not itemizing. However, other itemized deductions also help to
            offset the standard deduction which is why they are subtracted.)
            That amount is then multiplied by your marginal tax rate. Then it is
            divided by the number of months a payment is made that year, which
            is twelve except for potentially the first and last months of the
            mortgage.
            <br />
            <br />
            This tool takes into account the tax implications of the Tax Cuts
            and Jobs Act of 2017. It assumes that all relevant provisions will
            be renewed indefinitely.
            <br />
            <br />
            Note that you can zoom in on graphs by clicking and dragging. You
            also can show/hide lines by clicking on their legend entries.
          </p>
          <br />
          <HighchartsReact
            highcharts={Highcharts}
            options={createInterestChartOptions(data.mortgages)}
          />
          <p>
            This graph shows the total mortgage interest paid in each calendar
            year.
          </p>
          <br />
          <HighchartsReact
            highcharts={Highcharts}
            options={createBalanceChartOptions(data.mortgages)}
          />
          <p>
            This graph shows the outstanding mortgage balances decreasing over
            time.
          </p>
          {data.mortgages.map(m => (
            <Fragment key={m.id}>
              <br />
              <HighchartsReact
                highcharts={Highcharts}
                options={createAmortizationChartOptions(m)}
              />
              <p>Amortization schedule for Mortgage {m.id}.</p>
            </Fragment>
          ))}
        </AccordionDetails>
      </Accordion>
      <br />
    </>
  );
}

export default memo(Report);
