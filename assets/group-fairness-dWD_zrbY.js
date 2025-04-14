const r=`# Group Fairness\r
\r
Group fairness refers to fairness measures that ensure different demographic groups receive equitable treatment.\r
\r
## Key Concepts\r
\r
Group fairness typically looks at statistical measures across protected groups such as:\r
\r
- Race\r
- Gender\r
- Age\r
- Disability status\r
\r
## Common Metrics\r
\r
There are several metrics used to measure group fairness:\r
\r
1. **Demographic Parity**: The proportion of positive decisions should be equal across groups.\r
\r
2. **Equal Opportunity**: True positive rates should be equal across groups.\r
\r
3. **Predictive Parity**: Precision should be equal across groups.\r
\r
## Limitations\r
\r
While group fairness is important, it has limitations:\r
\r
- Different metrics can contradict each other\r
- Optimizing for group fairness may reduce individual fairness\r
- Requires clear definitions of protected groups `;export{r as default};
