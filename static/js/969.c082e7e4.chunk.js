"use strict";(self.webpackChunkmortgage_comp_tool=self.webpackChunkmortgage_comp_tool||[]).push([[969],{969:function(t,e,a){a.r(e),a.d(e,{default:function(){return $}});var n,i=a(1413),r=a(9439),o=a(7762),s=a(4721),c=a(9836),m=a(3382),u=a(5855),h=a(3994),l=a(3991),d=a.n(l),p=a(9718),f=a.n(p),y=a(2003),g=a.n(y),v=a(2426),x=a.n(v),b=a(2791),D=a(3433),A=a(3861),j=a.n(A),M=a(8499),I="${value:,.0f}",Z={red:"#b84c3e",green:"#86a542",blue:"#6881d8",gold:"#c18739",purple:"#8650a6",teal:"#50b47b",pink:"#b84c7d",grey:"#888"};for(var q in Z){var w=j()(Z[q]);Z["".concat(q,"s")]=[w.lighten(.4).hex(),w.darken(.25).hex()]}f().setOptions({lang:{thousandsSep:","}});var R=function(t){var e=function(t,e){var a=x().min(t.startDate,e.startDate).clone(),n=x().max(t.endDate,e.endDate).clone(),i=.02*n.diff(a,"days");return a.subtract(i,"days"),n.add(i,"days"),{minDate:a,maxDate:n}}(t.m1,t.m2),a=e.minDate,i=e.maxDate,r=function(t,e){for(var a=[],n=t.clone().add(1,"year").startOf("year");n.year()%5!==0;)n.add(1,"year");for(;n.isBefore(e);)a.push({color:"#EEE",width:1,value:n.valueOf(),zIndex:2}),n.add(5,"year");return a}(a,i);n={chart:{type:"spline",zoomType:"x"},plotOptions:{series:{states:{hover:{lineWidthPlus:0},inactive:{enabled:!1}},marker:{radius:2}}},xAxis:{type:"datetime",min:a.valueOf(),max:i.valueOf(),minRange:15778463e4,plotLines:r},yAxis:{title:{text:null},labels:{format:I},plotLines:[{color:"#AAA",width:1,value:0,zIndex:2}]},tooltip:{shared:!0,split:!0,crosshairs:!0,xDateFormat:"%m-%Y",headerFormat:"{point.key}<br/>",valuePrefix:"$"}}},S=function(t){return{chart:{type:"column"},title:{text:"Mortgage Interest By Year"},plotOptions:{column:{groupPadding:0,pointPadding:0},series:{states:{inactive:{enabled:!1},hover:!1}}},series:(0,D.Z)(t.map((function(t,e){return{name:"".concat(t.name," Interest"),data:t.interestByYear.map((function(t){return{name:t.year,y:t.interest}})),color:Z.reds[e]}}))),xAxis:{type:"category",categories:(0,D.Z)(new Set(t.map((function(t){return t.interestByYear.map((function(t){return t.year}))})).flat()))},yAxis:{title:{text:null},labels:{format:I},plotLines:[{color:"#AAA",width:1,value:0,zIndex:2}]},tooltip:{split:!0,valueDecimals:0,headerFormat:"{point.key}<br/>",shared:!0,valuePrefix:"$"}}},Y=function(t){return(0,M.Z)(n,{title:{text:"Mortgage Balances"},series:(0,D.Z)(t.map((function(t,e){return{name:"".concat(t.name," Balance"),data:[{x:t.startDate.subtract(1,"month").valueOf(),y:t.loanAmount}].concat((0,D.Z)(t.payments.map((function(t){return{x:t.unixTimeMs,y:t.remainingBalance}})))),color:Z.purples[e]}}))),tooltip:{valueDecimals:0}})},C=a(2525),W=a(2521),z=a(7752),B=a(184),T=x()("2018-02-15","YYYY-MM-DD"),E=function(t){return function(t,e){return+"".concat(Math.round(+"".concat(e,"e+").concat(t)),"e-").concat(t)}(2,t)},k=function(t,e,a){var n=Math.pow(1+e,a);return E(t*(e*n)/(n-1))},F=function(t){var e,a=d()(t);a.roi/=100,a.monthlyRoi=(e=a.roi,Math.pow(1+e,1/12)-1),a.marginalTaxRate/=100,a.otherItemizedDeductions=+a.otherItemizedDeductions,a.m1HomeAcquisitionDebt=+a.m1HomeAcquisitionDebt,a.refiNewAcquisitionDebt=+a.refiNewAcquisitionDebt;var n,i=(0,o.Z)(a.mortgages);try{for(i.s();!(n=i.n()).done;){var r=n.value;if(r.name="Mortgage ".concat(r.id),r.interestRate/=100,r.loanAmount=+r.loanAmount,r.termMonths=W.Z.props[r.term].months,r.endDate=r.startDate.clone().add(r.termMonths-1,"months"),r.type!==z.Z.FixedRate){var s=z.Z.props[r.type].yearsFixed,c=r.interestRateAdjusted/100;r.rateAdjust={interestRate:c,monthlyInterestRate:c/12,adjustDate:r.startDate.clone().add(s,"years")}}r.monthlyInterestRate=r.interestRate/12,r.monthlyPayment=k(r.loanAmount,r.monthlyInterestRate,r.termMonths),r.closingCosts=+r.closingCosts,delete r.interestRateAdjusted}}catch(m){i.e(m)}finally{i.f()}return a},O=function(t,e,a){return e.isAfter(T)?a===C.Z.MarriedFilingSeparately?Math.min(375e3,t):Math.min(75e4,t):a===C.Z.MarriedFilingSeparately?Math.min(5e5,t):Math.min(1e6,t)},P=function(t,e){var a=t.date.year(),n=e.find((function(t){return t.year===a})).itemizationNetGain;return E(n/12)};function N(t){var e=t.reportState,a=F(e),l=(0,r.Z)(a.mortgages,2);a.m1=l[0],a.m2=l[1],function(t){var e,a,n=t.m1,i=t.m2,r=t.irsFilingStatus;e=n.startDate.isBefore(i.startDate)?n.startDate.year():i.startDate.year(),a=n.endDate.isAfter(i.endDate)?n.endDate.year():i.endDate.year();for(var o=C.Z.props[r].standardDeduction,s=Object.keys(o),c=+s[0],m=+s.pop(),u=c-1;u>=e;u--)o[u]=E(o[u+1]/1.0325);for(var h=m+1;h<=a;h++)o[h]=o[h-1]}(a),function(t){var e,a=(0,o.Z)(t);try{for(a.s();!(e=a.n()).done;){var n=e.value,i=n.loanAmount,r=n.monthlyInterestRate,s=n.startDate.clone(),c=n.monthlyPayment;for(n.payments=[];i>0;){var m=E(i*r),u=void 0;u=s.isSame(n.endDate)?i:E(c-m);var h=E(i),l=E(h-u);i=l;var d={principal:u,interest:m,date:s.clone(),unixTimeMs:s.valueOf(),startingBalance:h,remainingBalance:l};if(n.payments.push(d),s.add(1,"month"),n.rateAdjust&&s.isSame(n.rateAdjust.adjustDate)){r=n.rateAdjust.monthlyInterestRate;var p=n.termMonths-n.rateAdjust.adjustDate.diff(n.startDate,"months");c=k(i,r,p),n.rateAdjust.monthlyPayment=c}}}}catch(f){a.e(f)}finally{a.f()}}(a.mortgages),a.firstSharedM1Index=function(t){for(var e=t.m1,a=t.m2,n=0;e.payments[n]&&!e.payments[n].date.isSame(a.startDate);)if(1e3===++n)throw new Error("Couldn't find intersecting payment dates between the two mortgages.");return n}(a),a.isRefinance&&function(t){var e=t.m1,a=t.m2,n=t.firstSharedM1Index-1,i=e.payments[n],r=i.date.clone().date(15),o=r.date(),s=r.daysInMonth();e.proRatedInterest=E(i.interest*((o-1)/s)),a.proRatedInterest=E(a.payments[0].interest*((s-o+1)/s))}(a),function(t){var e=t.isRefinance,a=t.refiNewAcquisitionDebt,n=t.irsFilingStatus,i=t.m1,r=t.m2,o=t.firstSharedM1Index,s=t.m1HomeAcquisitionDebt;if(i.initEquity=0,e){var c=i.payments[o-1].startingBalance;i.initCash=0,r.initCash=E(r.loanAmount-c-r.closingCosts-i.proRatedInterest-r.proRatedInterest),r.initEquity=-E(r.loanAmount-c),i.startDate.isAfter(T)&&0!==s?i.homeAcquisitionDebt=Math.min(s,i.loanAmount):i.homeAcquisitionDebt=i.loanAmount;var m=r.loanAmount;r.startDate.isAfter(T)&&(m=Math.min(i.homeAcquisitionDebt,c,m)+a),r.homeAcquisitionDebt=Math.min(E(m),r.loanAmount)}else i.initCash=-i.closingCosts,r.initCash=-r.closingCosts,r.initEquity=0,r.homeAcquisitionDebt=r.loanAmount;i.homeAcquisitionDebt=O(i.homeAcquisitionDebt,i.startDate,n),r.homeAcquisitionDebt=O(r.homeAcquisitionDebt,i.startDate,n)}(a),function(t){for(var e=t.m1,a=t.m2,n=t.isRefinance,i=t.doItemize,r=t.firstSharedM1Index,s=t.irsFilingStatus,c=t.otherItemizedDeductions,m=t.marginalTaxRate,u=function(t,e,a,n){t.interestByYear.push({year:e,interest:E(a),itemizableInterest:E(n)})},h=function(t,e){return t<e?t/e:1},l=0,d=[e,a];l<d.length;l++){var p=d[l];p.interestByYear=[];var f,y=0,g=0,v=void 0,x=(0,o.Z)(p.payments);try{for(x.s();!(f=x.n()).done;){var b=f.value,D=b.date.year();v&&v!==D&&(u(p,v,y,g),y=0,g=0),y+=b.interest;var A=h(p.homeAcquisitionDebt,b.startingBalance);b.itemizableInterest=E(b.interest*A),g+=b.itemizableInterest,v=D}}catch(F){x.e(F)}finally{x.f()}u(p,v,y,g)}if(n){var j=r,M=e.payments[j].date.year(),I=0,Z=0;for(j-=2;e.payments[j].date.year()===M;j--)I+=e.payments[j].interest,Z+=e.payments[j].itemizableInterest;var q=h(e.homeAcquisitionDebt,a.loanAmount);a.interestByYear[0].m1Interest=E(I+e.proRatedInterest),a.interestByYear[0].m1ItemizableInterest=Z+e.proRatedInterest*q;var w=h(a.homeAcquisitionDebt,a.loanAmount);a.interestByYear[0].interest=E(a.interestByYear[0].interest+a.proRatedInterest),a.interestByYear[0].itemizableInterest=E(a.interestByYear[0].itemizableInterest+e.proRatedInterest*q+a.proRatedInterest*w)}if(i)for(var R=C.Z.props[s].standardDeduction,S=0,Y=[e,a];S<Y.length;S++){var W,z=Y[S],B=(0,o.Z)(z.interestByYear);try{for(B.s();!(W=B.n()).done;){var T=W.value,k=R[T.year];T.itemizationNetGain=E(m*Math.max(T.itemizableInterest-Math.max(k-c,0),0))}}catch(F){B.e(F)}finally{B.f()}}}(a),a.netWorthDifferences=function(t){var e=t.m1,a=t.m2,n=t.doItemize,i=t.monthlyRoi,r=t.firstSharedM1Index;!function(t,e){var a=t.initCash+t.initEquity,n=e.initCash+e.initEquity,i=e.payments[0].date.clone().subtract(1,"month"),r=i.valueOf();t.netWorth=[],e.netWorth=[],t.netWorth.push({date:i,unixTimeMs:r,cash:t.initCash,equity:t.initEquity,netWorth:a}),e.netWorth.push({date:i,unixTimeMs:r,cash:e.initCash,equity:e.initEquity,netWorth:n})}(e,a);var o=function(t,e){for(var a=t.monthlyPayment,r=t.initCash,o=t.initCash,s=t.initEquity,c=e;c<t.payments.length;c++){var m=t.payments[c];t.rateAdjust&&m.date.isSame(t.rateAdjust.adjustDate)&&(a=t.rateAdjust.monthlyPayment),r=r-a+o*i,n&&(r+=P(m,t.interestByYear)),s+=m.principal;var u=E(r+s);r=E(r),t.netWorth.push({date:m.date,unixTimeMs:m.unixTimeMs,cash:r,equity:s,netWorth:u}),o=r}};o(e,r),o(a,0);for(var s=[],c=0;c<Math.min(e.netWorth.length,a.netWorth.length);c++)s.push({date:e.netWorth[c].date,unixTimeMs:e.netWorth[c].unixTimeMs,difference:a.netWorth[c].netWorth-e.netWorth[c].netWorth});return s}(a),R(a),a.performanceRanges=function(t){var e,a,n,i=[],r=t[0].date,s=t[t.length-1].date,c=r,m=function(t,e,a){i.push({startDate:t,endDate:e,isPositive:a}),c=e},u=(0,o.Z)(t);try{for(u.s();!(n=u.n()).done;){var h=n.value;e=h.difference>0;var l=0===h.difference;e!==a&&void 0!==a&&m(c,h.date,a),a=l?void 0:e}}catch(d){u.e(d)}finally{u.f()}return m(c,s,a),i}(a.netWorthDifferences);var d,p,y={border:0,fontSize:"initial",padding:0};return(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(s.Z,{variant:"middle"}),(0,B.jsx)("br",{}),(0,B.jsx)("br",{}),(0,B.jsx)(c.Z,{sx:{width:"fit-content",margin:"auto !important"},children:(0,B.jsxs)(m.Z,{children:[(0,B.jsxs)(u.Z,{children:[(0,B.jsx)(h.Z,{sx:(0,i.Z)((0,i.Z)({},y),{},{verticalAlign:"top",whiteSpace:"nowrap"}),children:"Scenario 1:"}),(0,B.jsxs)(h.Z,{sx:y,children:["\xa0",a.isRefinance?"You keep Mortgage 1 instead of refinancing.":"You purchase a home with Mortgage 1."]})]}),(0,B.jsxs)(u.Z,{children:[(0,B.jsx)(h.Z,{sx:(0,i.Z)((0,i.Z)({},y),{},{verticalAlign:"top",whiteSpace:"nowrap"}),children:"Scenario 2:"}),(0,B.jsxs)(h.Z,{sx:y,children:["\xa0",a.isRefinance?"You refinance Mortgage 1 with Mortgage 2.":"You purchase a home with Mortgage 2."]})]})]})}),(0,B.jsx)("br",{}),"The comparison graph below shows the following:",(0,B.jsx)("br",{}),(0,B.jsx)("br",{}),a.performanceRanges.map((function(t,e){return(0,B.jsxs)(b.Fragment,{children:["From ",t.startDate.format("MM-YYYY")," to"," ",t.endDate.format("MM-YYYY"),", Scenario ",t.isPositive?2:1," ","outperforms Scenario ",t.isPositive?1:2,".",(0,B.jsx)("br",{})]},e)})),(0,B.jsx)("br",{}),(0,B.jsx)(g(),{highcharts:f(),options:(p=a.netWorthDifferences,(0,M.Z)(n,{title:{text:"Comparison"},series:[{name:"Net Worth difference",data:p.map((function(t){return{x:t.unixTimeMs,y:t.difference}})),color:Z.grey}],tooltip:{valueDecimals:0}}))}),(0,B.jsxs)("p",{children:['The Comparison graph shows how Scenario 1 and Scenario 2 compare in value over time in terms of Net Worth. Net Worth is defined here as Cash plus Equity -- see below. The graph line values above are "Scenario 2 Net Worth" minus "Scenario 1 Net Worth." So, if a point\'s value is greater than $0, then Scenario 2 is outperforming Scenario 1 at that time (taking into account past performance).',(0,B.jsx)("br",{}),(0,B.jsx)("br",{}),"Note that you can zoom in on graphs by clicking and dragging. You also can show/hide lines by clicking on their legend entries."]}),(0,B.jsx)("br",{}),(0,B.jsx)(g(),{highcharts:f(),options:(d=a.mortgages,(0,M.Z)(n,{title:{text:"Cash & Equity"},series:[].concat((0,D.Z)(d.map((function(t,e){return{name:"Scenario ".concat(t.id," Cash"),data:t.netWorth.map((function(t){return{x:t.unixTimeMs,y:t.cash}})),color:Z.teals[e]}}))),(0,D.Z)(d.map((function(t,e){return{name:"Scenario ".concat(t.id," Equity"),data:t.netWorth.map((function(t){return{x:t.unixTimeMs,y:t.equity}})),color:Z.golds[e]}})))),tooltip:{valueDecimals:0}}))}),(0,B.jsxs)("p",{children:["For each monthly mortgage payment made, Cash goes down by that amount. Equity goes up by the principal portion of the payment. Cash has additional value over time, as it can be invested. To account for the time value of money, each month Cash is multiplied by a monthly ROI value (which is derived from the yearly ROI value supplied above). If Cash is positive, then this value is added to Cash. If Cash is negative, then this value is an opportunity cost that gets subtracted from Cash.",(0,B.jsx)("br",{}),(0,B.jsx)("br",{}),"If this scenario is a refinance, then the starting cash starts off increased by the cash-out amount and equity starts off decreased by the cash-out amount.",(0,B.jsx)("br",{})]}),(0,B.jsx)("br",{}),(0,B.jsx)(g(),{highcharts:f(),options:S(a.mortgages)}),(0,B.jsx)("p",{children:"This graph shows the total mortgage interest paid in each calendar year."}),(0,B.jsx)("br",{}),(0,B.jsx)(g(),{highcharts:f(),options:Y(a.mortgages)}),(0,B.jsx)("p",{children:"This graph shows the outstanding mortgage balances decreasing over time."}),a.mortgages.map((function(t){return(0,B.jsxs)(b.Fragment,{children:[(0,B.jsx)("br",{}),(0,B.jsx)(g(),{highcharts:f(),options:(e=t,(0,M.Z)(n,{chart:{type:"area"},title:{text:"".concat(e.name," Amortization")},plotOptions:{area:{stacking:"normal"},series:{fillOpacity:.15}},series:[{name:"Principal",data:e.payments.map((function(t){return{x:t.unixTimeMs,y:t.principal}})),color:Z.green},{name:"Interest",data:e.payments.map((function(t){return{x:t.unixTimeMs,y:t.interest}})),color:Z.red}],tooltip:{valueDecimals:2}}))}),(0,B.jsxs)("p",{children:["Amortization schedule for Mortgage ",t.id,"."]})]},t.id);var e}))]})}var $=(0,b.memo)(N)}}]);
//# sourceMappingURL=969.c082e7e4.chunk.js.map