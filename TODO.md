# To-do items

## Necessities

## Enhancements
- Decouple display logic and font sizing logic from `Calculator` methods
- Standardize access patterns
    - For internal use, access private class members directly unless doing so increases complexity
    - For external use, access private class members through getters and setters
    - Standardize use of validation in public setters
    - Divide up public methods that accept ambiguous boolean arguments into distinct methods with clear intent for each condition
        - E.g.,
            - `operand.markAsEvaluationResult()`
            - `operand.unmarkAsEvaluationResult()`
        - instead of
            - `operand.isEvaluationResult = true`
            - `operand.isEvaluationResult = false`
- For methods with side effects that are not obviously implied, either...
    - divide up the methods into smaller methods and allow the caller to control their invocation
    - or add a default parameter that accepts configuration options
        - Preserves the option of convenience for the caller
        - Side effects are more explicit and can be controlled by the caller
- Write JSDocs for complex methods
- Refactor magic numbers as `NAMED_CONSTANTS`
- Refactor string literal state values as enums
- Remove redundant `#isLeftOperand` setter

- Condense repetitive switch statement logic for click handlers
    - Also consider leaving as is for future revisions to control flow
- Use named variables for complex boolean expressions
- Implement try-catch block for division by zero
- Change `absoluteValue` to `unsignedText` or a better alternative
- Change `displayValue` to `text` or a better alternative
- Add accessibility features
- Add responsive design for smaller screens
