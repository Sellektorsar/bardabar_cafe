import { expect } from "expect";
import { getMenuCategories } from "./api";

async function testGetMenuCategories() {
  const categories = await getMenuCategories();
  
  // Verify that the function returns an array
  expect(Array.isArray(categories)).toBe(true);
  
  // If there are categories, verify they have the expected structure
  if (categories.length > 0) {
    const category = categories[0];
    expect(category).toHaveProperty("id");
    expect(category).toHaveProperty("name");
    expect(category).toHaveProperty("order");
    expect(typeof category.id).toBe("string");
    expect(typeof category.name).toBe("string");
    expect(typeof category.order).toBe("number");
  }
}

type TestResult = {
  passedTests: string[];
  failedTests: { name: string; error: string }[];
};

export async function _runApiTests() {
  const result: TestResult = { passedTests: [], failedTests: [] };

  const testFunctions = [testGetMenuCategories];

  const finalResult = await testFunctions.reduce(
    async (promisedAcc, testFunction) => {
      const acc = await promisedAcc;
      try {
        await testFunction();
        return {
          ...acc,
          passedTests: [...acc.passedTests, testFunction.name],
        };
      } catch (error) {
        return {
          ...acc,
          failedTests: [
            ...acc.failedTests,
            {
              name: testFunction.name,
              error: error instanceof Error ? error.message : "Unknown error",
            },
          ],
        };
      }
    },
    Promise.resolve(result),
  );

  return finalResult;
}