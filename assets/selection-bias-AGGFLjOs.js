const e=`---
title: Selection Bias
---

# Selection Bias (MOCK)

Selection bias occurs when the data used to train algorithms is not representative of the population on which the algorithm will be applied.

## Common Forms of Selection Bias

1. **Sampling Bias**: When certain subgroups are over or underrepresented in the training data
2. **Self-Selection Bias**: When data collection depends on voluntary participation
3. **Coverage Bias**: When data collection methods systematically miss certain groups

## Real-World Example

In healthcare algorithms, models trained primarily on data from academic medical centers may not generalize well to community hospitals, which serve different patient populations. This can lead to models that perform worse for underrepresented groups.

## Mitigation Strategies

- Stratified sampling to ensure representation
- Oversampling underrepresented groups
- Using multiple data sources
- Identifying and addressing gaps in data collection
`;export{e as default};
