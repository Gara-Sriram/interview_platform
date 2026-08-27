// 10 curated DSA problems — 3 Easy, 4 Medium, 3 Hard
// Each has: id, title, difficulty, tags, description, examples, constraints, starterCode

export const PROBLEMS = [
  // ─────────────────────────────────────────────
  // EASY (3)
  // ─────────────────────────────────────────────
  {
    id: 1,
    title: "Two Sum",
    difficulty: "easy",
    tags: ["Array", "Hash Map"],
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
      { input: "nums = [3,2,4], target = 6",      output: "[1,2]" },
      { input: "nums = [3,3], target = 6",         output: "[0,1]" },
    ],
    constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "Only one valid answer exists"],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Your solution here\n}\n\n// Test\nconsole.log(twoSum([2,7,11,15], 9));`,
      python:     `def two_sum(nums, target):\n    # Your solution here\n    pass\n\n# Test\nprint(two_sum([2, 7, 11, 15], 9))`,
      java:       `import java.util.*;\n\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your solution here\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        System.out.println(Arrays.toString(s.twoSum(new int[]{2,7,11,15}, 9)));\n    }\n}`,
      cpp:        `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your solution here\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2,7,11,15};\n    auto res = twoSum(nums, 9);\n    cout << res[0] << " " << res[1] << endl;\n}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n  // Your solution here\n  return [];\n}\n\nconsole.log(twoSum([2,7,11,15], 9));`,
    },
  },

  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "easy",
    tags: ["Stack", "String"],
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: `s = "()"`,       output: "true" },
      { input: `s = "()[]{}"`,   output: "true" },
      { input: `s = "(]"`,       output: "false" },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only '()[]{}'"],
    starterCode: {
      javascript: `function isValid(s) {\n  // Your solution here\n}\n\nconsole.log(isValid("()[]{}"));  // true\nconsole.log(isValid("(]"));       // false`,
      python:     `def is_valid(s):\n    # Your solution here\n    pass\n\nprint(is_valid("()[]{}"))  # True\nprint(is_valid("(]"))      # False`,
      java:       `public class Solution {\n    public boolean isValid(String s) {\n        // Your solution here\n        return false;\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.isValid("()[]{}"));\n    }\n}`,
      cpp:        `#include <iostream>\n#include <stack>\nusing namespace std;\n\nbool isValid(string s) {\n    // Your solution here\n    return false;\n}\n\nint main() {\n    cout << isValid("()[]{}") << endl;\n}`,
      typescript: `function isValid(s: string): boolean {\n  // Your solution here\n  return false;\n}\n\nconsole.log(isValid("()[]{}"));`,
    },
  },

  {
    id: 3,
    title: "Reverse Linked List",
    difficulty: "easy",
    tags: ["Linked List", "Recursion"],
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

For simplicity, implement this using an array to simulate the linked list.

Input: An array representing the linked list values.
Output: The reversed array.`,
    examples: [
      { input: "[1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "[1,2]",       output: "[2,1]" },
      { input: "[]",          output: "[]" },
    ],
    constraints: ["0 ≤ list.length ≤ 5000", "-5000 ≤ Node.val ≤ 5000"],
    starterCode: {
      javascript: `function reverseList(arr) {\n  // Your solution here\n}\n\nconsole.log(reverseList([1,2,3,4,5]));`,
      python:     `def reverse_list(arr):\n    # Your solution here\n    pass\n\nprint(reverse_list([1, 2, 3, 4, 5]))`,
      java:       `import java.util.*;\npublic class Solution {\n    public int[] reverseList(int[] arr) {\n        // Your solution here\n        return arr;\n    }\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        System.out.println(Arrays.toString(s.reverseList(new int[]{1,2,3,4,5})));\n    }\n}`,
      cpp:        `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> reverseList(vector<int> arr) {\n    // Your solution here\n    return arr;\n}\n\nint main() {\n    vector<int> res = reverseList({1,2,3,4,5});\n    for(int x : res) cout << x << " ";\n}`,
      typescript: `function reverseList(arr: number[]): number[] {\n  // Your solution here\n  return arr;\n}\n\nconsole.log(reverseList([1,2,3,4,5]));`,
    },
  },

  // ─────────────────────────────────────────────
  // MEDIUM (4)
  // ─────────────────────────────────────────────
  {
    id: 4,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    tags: ["Sliding Window", "Hash Map", "String"],
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    examples: [
      { input: `s = "abcabcbb"`, output: "3", explanation: `The answer is "abc", with the length of 3.` },
      { input: `s = "bbbbb"`,    output: "1", explanation: `The answer is "b", with the length of 1.` },
      { input: `s = "pwwkew"`,   output: "3", explanation: `The answer is "wke", with the length of 3.` },
    ],
    constraints: ["0 ≤ s.length ≤ 5 × 10⁴", "s consists of English letters, digits, symbols and spaces"],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // Your solution here\n}\n\nconsole.log(lengthOfLongestSubstring("abcabcbb")); // 3`,
      python:     `def length_of_longest_substring(s):\n    # Your solution here\n    pass\n\nprint(length_of_longest_substring("abcabcbb"))  # 3`,
      java:       `public class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your solution here\n        return 0;\n    }\n    public static void main(String[] args) {\n        System.out.println(new Solution().lengthOfLongestSubstring("abcabcbb"));\n    }\n}`,
      cpp:        `#include <iostream>\n#include <unordered_set>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    // Your solution here\n    return 0;\n}\n\nint main() {\n    cout << lengthOfLongestSubstring("abcabcbb") << endl;\n}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {\n  // Your solution here\n  return 0;\n}\n\nconsole.log(lengthOfLongestSubstring("abcabcbb"));`,
    },
  },

  {
    id: 5,
    title: "Maximum Subarray",
    difficulty: "medium",
    tags: ["Dynamic Programming", "Array", "Kadane's Algorithm"],
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

This is the classic Kadane's Algorithm problem.`,
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]",                       output: "1" },
      { input: "nums = [5,4,-1,7,8]",              output: "23" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  // Your solution here\n}\n\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // 6`,
      python:     `def max_sub_array(nums):\n    # Your solution here\n    pass\n\nprint(max_sub_array([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # 6`,
      java:       `public class Solution {\n    public int maxSubArray(int[] nums) {\n        // Your solution here\n        return 0;\n    }\n    public static void main(String[] args) {\n        System.out.println(new Solution().maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4}));\n    }\n}`,
      cpp:        `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    // Your solution here\n    return 0;\n}\n\nint main() {\n    vector<int> nums = {-2,1,-3,4,-1,2,1,-5,4};\n    cout << maxSubArray(nums) << endl;\n}`,
      typescript: `function maxSubArray(nums: number[]): number {\n  // Your solution here\n  return 0;\n}\n\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));`,
    },
  },

  {
    id: 6,
    title: "Binary Search",
    difficulty: "medium",
    tags: ["Binary Search", "Array"],
    description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.

If target exists, return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist in nums so return -1" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁴", "-10⁴ < nums[i], target < 10⁴", "All integers in nums are unique", "nums is sorted in ascending order"],
    starterCode: {
      javascript: `function search(nums, target) {\n  // Your solution here — O(log n)\n}\n\nconsole.log(search([-1,0,3,5,9,12], 9));  // 4\nconsole.log(search([-1,0,3,5,9,12], 2));  // -1`,
      python:     `def search(nums, target):\n    # Your solution here — O(log n)\n    pass\n\nprint(search([-1,0,3,5,9,12], 9))  # 4\nprint(search([-1,0,3,5,9,12], 2))  # -1`,
      java:       `public class Solution {\n    public int search(int[] nums, int target) {\n        // Your solution here\n        return -1;\n    }\n    public static void main(String[] args) {\n        System.out.println(new Solution().search(new int[]{-1,0,3,5,9,12}, 9));\n    }\n}`,
      cpp:        `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint search(vector<int>& nums, int target) {\n    // Your solution here\n    return -1;\n}\n\nint main() {\n    vector<int> nums = {-1,0,3,5,9,12};\n    cout << search(nums, 9) << endl;\n}`,
      typescript: `function search(nums: number[], target: number): number {\n  // Your solution here\n  return -1;\n}\n\nconsole.log(search([-1,0,3,5,9,12], 9));`,
    },
  },

  {
    id: 7,
    title: "3Sum",
    difficulty: "medium",
    tags: ["Array", "Two Pointers", "Sorting"],
    description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]",           output: "[]" },
      { input: "nums = [0,0,0]",           output: "[[0,0,0]]" },
    ],
    constraints: ["3 ≤ nums.length ≤ 3000", "-10⁵ ≤ nums[i] ≤ 10⁵"],
    starterCode: {
      javascript: `function threeSum(nums) {\n  // Your solution here\n}\n\nconsole.log(JSON.stringify(threeSum([-1,0,1,2,-1,-4])));`,
      python:     `def three_sum(nums):\n    # Your solution here\n    pass\n\nprint(three_sum([-1, 0, 1, 2, -1, -4]))`,
      java:       `import java.util.*;\npublic class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Your solution here\n        return new ArrayList<>();\n    }\n    public static void main(String[] args) {\n        System.out.println(new Solution().threeSum(new int[]{-1,0,1,2,-1,-4}));\n    }\n}`,
      cpp:        `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> threeSum(vector<int>& nums) {\n    // Your solution here\n    return {};\n}\n\nint main() {\n    vector<int> nums = {-1,0,1,2,-1,-4};\n    auto res = threeSum(nums);\n    for(auto& t : res) cout << t[0] << " " << t[1] << " " << t[2] << endl;\n}`,
      typescript: `function threeSum(nums: number[]): number[][] {\n  // Your solution here\n  return [];\n}\n\nconsole.log(threeSum([-1,0,1,2,-1,-4]));`,
    },
  },

  // ─────────────────────────────────────────────
  // HARD (3)
  // ─────────────────────────────────────────────
  {
    id: 8,
    title: "Trapping Rain Water",
    difficulty: "hard",
    tags: ["Array", "Two Pointers", "Stack", "Dynamic Programming"],
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "The above elevation map traps 6 units of rain water." },
      { input: "height = [4,2,0,3,2,5]",               output: "9" },
    ],
    constraints: ["n == height.length", "1 ≤ n ≤ 2 × 10⁴", "0 ≤ height[i] ≤ 10⁵"],
    starterCode: {
      javascript: `function trap(height) {\n  // Your solution here\n}\n\nconsole.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // 6`,
      python:     `def trap(height):\n    # Your solution here\n    pass\n\nprint(trap([0,1,0,2,1,0,1,3,2,1,2,1]))  # 6`,
      java:       `public class Solution {\n    public int trap(int[] height) {\n        // Your solution here\n        return 0;\n    }\n    public static void main(String[] args) {\n        System.out.println(new Solution().trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1}));\n    }\n}`,
      cpp:        `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint trap(vector<int>& height) {\n    // Your solution here\n    return 0;\n}\n\nint main() {\n    vector<int> h = {0,1,0,2,1,0,1,3,2,1,2,1};\n    cout << trap(h) << endl;\n}`,
      typescript: `function trap(height: number[]): number {\n  // Your solution here\n  return 0;\n}\n\nconsole.log(trap([0,1,0,2,1,0,1,3,2,1,2,1]));`,
    },
  },

  {
    id: 9,
    title: "Word Break",
    difficulty: "hard",
    tags: ["Dynamic Programming", "Trie", "Memoization"],
    description: `Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.`,
    examples: [
      { input: `s = "leetcode", wordDict = ["leet","code"]`,         output: "true",  explanation: `Return true because "leetcode" can be segmented as "leet code".` },
      { input: `s = "applepenapple", wordDict = ["apple","pen"]`,    output: "true",  explanation: `Return true because "applepenapple" can be segmented as "apple pen apple".` },
      { input: `s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]`, output: "false" },
    ],
    constraints: ["1 ≤ s.length ≤ 300", "1 ≤ wordDict.length ≤ 1000", "1 ≤ wordDict[i].length ≤ 20"],
    starterCode: {
      javascript: `function wordBreak(s, wordDict) {\n  // Your solution here\n}\n\nconsole.log(wordBreak("leetcode", ["leet","code"]));       // true\nconsole.log(wordBreak("catsandog", ["cats","dog","sand"])); // false`,
      python:     `def word_break(s, word_dict):\n    # Your solution here\n    pass\n\nprint(word_break("leetcode", ["leet", "code"]))         # True\nprint(word_break("catsandog", ["cats","dog","sand"]))   # False`,
      java:       `import java.util.*;\npublic class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        // Your solution here\n        return false;\n    }\n    public static void main(String[] args) {\n        System.out.println(new Solution().wordBreak("leetcode", Arrays.asList("leet","code")));\n    }\n}`,
      cpp:        `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_set>\nusing namespace std;\n\nbool wordBreak(string s, vector<string>& wordDict) {\n    // Your solution here\n    return false;\n}\n\nint main() {\n    vector<string> dict = {"leet","code"};\n    cout << wordBreak("leetcode", dict) << endl;\n}`,
      typescript: `function wordBreak(s: string, wordDict: string[]): boolean {\n  // Your solution here\n  return false;\n}\n\nconsole.log(wordBreak("leetcode", ["leet","code"]));`,
    },
  },

  {
    id: 10,
    title: "Median of Two Sorted Arrays",
    difficulty: "hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]",         output: "2.00000", explanation: "merged array = [1,2,3] and median is 2." },
      { input: "nums1 = [1,2], nums2 = [3,4]",        output: "2.50000", explanation: "merged array = [1,2,3,4] and median is (2+3)/2 = 2.5." },
    ],
    constraints: ["nums1.length == m", "nums2.length == n", "0 ≤ m, n ≤ 1000", "0 ≤ m + n ≤ 2000", "-10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶"],
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {\n  // Your solution here — O(log(m+n))\n}\n\nconsole.log(findMedianSortedArrays([1,3], [2]));    // 2.0\nconsole.log(findMedianSortedArrays([1,2], [3,4]));  // 2.5`,
      python:     `def find_median_sorted_arrays(nums1, nums2):\n    # Your solution here — O(log(m+n))\n    pass\n\nprint(find_median_sorted_arrays([1, 3], [2]))     # 2.0\nprint(find_median_sorted_arrays([1, 2], [3, 4]))  # 2.5`,
      java:       `public class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Your solution here\n        return 0.0;\n    }\n    public static void main(String[] args) {\n        System.out.println(new Solution().findMedianSortedArrays(new int[]{1,3}, new int[]{2}));\n    }\n}`,
      cpp:        `#include <iostream>\n#include <vector>\nusing namespace std;\n\ndouble findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    // Your solution here\n    return 0.0;\n}\n\nint main() {\n    vector<int> a = {1,3}, b = {2};\n    cout << findMedianSortedArrays(a, b) << endl;\n}`,
      typescript: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {\n  // Your solution here\n  return 0;\n}\n\nconsole.log(findMedianSortedArrays([1,3], [2]));`,
    },
  },
];

// Helper lookups
export const getProblem = (id) => PROBLEMS.find((p) => p.id === parseInt(id));

export const DIFFICULTY_ORDER = { easy: 1, medium: 2, hard: 3 };
