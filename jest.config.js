'use strict';

module.exports = {
    verbose: true,
    testEnvironment: 'node',
    setupFilesAfterEnv: [
        'jest-extended'
    ],
    collectCoverage: true,
    coverageReporters: ['json', 'lcov', 'text', 'html'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        '<rootDir>/asset/**/*.ts',
        '!<rootDir>/**/coverage/**',
        '!<rootDir>/**/*.d.ts',
        '!<rootDir>/**/dist/**',
        '!<rootDir>/**/coverage/**'
    ],
    testMatch: [
        '<rootDir>/test/**/*-spec.{ts,js}',
        '<rootDir>/test/*-spec.{ts,js}',
    ],
    preset: 'ts-jest',
    globals: {
        'test-jest': {
            tsConfig: './tsconfig.json',
            diagnostics: true,
            pretty: true,
        },
        ignoreDirectories: ['dist'],
        availableExtensions: ['.js', '.ts']
    }
};
