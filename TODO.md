# To-do items

## Necessities
- Fix mixed inputs bug
    - Repro:
        1. Click to input `1+0`
        2. Press `'Enter'` key
        3. Observe that `0` is displayed instead of `1`
    - Clues:
        - `displayOperation` runs 5 times instead of the expected 4
    - Theory:
        1. `0` button is focused after being clicked
        2. Pressing `'Enter'` key...
            1. Triggers `handleKeyDown`, evaluating `1+0` and displaying `1`
            1. And clicks the focused button, triggering `handleClick`, which
            overwrites the display with `0`

## Enhancements
- Implement try-catch block for division by zero
- Change "absoluteValue" to "unsignedText"
- Change "displayValue" to "text"
- Condense repetitive switch statement logic for click handlers
- Make use of private/public class members more consistent
- Use named variables for complex boolean expressions
- Add accessibility features
- Add support for mobile screens
