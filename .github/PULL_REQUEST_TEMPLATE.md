## Description

<!-- Provide a clear and concise description of your changes to the template -->

## Type of Change

<!-- Mark the relevant option with an 'x' -->

- [ ] Bug fix (fixes template generation or file issues)
- [ ] New template feature (adds new files or configuration)
- [ ] CLI improvement (improves prompts or user experience)
- [ ] Documentation update
- [ ] Dependency update
- [ ] Breaking change (changes template structure significantly)

## Related Issue

<!-- If this PR fixes an issue, reference it here -->
Fixes #(issue number)

## What Changed in the Template?

<!-- List what files/features were added, modified, or removed -->

**Added**:
-

**Modified**:
-

**Removed**:
-

## Testing

<!-- Describe how you tested the template changes -->

**Testing steps**:
1. Run `npm create lyrajs` (or `node cli.js` locally)
2. Enter project name: `test-project`
3. Verify files are created correctly
4. Install dependencies and run `npm run dev`
5. Test specific features affected by this PR

**Test Configuration**:
- Node.js version:
- npm version:
- OS:

- [ ] Template generates successfully
- [ ] All template files are copied correctly
- [ ] .env file is created from .env.example
- [ ] Dependencies install without errors
- [ ] Generated project runs successfully (`npm run dev`)
- [ ] No broken links or missing files
- [ ] Documentation is accurate

## Screenshots / Examples

<!-- If applicable, show before/after or examples of generated files -->

<details>
<summary>Generated project structure (if changed)</summary>

```
my-project/
├── ...
```

</details>

## Breaking Changes

<!-- If this changes the template structure significantly -->

- [ ] This PR introduces breaking changes to the template
- [ ] Updated documentation to reflect changes

<details>
<summary>Breaking change details (if applicable)</summary>

<!-- Describe what changes and impact on existing users -->

</details>

## Checklist

<!-- Mark completed items with an 'x' -->

- [ ] My code follows the project's code style
- [ ] I have tested the template generation locally
- [ ] I have tested the generated project works correctly
- [ ] Template files use consistent naming and structure
- [ ] I have updated the README if needed
- [ ] I have updated .env.example if configuration changed
- [ ] All paths in template files are correct
- [ ] No hardcoded values that should be configurable
- [ ] I have signed the [CLA](../CLA.md) (will be prompted automatically)

## Impact on Users

<!-- How will this affect users creating new projects? -->

- Existing projects: [No impact / Requires manual update / etc.]
- New projects: [Gets new feature / Different structure / etc.]

## Additional Notes

<!-- Any additional information for reviewers -->

## Reviewer Checklist

<!-- For maintainers reviewing this PR -->

- [ ] Template generates correctly
- [ ] Generated project structure is logical
- [ ] No unnecessary files included
- [ ] Documentation is clear
- [ ] Breaking changes are documented
- [ ] Dependencies are necessary and up to date
