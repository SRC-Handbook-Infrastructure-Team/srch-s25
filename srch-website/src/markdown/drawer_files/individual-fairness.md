# Individual Fairness

Individual fairness is a fairness criterion that states:

**Similar individuals should receive similar outcomes.**

## Mathematical Definition

Formally, for a decision function f, distance metrics d_X and d_Y, and individuals x and z:

```
d_Y(f(x), f(z)) ≤ d_X(x, z)
```

This means the difference in outcomes should be no greater than the difference between individuals.

## Limitations

- Requires defining similarity metrics
- May not address structural inequalities
- Can conflict with group fairness notions 