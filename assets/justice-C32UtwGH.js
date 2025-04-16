const e=`---\r
title: Justice\r
order: 2\r
---\r
\r
# Concepts of Justice in AI\r
\r
Justice in automated decision-making systems extends beyond identifying isolated instances of\r
bias or harm. It requires critical examination of how these systems mirror inequalities and\r
inequities in the broader world that they aim to encode.\r
\r
## Types of Justice\r
\r
While many variations of justice exist in the context of legal studies and political science, when\r
examining automated decision-making scenarios, two broad categories consistently emerge:\r
**distributive justice** and **procedural justice**.\r
\r
- **Distributive Justice**: Fair distribution of resources, opportunities, or benefits in AI outputs by ensuring that outcomes do not perpetuate existing inequities or systemic discrimination.\r
- **Procedural Justice**: Insurance that all individuals and groups are respected and valued in automated decision-making processes.\r
\r
### Distributive Justice (Outcome-Focused)\r
\r
Distributive justice in automated decision-making emphasizes the equitable allocation of\r
resources, opportunities, and benefits in order to address and counteract systemic\r
discrimination and historical inequalities embedded in society. However, not all justice-related\r
efforts explicitly target these systemic concerns; different frameworks may instead prioritize\r
other aspects of fairness. Despite these variations, three (sometimes conflicting) conceptions\r
of distributive justice demonstrate distinct ways to assess automated decision-making\r
systems: **sufficiency**, **priority**, and **equality of opportunity**.\r
\r
#### Sufficiency\r
\r
The principle of **sufficiency** emphasizes ensuring that all individuals or groups receive a\r
minimum acceptable threshold of resources and opportunities, and guarantees that no one falls\r
below an ethically justifiable threshold. Rather than focusing on equal outcomes, sufficiency\r
prioritizes meeting fundamental needs first, which helps protect the most vulnerable individuals\r
from harm. In the context of automated decision-making, this approach ensures that AI systems\r
explicitly embed minimum ethical standards into their predictions and allocations.\r
\r
[drawer:Case Study: Annie MOORE](annie-moore)\r
\r
#### Priority\r
\r
The principle of **priority** focuses on the allocation of resources and opportunities to individuals or groups in order to address existing disparities or urgent needs. This approach recognizes that certain populations may require more immediate or substantial support to achieve equitable outcomes. In automated decision-making, priority ensures that AI systems can identify and respond to these critical needs.\r
\r
[drawer:Case Study: SafeRent Solutions AI Scoring System](saferent-solutions)\r
[drawer:Case Study: AI Tools for LA Housing](la-housing-pilot)\r
\r
#### Equality of Opportunity\r
\r
**Equality of opportunity** ensures that all individuals have fair access to resources and\r
opportunities, regardless of their background. This principle aims to remove barriers that\r
prevent equitable participation and advancement in society. In the context of AI, equality of\r
opportunity involves designing systems that (a) do not perpetuate existing biases that reflect\r
morally arbitrary characteristics (e.g., race, gender) and (b) actively promote inclusivity.\r
\r
[drawer:Case Study: Algorithmic Justice League](ajl)\r
\r
#### Key Questions for Distributive Justice\r
\r
The following questions are meant to help diagnose whether an AI system is distributing\r
benefits and burdens fairly while spotlighting who gains, who loses, and why:\r
\r
- Do particular individuals or communities receive a disproportionate share of resources,\r
  opportunities, or risks?\r
- What trade-offs, if any, exist between the three tenets of distributive justice\r
  (i.e., sufficiency, priority, and equality of opportunity)?\r
- Does the AI’s design explicitly account for differences in social, economic, or political\r
  advantages?\r
\r
### Procedural Justice (Process-Focused)\r
\r
Individuals’ perceptions of procedurally just encounters are based on four central features of\r
their interactions with any decision-maker, whether that be a legal authority, corporate system,\r
community institution, or an algorithm: **neutrality**, **respect**, **voice**, and **trustworthiness**.\r
\r
![Procedural Justice Graphic](/srch-s25/src/assets/primer-photos/yls_procedural_justice.png)\r
*Figure from Yale Law School representing the four pillars of procedural justice.*\r
\r
When considering the role of algorithms as automated decision-makers capable of making\r
authoritative decisions, these core features of procedural justice remain relevant.\r
\r
- **Neutrality**: An algorithm shows neutrality when its decision rules are consistent,\r
  evidence‑based, and free from hidden biases. Practically, that means using validated\r
  features, documenting all preprocessing steps, stress‑testing for disparate impact, and\r
  publishing model cards so outsiders can see the logic. If two applicants present the\r
  same relevant facts, the system should reach the same conclusion every time and be\r
  able to demonstrate that consistency under audit.\r
\r
[drawer:Case Study: Shapley Values for Credit Scores](shapley-neutrality)\r
\r
- **Respect**: Respect in an automated setting is largely conveyed through user experience\r
  and data handling. Interfaces should provide plain‑language explanations, avoid\r
  dark‑pattern nudges, and accommodate accessibility needs (e.g., screen‑reader\r
  compatibility, multiple languages). On the back end, respect for users also means\r
  collecting only the data strictly necessary for the task and safeguarding it with strong\r
  privacy controls.\r
\r
[drawer:Case Study: SCHUFA](schufa-respect)\r
\r
- **Voice**: Algorithms can’t “listen,” but their designers can build structured channels for\r
  voice: pre‑deployment participatory design sessions, in‑app feedback forms, and\r
  post‑decision appeal mechanisms that route complaints to a human reviewer. Logging\r
  those interactions and feeding validated issues back into model retraining turns user\r
  voice into a live governance signal rather than a box‑checking exercise.\r
\r
[drawer:Case Study: Wikimedia Value-Sensitive Algorithm](wikimedia-voice)\r
\r
- **Trustworthiness**: Trustworthiness emerges when system owners act and are seen to act\r
  in the public’s interest. Concretely, that involves open sourcing evaluation code where\r
  possible, publishing third‑party audit reports, disclosing conflicts of interest, and\r
  committing to sunset or retrain the model when context shifts. Regular transparency\r
  updates signal that the algorithm’s creators are motivated by fairness and public\r
  well‑being, not just efficiency or profit.\r
\r
[drawer:Case Study: Pymetrics Independent Audit](pymetrics-trust)\r
\r
It is crucial to scrutinize automated decision-making algorithms through this procedural justice\r
framework to ensure they are designed and implemented in ways that uphold respect,\r
demonstrate neutrality, amplify individual and community voices, and foster trust in the\r
institutions that employ them.\r
\r
#### Key Questions for Procedural Justice\r
\r
The following questions are meant to help gauge whether an AI system’s decision‑making\r
process is procedurally just:\r
\r
- Are individuals treated with dignity and respect in automated decision-making processes\r
  and outcomes?\r
- Is there clear communication about why the system is making certain decisions?\r
- Can individuals contest the AI system’s decisions, and are those processes accessible\r
  and fair?\r
- Do appropriate mechanisms for accountability (e.g. effective auditing) exist?\r
\r
## Mechanisms for Algorithmic Accountability\r
\r
Justice in automated decision-making requires mechanisms that reinforce the core tenets of\r
distributive justice and procedural justice. Mechanisms for algorithmic accountability serve\r
this critical role by establishing practices and safeguards to assess, maintain, and enhance\r
distributive and procedural justice throughout the decision-making process.\r
\r
### Independent Auditing\r
\r
Due to the continuous negative impact of biases originating from automated decision-making\r
systems, a recurring theme when discussing algorithmic accountability is the need for\r
third-party, external auditing as a counterbalance to purely internal oversight. External auditors\r
can help:\r
\r
1. Identify overlooked biases that in-house teams might miss due to organizational blind\r
   spots or conflicts of interest.\r
2. Establish trust among affected communities because independent assessments\r
   increase transparency and legitimacy.\r
3. Create standardized governance practices across different industries and use cases,\r
   which will improve fairness metrics over time.\r
\r
Independent external oversight is most effective when auditors can reliably access relevant data\r
or model outputs. However, many external auditors face barriers like restricted APIs or\r
excessive legal hurdles, which limit their ability to test for bias or harmful outcomes. Without a\r
clear path to the necessary information, audits risk being reduced to surface-level checks that\r
fail to address deeper, systemic issues, a phenomenon referred to as audit washing.\r
\r
### Institutional Accountability\r
\r
Holding a single developer accountable for biased code may do little to fix the deeper systemic\r
forces that shaped that bias in the first place. Therefore, it is crucial to spotlight the\r
responsibility of governments, large organizations, and social institutions, rather than just “bad\r
actors.” The obligation is on these groups as collectives rather than individual developers and\r
deployers of AI models to mitigate harm and ensure compliance with anti-discrimination\r
standards. Rather than imposing blanket liability on developers, lawmakers should focus on the\r
actual use cases to better tackle the root causes of AI bias and foster accountable AI\r
deployments.\r
\r
[drawer:Case Study: Timnit Gebru’s Google Exit](timnit-gebru)\r
\r
## Tradeoffs between Efficiency and Bias\r
\r
The bias-efficiency tradeoff highlights tensions in algorithmic decision-making between\r
optimizing for performance, cost, savings, and scale, while upholding justice. Algorithms provide\r
quick and cost-effective decisions, but these efficiencies can magnify social biases and overlook\r
local contexts, particularly when:\r
\r
- Historical data reflect systemic discrimination.\r
- Design priorities emphasize speed, profit, or scalability at the expense of nuanced, local\r
  fairness considerations.\r
- Protected groups are indirectly penalized by proxy methods (e.g., [Bayesian Improved\r
  Surname Geocoding](https://www.rand.org/health-care/tools-methods/bisg.html)).\r
- Large-scale models adopt reductionist approaches that fail to account for local\r
  community needs (e.g., environmental costs).\r
\r
[drawer:Case Study: Biased Car Insurance Premiums in Michigan](car-insurance)\r
\r
## Glossary\r
\r
- **Algorithmic Accountability**: Concept for ensuring automated decision-making systems operate ethically and transparently, with mechanisms (e.g., audits) to identify and mitigate injustices.\r
- **Audit Washing**: Superficial or ineffective audits that give a misleading impression of fairness without addressing systemic issues.\r
- **Bias**: Systematic unfairness in decision-making systems, based on superficial or inaccurate assumptions, leading to disproportionate harm or advantage for certain groups.\r
- **Bias-Efficiency Tradeoff**: Tension between achieving efficiency through automated systems and the potential amplification of biases or injustices.\r
- **Distributive Justice**: Fair allocation of resources and opportunities to address systemic discrimination and inequalities.\r
- **Equality of Opportunity**: Guaranteeing fair access to resources and opportunities regardless of background or identity.\r
- **Harm**: Negative consequences resulting from biased or unjust automated decisions.\r
- **Independent Auditing**: The practice of having neutral, third-party experts evaluate AI models and decisions for potential biases or harms.\r
- **Justice**: Fair treatment ensuring equitable processes and outcomes in automated decision-making.\r
- **Neutrality**: Central feature of procedural justice; ensuring impartiality and unbiased treatment within automated decisions.\r
- **Priority**: Preferential allocation of resources to groups or individuals facing the most urgent needs or significant disadvantages.\r
- **Procedural Justice**: Fairness in the processes that lead to automated decisions, emphasizing respect, neutrality, voice, and trustworthiness.\r
- **Respect**: Treating individuals with dignity and valuing their rights within decision-making processes.\r
- **Sufficiency**: Ensuring all individuals receive a minimum acceptable level of resources or opportunities to meet fundamental needs.\r
- **Trustworthiness**: Establishing confidence in automated systems by maintaining transparency, fairness, and accountability.\r
- **Voice**: Providing individuals the opportunity to express concerns or contest decisions made by algorithms.\r
\r
## References\r
\r
- Angwin, Julia, Jeff Larson, Surya Mattu, and Lauren Kirchner. “Machine Bias.” *ProPublica*, May 23, 2016. https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing.\r
- Appel, Ruth E. “Strengthening AI Accountability Through Better Third Party Evaluations.” *Stanford Institute for Human-Centered Artificial Intelligence*, November 6, 2024. https://hai.stanford.edu/news/strengthening-ai-accountability-through-better-third-party-evaluations.\r
- Barocas, Solon, and Andrew D. Selbst. “Big Data’s Disparate Impact.” *California Law Review* 104, no. 3 (2016): 671–732. https://dx.doi.org/10.2139/ssrn.2477899.\r
- Bukoski, Michael. “Moral Uncertainty and Distributive Sufficiency.” *Ethical Theory and Moral Practice* 24, no. 4 (2021): 949+. https://link.gale.com/apps/doc/A683675865/AONE?u=anon~671d731&sid=googleScholar&xid=9f3ccaee.\r
- Buolamwini, Joy, dir. *Coded Bias* [Film]. 7th Empire Media, 2020.\r
- Elford, Gideon. “Equality of Opportunity.” In *The Stanford Encyclopedia of Philosophy*, Fall 2023 Edition, edited by Edward N. Zalta and Uri Nodelman. https://plato.stanford.edu/archives/fall2023/entries/equal-opportunity/.\r
- Goodman, Ellen P., and Julia Tréhu. “AI Audit-Washing and Accountability.” *German Marshall Fund of the United States*, November 2022. https://www.gmfus.org/news/ai-audit-washing-and-accountability.\r
- Holtug, Nils. “Prioritarianism.” In *Oxford Research Encyclopedia of Politics*. Oxford University Press, 2017. https://doi.org/10.1093/acrefore/9780190228637.013.232.\r
- Kaufman, Alexander. “Distributive Justice, Theories of.” In *Encyclopedia of Applied Ethics* (Second Edition), edited by Ruth Chadwick, 842–850. Academic Press, 2012. https://doi.org/10.1016/B978-0-12-373932-2.00227-1.\r
- Kroll, Joshua A., Joanna Huey, Solon Barocas, Edward W. Felten, Joel R. Reidenberg, David G. Robinson, and Harlan Yu. “Accountable Algorithms.” *University of Pennsylvania Law Review* 165, no. 3 (2017): 633–705. https://scholarship.law.upenn.edu/penn_law_review/vol165/iss3/3/.\r
- RAND Corporation. "Bayesian Improved Surname Geocoding (BISG)." *RAND Health Care*. Accessed April 14, 2025. https://www.rand.org/health-care/tools-methods/bisg.html.\r
- Stanford Law School. “Bias in Large Language Models and Who Should Be Held Accountable.” Accessed April 14, 2025. https://law.stanford.edu/press/bias-in-large-language-models-and-who-should-be-held-accountable/.\r
- Stern, Carly. “LA Thinks AI Could Help Decide Which Homeless People Get Scarce Housing – and Which Don’t.” *Vox*, December 6, 2024. https://www.vox.com/the-highlight/388372/housing-policy-los-angeles-homeless-ai.\r
- University of Oxford. *How AI Is Improving Outcomes for Resettled Refugees: The Annie™ MOORE Project*. 2022. https://www.economics.ox.ac.uk/annie-moore-increasing-employment-of-resettled-refugees-using-matching-machine-learning-and-integer.\r
- Yale Law School. “Procedural Justice in Legal Processes.” Accessed April 14, 2025. https://law.yale.edu/justice-collaboratory/procedural-justice.\r
- Zou, James, and Londa Schiebinger. “AI Can Be Sexist and Racist—It’s Time to Make It Fair.” *Nature* 559, no. 7714 (2018): 324–326. https://doi.org/10.1038/d41586-018-05707-8.`;export{e as default};
