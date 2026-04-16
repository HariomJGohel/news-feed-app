module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-async-storage|@react-native-community/netinfo|@react-native-vector-icons|zustand|axios)/)',
  ],
  moduleNameMapper: {
    // Stub binary assets so Jest doesn't try to parse them
    '\\.ttf$': '<rootDir>/__mocks__/fileMock.js',
    '\\.png$': '<rootDir>/__mocks__/fileMock.js',
    '\\.jpg$': '<rootDir>/__mocks__/fileMock.js',
    // @/ path alias
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
