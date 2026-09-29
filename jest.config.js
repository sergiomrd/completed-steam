module.exports = {
  projects: [
    '<rootDir>/apps/completed-steam/jest.config.js',
    {
      displayName: 'api',
      testMatch: ['<rootDir>/apps/api/**/*.spec.ts'],
      transform: {
        '^.+\\.(ts|js)$': 'ts-jest'
      },
      moduleNameMapper: {
        '^@completed-steam/(.*)$': '<rootDir>/libs/$1/src/index.ts'
      }
    }
  ]
};
