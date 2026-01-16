module.exports = {
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/shared/(.*)$': '<rootDir>/shared/$1',
    '^@/widgets/(.*)$': '<rootDir>/widgets/$1',
    '^@/entities/(.*)$': '<rootDir>/entities/$1',
    '^@/features/(.*)$': '<rootDir>/features/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
      diagnostics: false,
    }],
  },

  testMatch: [
    '<rootDir>/**/*.test.{ts,tsx}',
    '!<rootDir>/node_modules/**',
    '!<rootDir>/.next/**',
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  verbose: true,
  maxWorkers: '50%',
  testTimeout: 10000,
  clearMocks: true,
  restoreMocks: true,
}
