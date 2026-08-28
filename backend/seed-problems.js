/**
 * seed-problems.js — Seeds 10 complete DSA problems into MongoDB
 * Usage: node seed-problems.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Problem  = require("./src/models/Problem");
const User     = require("./src/models/User");

const PROBLEMS = [
  // ──────────────────────────────────────────────────────────────────
  // 1. Two Sum
  // ──────────────────────────────────────────────────────────────────
  {
    title: "Two Sum",
    difficulty: "easy",
    tags: ["array", "hash-map"],
    description:
      "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9",  output: "[0,1]",  explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6",       output: "[1,2]",  explanation: "nums[1] + nums[2] = 2 + 4 = 6." },
      { input: "nums = [3,3], target = 6",          output: "[0,1]",  explanation: "" },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    testCases: [
      { input: "[2,7,11,15]\n9",  expected: "[0,1]" },
      { input: "[3,2,4]\n6",      expected: "[1,2]" },
      { input: "[3,3]\n6",        expected: "[0,1]" },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your solution here
};`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Your solution here
    pass`,
      java: `import java.util.*;
class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
        return new int[]{};
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your solution here
    return {};
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
    // Your solution here
    return [];
};`,
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 2. Valid Parentheses
  // ──────────────────────────────────────────────────────────────────
  {
    title: "Valid Parentheses",
    difficulty: "easy",
    tags: ["string", "stack"],
    description:
      "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      { input: 's = "()"',      output: "true",  explanation: "" },
      { input: 's = "()[]{}"',  output: "true",  explanation: "" },
      { input: 's = "(]"',      output: "false", explanation: "" },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    testCases: [
      { input: "()",       expected: "true"  },
      { input: "()[]{}",   expected: "true"  },
      { input: "(]",       expected: "false" },
      { input: "([)]",     expected: "false" },
      { input: "{[]}",     expected: "true"  },
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Your solution here
};`,
      python: `def is_valid(s: str) -> bool:
    # Your solution here
    pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Your solution here
        return false;
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

bool isValid(string s) {
    // Your solution here
    return false;
}`,
      typescript: `function isValid(s: string): boolean {
    // Your solution here
    return false;
};`,
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 3. Maximum Subarray
  // ──────────────────────────────────────────────────────────────────
  {
    title: "Maximum Subarray",
    difficulty: "medium",
    tags: ["array", "dynamic-programming", "divide-and-conquer"],
    description:
      "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6",  explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]",                       output: "1",  explanation: "The subarray [1] has the largest sum 1." },
      { input: "nums = [5,4,-1,7,8]",              output: "23", explanation: "The subarray [5,4,-1,7,8] has the largest sum 23." },
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
    ],
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6"  },
      { input: "[1]",                       expected: "1"  },
      { input: "[5,4,-1,7,8]",              expected: "23" },
      { input: "[-1,-2,-3]",               expected: "-1" },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // Your solution here (Kadane's Algorithm)
};`,
      python: `def max_sub_array(nums: list[int]) -> int:
    # Your solution here (Kadane's Algorithm)
    pass`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Your solution here
        return 0;
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Your solution here
    return 0;
}`,
      typescript: `function maxSubArray(nums: number[]): number {
    // Your solution here
    return 0;
};`,
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 4. Climbing Stairs
  // ──────────────────────────────────────────────────────────────────
  {
    title: "Climbing Stairs",
    difficulty: "easy",
    tags: ["dynamic-programming", "math", "memoization"],
    description:
      "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2", explanation: "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps" },
      { input: "n = 3", output: "3", explanation: "There are three ways:\n1. 1+1+1 steps\n2. 1+2 steps\n3. 2+1 steps" },
    ],
    constraints: ["1 <= n <= 45"],
    testCases: [
      { input: "2",  expected: "2"  },
      { input: "3",  expected: "3"  },
      { input: "5",  expected: "8"  },
      { input: "10", expected: "89" },
    ],
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // Your solution here
};`,
      python: `def climb_stairs(n: int) -> int:
    # Your solution here
    pass`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Your solution here
        return 0;
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int climbStairs(int n) {
    // Your solution here
    return 0;
}`,
      typescript: `function climbStairs(n: number): number {
    // Your solution here
    return 0;
};`,
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 5. Binary Search
  // ──────────────────────────────────────────────────────────────────
  {
    title: "Binary Search",
    difficulty: "easy",
    tags: ["array", "binary-search"],
    description:
      "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`.\n\nIf `target` exists, return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9",  output: "4",  explanation: "9 exists in nums and its index is 4." },
      { input: "nums = [-1,0,3,5,9,12], target = 2",  output: "-1", explanation: "2 does not exist in nums so return -1." },
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    testCases: [
      { input: "[-1,0,3,5,9,12]\n9",  expected: "4"  },
      { input: "[-1,0,3,5,9,12]\n2",  expected: "-1" },
      { input: "[5]\n5",              expected: "0"  },
      { input: "[5]\n-5",             expected: "-1" },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  // Your solution here
};`,
      python: `def search(nums: list[int], target: int) -> int:
    # Your solution here
    pass`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Your solution here
        return -1;
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int search(vector<int>& nums, int target) {
    // Your solution here
    return -1;
}`,
      typescript: `function search(nums: number[], target: number): number {
    // Your solution here
    return -1;
};`,
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 6. Reverse Linked List
  // ──────────────────────────────────────────────────────────────────
  {
    title: "Reverse Linked List",
    difficulty: "easy",
    tags: ["linked-list", "recursion"],
    description:
      "Given the head of a singly linked list, reverse the list, and return the reversed list.\n\nExample: 1 → 2 → 3 → 4 → 5 becomes 5 → 4 → 3 → 2 → 1.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "" },
      { input: "head = [1,2]",       output: "[2,1]",        explanation: "" },
      { input: "head = []",           output: "[]",           explanation: "" },
    ],
    constraints: [
      "The number of nodes in the list is in the range [0, 5000].",
      "-5000 <= Node.val <= 5000",
    ],
    testCases: [
      { input: "[1,2,3,4,5]", expected: "[5,4,3,2,1]" },
      { input: "[1,2]",       expected: "[2,1]"        },
      { input: "[]",           expected: "[]"           },
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
  // Your solution here
};`,
      python: `# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def reverse_list(head):
    # Your solution here
    pass`,
      java: `/**
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        // Your solution here
        return null;
    }
}`,
      cpp: `// struct ListNode {
//     int val;
//     ListNode *next;
//     ListNode(int x) : val(x), next(nullptr) {}
// };
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Your solution here
        return nullptr;
    }
};`,
      typescript: `// class ListNode {
//     val: number; next: ListNode | null;
//     constructor(val?: number, next?: ListNode | null) {
//         this.val = val ?? 0; this.next = next ?? null;
//     }
// }
function reverseList(head: ListNode | null): ListNode | null {
    // Your solution here
    return null;
};`,
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 7. Longest Substring Without Repeating Characters
  // ──────────────────────────────────────────────────────────────────
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    tags: ["string", "sliding-window", "hash-map"],
    description:
      "Given a string `s`, find the length of the longest substring without repeating characters.\n\nA substring is a contiguous sequence of characters within a string.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"',   output: "1", explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"',  output: "3", explanation: 'The answer is "wke", with the length of 3.' },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    testCases: [
      { input: "abcabcbb", expected: "3" },
      { input: "bbbbb",    expected: "1" },
      { input: "pwwkew",   expected: "3" },
      { input: "",         expected: "0" },
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Your solution here (Sliding Window)
};`,
      python: `def length_of_longest_substring(s: str) -> int:
    # Your solution here (Sliding Window)
    pass`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Your solution here
        return 0;
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int lengthOfLongestSubstring(string s) {
    // Your solution here
    return 0;
}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
    // Your solution here
    return 0;
};`,
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 8. Number of Islands
  // ──────────────────────────────────────────────────────────────────
  {
    title: "Number of Islands",
    difficulty: "medium",
    tags: ["array", "dfs", "bfs", "graph", "union-find"],
    description:
      "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    examples: [
      {
        input:  'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: "1",
        explanation: "All the 1s are connected, forming one island.",
      },
      {
        input:  'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: "3",
        explanation: "There are 3 separate islands.",
      },
    ],
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'.",
    ],
    testCases: [
      { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expected: "1" },
      { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expected: "3" },
    ],
    starterCode: {
      javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  // Your solution here (DFS/BFS)
};`,
      python: `def num_islands(grid: list[list[str]]) -> int:
    # Your solution here (DFS/BFS)
    pass`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        // Your solution here
        return 0;
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int numIslands(vector<vector<char>>& grid) {
    // Your solution here
    return 0;
}`,
      typescript: `function numIslands(grid: string[][]): number {
    // Your solution here
    return 0;
};`,
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 9. 3Sum
  // ──────────────────────────────────────────────────────────────────
  {
    title: "3Sum",
    difficulty: "medium",
    tags: ["array", "two-pointer", "sorting"],
    description:
      "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "The distinct triplets are [-1,-1,2] and [-1,0,1]. The order of the output does not matter." },
      { input: "nums = [0,1,1]",           output: "[]",                   explanation: "The only possible triplet does not sum up to 0." },
      { input: "nums = [0,0,0]",           output: "[[0,0,0]]",           explanation: "The only possible triplet sums up to 0." },
    ],
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5",
    ],
    testCases: [
      { input: "[-1,0,1,2,-1,-4]", expected: "[[-1,-1,2],[-1,0,1]]" },
      { input: "[0,1,1]",           expected: "[]"                    },
      { input: "[0,0,0]",           expected: "[[0,0,0]]"            },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  // Your solution here (Sort + Two Pointer)
};`,
      python: `def three_sum(nums: list[int]) -> list[list[int]]:
    # Your solution here (Sort + Two Pointer)
    pass`,
      java: `import java.util.*;
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Your solution here
        return new ArrayList<>();
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> threeSum(vector<int>& nums) {
    // Your solution here
    return {};
}`,
      typescript: `function threeSum(nums: number[]): number[][] {
    // Your solution here
    return [];
};`,
    },
  },

  // ──────────────────────────────────────────────────────────────────
  // 10. Merge Two Sorted Lists
  // ──────────────────────────────────────────────────────────────────
  {
    title: "Merge Two Sorted Lists",
    difficulty: "easy",
    tags: ["linked-list", "recursion"],
    description:
      "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "" },
      { input: "list1 = [], list2 = []",             output: "[]",            explanation: "" },
      { input: "list1 = [], list2 = [0]",            output: "[0]",           explanation: "" },
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order.",
    ],
    testCases: [
      { input: "[1,2,4]\n[1,3,4]", expected: "[1,1,2,3,4,4]" },
      { input: "[]\n[]",           expected: "[]"             },
      { input: "[]\n[0]",          expected: "[0]"            },
    ],
    starterCode: {
      javascript: `/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
function mergeTwoLists(list1, list2) {
  // Your solution here
};`,
      python: `def merge_two_lists(list1, list2):
    # Your solution here
    pass`,
      java: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Your solution here
        return null;
    }
}`,
      cpp: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        // Your solution here
        return nullptr;
    }
};`,
      typescript: `function mergeTwoLists(
    list1: ListNode | null,
    list2: ListNode | null
): ListNode | null {
    // Your solution here
    return null;
};`,
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  // Find admin user to set as createdBy
  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    console.error("❌ No admin found. Run seed-admin.js first.");
    return mongoose.disconnect();
  }

  // Clear existing problems (optional — comment out to keep old ones)
  await Problem.deleteMany({});
  console.log("🗑️  Cleared existing problems");

  // Insert all problems
  const docs = PROBLEMS.map((p) => ({ ...p, createdBy: admin._id }));
  await Problem.insertMany(docs);

  console.log(`✅ Seeded ${PROBLEMS.length} problems successfully!`);
  console.log("\nProblems added:");
  PROBLEMS.forEach((p, i) =>
    console.log(`  ${i + 1}. [${p.difficulty.toUpperCase()}] ${p.title}`)
  );

  mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  mongoose.disconnect();
});
