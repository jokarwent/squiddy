module.exports = {
  testTimeout: 10000,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'scss'],
  modulePathIgnorePatterns: ['node_modules', '.history'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  verbose: true,
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy'
  },
  testEnvironment: 'node'
}
