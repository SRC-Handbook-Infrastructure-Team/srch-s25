# Protected Attributes

Protected attributes (also called protected characteristics or sensitive attributes) are features of individuals that are legally protected from discrimination in many jurisdictions.

## Common Protected Attributes

While specific legal protections vary by jurisdiction and context, commonly protected attributes include:

- Race and ethnicity
- Sex and gender identity 
- Age
- Disability status
- Religion
- National origin
- Sexual orientation
- Marital status
- Genetic information
- Veteran status

## Legal Frameworks

Different legal frameworks protect these attributes in different contexts:

- **United States**: Various laws including Civil Rights Act, Americans with Disabilities Act, Age Discrimination in Employment Act
- **European Union**: General Data Protection Regulation (GDPR) and various directives
- **Canada**: Canadian Human Rights Act and provincial codes
- **International**: Universal Declaration of Human Rights

## Algorithmic Considerations

When designing fair algorithms, considerations around protected attributes include:

1. **Whether to use protected attributes**: Some approaches explicitly use protected attributes to measure and mitigate bias, while others avoid their use entirely
2. **Proxy variables**: Features that correlate with protected attributes can introduce bias even when protected attributes are excluded
3. **Intersectionality**: People at intersections of multiple protected attributes may face unique forms of discrimination that aren't captured by considering attributes in isolation
4. **Data collection concerns**: Collecting protected attribute data raises privacy concerns and may be restricted

## Fairness Without Protected Attributes

In some jurisdictions, collecting data on protected attributes is legally restricted. Approaches to achieve fairness without using protected attributes include:

1. **Fairness Through Unawareness**: Excluding protected attributes from the model (though this is generally insufficient due to proxy variables)
2. **Adversarial Debiasing**: Training models to predict outcomes while preventing prediction of protected attributes
3. **Distribution-Based Approaches**: Ensuring similar distribution of predictions across different segments of the population
4. **Counterfactual Fairness**: Ensuring predictions would remain the same in counterfactual worlds where protected attributes are changed