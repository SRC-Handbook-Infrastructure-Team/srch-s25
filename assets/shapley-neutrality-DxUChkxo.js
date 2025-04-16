const e=`## Case Study: Shapley Values for Credit Scores\r
Traditional credit scorecards have used logistic regression models because their decision-making processes offer interpretability. However, more powerful machine learning models like XGBoost and random forest algorithms typically offer superior predictive accuracy at the cost of interpretability. This tradeoff creates a neutrality problem as decisions become opaque. Researchers addressed this challenge by developing a novel framework using Shapley values to create interpretable credit scorecards that maintain the predictive power of advanced models.\r
\r
The Shapley values approach works by deriving credit scores for each predictor variable group in complex models like XGBoost and random forest. This method provides a mathematical guarantee that the contribution of each feature to the final decision is fairly allocated, which ensures consistency across applications. Researchers showed that removing discriminatory features like age and gender didn't significantly impact classification capabilities, proving that neutral credit scoring systems could achieve high accuracy without compromising fairness.\r
\r
This approach to neutrality satisfies the technical requirements of consistency and evidence-based decision-making while also making the rules transparent enough for outsiders to verify the logic. The mathematically rigorous allocation of feature importance ensures that if two loan applicants present identical relevant facts, they will receive identical scores.\r
\r
[Further Reading](https://pmc.ncbi.nlm.nih.gov/articles/PMC11318906/)`;export{e as default};
