# Equalized Odds

Equalized Odds is a fairness criterion that requires equal true positive rates and equal false positive rates across different protected groups.

## Mathematical Definition

A classifier satisfies equalized odds if for all values of the protected attribute `A` and for the true outcome `Y`:

- P(Ŷ=1|Y=1,A=a) = P(Ŷ=1|Y=1,A=a') for all a, a' (Equal true positive rates)
- P(Ŷ=1|Y=0,A=a) = P(Ŷ=1|Y=0,A=a') for all a, a' (Equal false positive rates)

## Intuitive Understanding

Equalized odds ensures that:
- Among people who truly belong to the positive class, the probability of being correctly classified is the same across all groups
- Among people who truly belong to the negative class, the probability of being incorrectly classified is the same across all groups

## Advantages

- Ensures that prediction errors are distributed equally across protected groups
- Prevents the system from systematically disadvantaging specific groups through higher error rates
- Compatible with optimal prediction in cases where the base rates are equal
- Addresses concerns about groups facing different risks of false positives or false negatives

## Limitations

- Incompatible with other fairness criteria when base rates differ between groups
- May require lowering overall accuracy to achieve equalized error rates
- Doesn't guarantee individual-level fairness
- May not fully address underlying social inequities that caused the different base rates

## Implementation Approaches

Several methods exist to achieve equalized odds:

1. **Post-processing**: Adjusting decision thresholds differently for each group
2. **In-processing**: Adding regularization terms to the optimization objective during training
3. **Pre-processing**: Transforming the input features to remove information about protected attributes
4. **Adversarial techniques**: Training models that predict outcomes but cannot predict protected attributes

## Applications

Equalized odds is particularly relevant in contexts where false positives and false negatives have significant consequences, such as:

- Criminal justice risk assessments
- Medical diagnosis
- Fraud detection systems
- Loan approval systems