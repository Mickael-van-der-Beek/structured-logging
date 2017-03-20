module.exports = config => {
  config.set({
    files: [
        { pattern: 'lib/**/*.js', mutated: true, included: false },
        { pattern: 'test/**/*.js', mutated: false, included: true },
        { pattern: 'test/helpers/**/*.js', mutated: false, included: false }
    ],
    testRunner: 'mocha',
    testFramework: 'mocha',
    coverageAnalysis: 'perTest',
    reporter: ['clear-text', 'progress']
  });
};
