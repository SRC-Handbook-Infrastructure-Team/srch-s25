const i=`# Individual Fairness\r
\r
Individual fairness is a fairness criterion that states:\r
\r
**Similar individuals should receive similar outcomes.**\r
\r
## Mathematical Definition\r
\r
Formally, for a decision function f, distance metrics d_X and d_Y, and individuals x and z:\r
\r
\`\`\`\r
d_Y(f(x), f(z)) ≤ d_X(x, z)\r
\`\`\`\r
\r
This means the difference in outcomes should be no greater than the difference between individuals.\r
\r
## Limitations\r
\r
- Requires defining similarity metrics\r
- May not address structural inequalities\r
- Can conflict with group fairness notions `;export{i as default};
