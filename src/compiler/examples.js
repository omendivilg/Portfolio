export const examples = [
  {
    id: "valid",
    label: "Valid program",
    source: `// A function, a loop, and a little arithmetic.
int twice(int value) {
    return value * 2;
}

void main() {
    int total = 0;
    for (int i = 0; i < 3; i = i + 1) {
        total = total + twice(i);
    }
}`,
  },
  {
    id: "types",
    label: "Type errors",
    source: `// Can you spot the two type errors?
void main() {
    int count = true;
    bool ready = false;

    if (count) {
        ready = true;
    }
}`,
  },
  {
    id: "syntax",
    label: "Missing semicolon",
    source: `// Add the missing semicolon, then compile again.
int answer = 42

void main() {
    answer = answer + 1;
}`,
  },
  {
    id: "scope",
    label: "Scope & functions",
    source: `// Names belong to scopes. Functions have signatures.
int add(int left, int right) {
    return left + right;
}

void main() {
    int total = add(2);
    missing = total;
}`,
  },
];
