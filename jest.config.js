module.exports = {
  collectCoverage: true,
  coverageDirectory: 'cov',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/lib/'],
  coveragePathIgnorePatterns: ['<rootDir>/lib/'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json'
    }
  }
}
