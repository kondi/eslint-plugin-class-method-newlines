import { TSESLint, ESLintUtils } from '@typescript-eslint/utils';
import { Rule } from 'eslint';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import { ClassBody } from 'estree';

export const createEslintRule = ESLintUtils.RuleCreator((ruleName) => ruleName);

export const RULE_NAME = 'class-method-newlines';
export type Options = [];

const linesBetweenClassMembers = builtinRules.get('lines-between-class-members');

if (!linesBetweenClassMembers) {
  throw new Error(`Missing base rule: 'lines-between-class-members'`);
}

export default createEslintRule<Options, string>({
  name: RULE_NAME,
  meta: {
    type: 'layout',
    docs: {
      description: 'Ensure class methods are preceded by an empty line',
      recommended: false,
    },
    fixable: 'whitespace',
    schema: [],
    messages: linesBetweenClassMembers.meta?.messages || {},
  },
  defaultOptions: [],
  create: (context: Readonly<TSESLint.RuleContext<string, Options>>) => {
    const baseListener = linesBetweenClassMembers.create(context as unknown as Rule.RuleContext);
    return {
      ClassBody(node) {
        const body = node.body.filter((child, index) => {
          const next = node.body[index + 1];
          return !next || next.type !== 'PropertyDefinition';
        });
        if (baseListener.ClassBody) {
          baseListener.ClassBody({ ...node, body } as ClassBody & Rule.Node);
        } else {
          throw new Error(`Missing ClassBody listener for 'lines-between-class-members'`);
        }
      },
    };
  },
});
