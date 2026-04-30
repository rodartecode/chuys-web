/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-astro"],
  rules: {
    "no-empty-source": null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "layer",
          "theme",
          "reference",
        ],
      },
    ],
  },
};
