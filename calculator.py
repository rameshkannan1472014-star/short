def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        raise ValueError('Cannot divide by zero')
    return a / b

if __name__ == "__main__":
    print('Simple Calculator')
    while True:
        try:
            expr = input('Enter expression (e.g., 2 + 3) or q to quit: ')
            if expr.lower() == 'q':
                break
            a, op, b = expr.split()
            a = float(a)
            b = float(b)
            if op == '+':
                result = add(a, b)
            elif op == '-':
                result = subtract(a, b)
            elif op == '*':
                result = multiply(a, b)
            elif op == '/':
                result = divide(a, b)
            else:
                print('Unsupported operator')
                continue
            print('Result:', result)
        except Exception as e:
            print('Error:', e)
