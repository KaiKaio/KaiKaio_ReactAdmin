module.exports = {
  // 为我们提供运行环境，一个环境定义了一组预定义的全局变量
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', './'],
      },
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  // 一个配置文件可以被基础配置中的已启用的规则继承。
  extends: ['plugin:react/recommended', 'airbnb'],
  // 自定义全局变量
  globals: {
    document: true,
    navigator: true,
    fetch: true,
    FormData: true,
    sessionStorage: true,
    localStorage: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    // React内优先使用解构语法
    'react/destructuring-assignment': ['error', 'always'],
    // 强制将无状态React组件编写为纯函数
    'react/prefer-stateless-function': 'warn',
    // 防止使用不安全的target ='_ blank'
    'react/jsx-no-target-blank': 'warn',
    // 禁止在循环中 出现 await
    'no-await-in-loop': 'off',
    // 要求箭头函数的参数使用圆括号
    'arrow-parens': [
      'error',
      'as-needed',
      {
        requireForBlockBody: true,
      },
    ],
    // 注释相关
    'lines-around-comment': [
      'error',
      {
        beforeBlockComment: true, // 要求在块级注释之前有一空行
        allowBlockStart: true, // 允许注释出现在块语句的开始位置
        allowObjectStart: true, // 允许注释出现在对象字面量的开始位置
        allowArrayStart: true, // 允许注释出现在数组字面量的开始位置
        allowClassStart: true, // 允许注释出现在类的开始位置
      },
    ],
    // 禁止混合使用不同的操作符
    'no-mixed-operators': 'off',
    // 禁止使用特定的语法
    'no-restricted-syntax': [
      'error',
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    // 禁止空块语句
    'no-empty': [
      'error', {
        allowEmptyCatch: true, // 允许出现空的 catch 子句
      },
    ],
    // 要求 Switch 语句中有 Default 分支
    'default-case': 'warn',
    // 禁用 console
    'no-console': [
      'error', {
        allow: ['error'], // 是个字符串数组，包含允许使用的console 对象的方法
      },
    ],
    // JSX - Label标签相关
    'jsx-a11y/label-has-associated-control': 'warn',
    'jsx-a11y/label-has-for': 'warn',

    // 禁止未使用过的表达式
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true, // 将允许你在表达式中使用逻辑短路求值
        allowTernary: true, // 将允许你在表达式中使用类似逻辑短路求值的三元运算符
      },
    ],

    // 禁止对函数参数再赋值
    'no-param-reassign': [
      'error',
      {
        props: true,
      },
    ],

    // 禁止未使用过的变量
    'no-unused-vars': [
      'error',
      {
        args: 'none', // 参数不检查
        varsIgnorePattern: '[wW]indow',
      },
    ],

    // 禁止使用一元操作符 ++ 和 --
    'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
    // 允许使用For in
    'guard-for-in': 'off',

    /**
     * 关于 react/no-did-update-set-state
     * 禁止在didUpdate周期中执行setState
     * 原本是error的，我将它调整为warn级别
     * 本意是不允许在didUpdate的时候再进行setState，因为会导致重复渲染，消耗性能
     * 如果在didUpdate中不加条件地进行setState，就会直接导致死循环
     * 通常在didUpdate中执行setState的目的是，根据某个状态的变化，同步修改另一个状态，这种场景建议使用getDerivedStateFromProps实现
     *
     * 事实上，将setState的操作单独提取到独立的函数中，这条规则就无法检测到了，所以规则本身比较鸡肋，它能只能检测表象，但换个写法就不行了
     */
    'react/no-did-update-set-state': 'warn',

    /* 优化jsx换行的排版 */
    'react/jsx-wrap-multilines': 'error',

    /* 禁止使用已过时的生命周期 */
    'react/no-deprecated': 'error',

    /* 禁止使用this.refs */
    'react/no-string-refs': 'error',

    /* 禁止在成员方法中，出现没有引用this的无意义成员方法 */
    'react/no-this-in-sfc': 'error',

    /* 禁止直接对state赋值，需要使用setState */
    'react/no-direct-mutation-state': 'error',

    /* 防止关键属性大小写拼错 */
    'react/no-typos': 'error',

    /* 禁止给DOM节点添加不存在的属性 */
    'react/no-unknown-property': 'error',

    /* 禁止在内容中直接使用保留字符 */
    'react/no-unescaped-entities': 'error',

    /* 强制要求style属性的类型为object */
    'react/style-prop-object': 'error',

    /* 强制要求jsx中嵌入js表达式时，大括号需要换行 */
    'react/jsx-curly-newline': 'error',
    'react/jsx-curly-spacing': ['error', { children: true }],
    'react/jsx-indent': [
      'error',
      2,
      {
        checkAttributes: true,
        indentLogicalExpressions: true,
      },
    ],
    'react/jsx-one-expression-per-line': ['error'],
    // 禁止变量声明覆盖外层作用域的变量
    'no-shadow': 'warn',

    // https://stackoverflow.com/a/64024916/3872362
    // 解决 React 引用报错问题
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],

    'react/jsx-filename-extension': [
      2,
      {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
        ],
      },
    ],
    'no-underscore-dangle': [
      'error',
      {
        allow: ['_id', '__POWERED_BY_QIANKUN__'],
      },
    ],
  },
};
