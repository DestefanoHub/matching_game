import { describe, expect, test } from "vitest";

describe('Simple test scenario', () => {
    test('a basic test case', () => {
        expect(2+2).toBe(4);
        expect(!true).toBeFalsy();
    });
});