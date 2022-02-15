import { TSESLint } from '@typescript-eslint/utils';

import rule, { RULE_NAME } from '../../src/rules/class-method-newlines';

const ruleTester: TSESLint.RuleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

const invalidStatements = [
  `// Errors: 1
  export class MyClass {
    method1() {}
    method2() {}
  }
  `,
  `// Errors: 1
  export class MyClass {
    field1 = true;
    method1() {}
  }
  `,
  `// Errors: 1
  export class MyClass {
    method1() {}
    field1 = true;
    method2() {}
  }
  `,
  `// Errors: 4
  export class MyClass {
    field1 = true;
    field2 = 2;
    method1() {}
    method2() {}
    method3() {
      console.log('method3');
    }
    method4() {
      console.log('method4');
    }
  }
  `,
];

const validStatements = [
  `
  export class MyClass {
    method1() {}

    method2() {}
  }
  `,
  `
  export class MyClass {
    field1 = true;

    method1() {}
  }
  `,
  `
  export class MyClass {
    method1() {}
    field1 = true;

    method2() {}
  }
  `,
  `
  export class MyClass {
    field1 = true;
    field2 = 2;

    method1() {}

    method2() {}

    method3() {
      console.log('method3');
    }

    method4() {
      console.log('method4');
    }
  }
  `,
  `
  export class MyClass {
    method1() {}
  }
  `,
];

ruleTester.run(RULE_NAME, rule, {
  valid: validStatements,
  invalid: invalidStatements.map((invalid, index) => {
    const errorCount = Number(invalid.match(/\d+/)?.[0]);
    invalid = invalid.replace(/\/\/ Errors: \d+/, '');
    return {
      code: invalid,
      errors: Array(errorCount).fill({ messageId: 'always' }),
      output: validStatements[index],
    };
  }),
});
