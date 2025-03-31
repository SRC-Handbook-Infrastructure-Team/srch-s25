# Group Fairness

Group fairness refers to fairness measures that ensure different demographic groups receive equitable treatment.

## Key Concepts

Group fairness typically looks at statistical measures across protected groups such as:

- Race
- Gender
- Age
- Disability status

## Common Metrics

There are several metrics used to measure group fairness:

1. **Demographic Parity**: The proportion of positive decisions should be equal across groups.

2. **Equal Opportunity**: True positive rates should be equal across groups.

3. **Predictive Parity**: Precision should be equal across groups.

## Limitations

While group fairness is important, it has limitations:

- Different metrics can contradict each other
- Optimizing for group fairness may reduce individual fairness
- Requires clear definitions of protected groups 