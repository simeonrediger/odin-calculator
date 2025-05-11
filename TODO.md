- function operate(operator, operand1, operan2)
- evaluate on operator click if not first operator
- round answers to prevent overflow
- handle premature evaluation click
- handle division by 0 (display error message)
- handle consecutive operator click (only use last operator clicked)
- handle number click immediately after evaluation (should start new operation)
- disable the decimal-separator when one is already in current operand
- add keyboard support

- update current time continuously
- add decimal separator to end of integer when typed
- handle float imprecision (e.g., 0.1 + 0.2) if not already handled by rounding
- reduce hover overlay opacity
- add accessibility features

General flow:
- Set to operand 1
- Click numbers
- Click operator (use last of consecutive clicks)
- Set to operand 2
- Click numbers
- Evaluate on operator click (or evaluation click)
- Store to operand 1
- If number clicked
    - Clear and set to operand 1
- If operator clicked
    - Set to operatand 2
