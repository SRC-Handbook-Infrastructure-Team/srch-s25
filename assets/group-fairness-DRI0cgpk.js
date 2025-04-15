const e=`---
title: Group Fairness
---

# Group Fairness (MOCK)

Group fairness focuses on ensuring that protected groups (defined by attributes like race, gender, age, etc.) receive equitable treatment or outcomes from algorithmic systems.

## Common Group Fairness Metrics

### Demographic Parity

Requires that the probability of a positive outcome is the same across all protected groups.

Mathematically: P(Ŷ=1|A=a) = P(Ŷ=1|A=b) for all groups a,b

### Equal Opportunity

Requires equal true positive rates across protected groups.

Mathematically: P(Ŷ=1|Y=1,A=a) = P(Ŷ=1|Y=1,A=b) for all groups a,b

### Equalized Odds

Requires equal true positive rates AND equal false positive rates across protected groups.

## Limitations

Different group fairness metrics can be mutually incompatible, making it impossible to satisfy all of them simultaneously unless the base rates of the outcome variable are the same across groups.

## Example

In a hiring algorithm, demographic parity would require that the percentage of candidates selected from each gender group be equal, while equal opportunity would require that the percentage of qualified candidates selected from each group be equal.
`;export{e as default};
