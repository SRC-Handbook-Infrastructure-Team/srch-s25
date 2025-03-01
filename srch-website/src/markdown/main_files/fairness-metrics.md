---
category: fairness-metrics
categoryName: Fairness Metrics
categoryOrder: 3
order: 1
---

# Fairness Metrics

Fairness in machine learning and algorithmic systems can be quantified using various metrics. Each metric emphasizes different aspects of fairness and may be appropriate in different contexts.

## Common Fairness Metrics

### Statistical Parity

A decision is fair if the probability of a positive outcome is the same across all protected groups:

P(Ŷ=1|A=a) = P(Ŷ=1|A=a') for all values a, a' of the protected attribute A

### Equal Opportunity

A decision satisfies equal opportunity if the true positive rates are the same across all protected groups:

P(Ŷ=1|Y=1,A=a) = P(Ŷ=1|Y=1,A=a') for all values a, a' of the protected attribute A

### Predictive Parity

A decision satisfies predictive parity if the precision (positive predictive value) is the same across all protected groups:

P(Y=1|Ŷ=1,A=a) = P(Y=1|Ŷ=1,A=a') for all values a, a' of the protected attribute A

### Equalized Odds

Satisfies both equal true positive rates and equal false positive rates across protected groups. [sidebar:Learn More About Equalized Odds](equalized-odds)

## Impossibility Theorems

It's mathematically impossible to satisfy multiple fairness metrics simultaneously when groups have different base rates, unless:

- The classifier is perfect (100% accuracy)
- The classifier is trivial (e.g., all positive or all negative)

This fundamental limitation is known as the [sidebar:fairness impossibility theorem](impossibility-theorem).

## Choosing Appropriate Metrics

When selecting fairness metrics for a specific application, consider:

1. **Domain context**: Different domains may prioritize different aspects of fairness
2. **Stakeholder perspectives**: Different stakeholders may have different fairness concerns
3. **Potential harms**: Choose metrics that address the most serious potential harms
4. **Available data**: Some metrics require access to sensitive attributes that may not be available
5. **Legal requirements**: Certain domains have specific legal requirements for non-discrimination

## Beyond Metrics

While quantitative metrics are useful, they have limitations:

- They may obscure contextual factors
- They focus on specific mathematical properties rather than holistic fairness
- They may not address root causes of unfairness
- They may create a false sense of objectivity

For a comprehensive approach, fairness metrics should be complemented with [sidebar:qualitative fairness assessments](qualitative-assessment).

---

**Related Topics:**

[nav:Algorithmic Fairness](algorithmic-fairness) | [nav:Algorithmic Justice](algorithmic-justice)
