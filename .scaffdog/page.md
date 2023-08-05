---
name: "page"
description: "Generate standard React component."
root: "src/pages"
output: "."
ignore: []
questions:
  name: "作りたいページ名を入力してください: (ex. Home)"
---

# {{ inputs.name | pascal }}/index.tsx

```tsx
import {{ inputs.name | pascal }} from "./{{ inputs.name | pascal }}";

export default {{ inputs.name | pascal }};
```

# {{ inputs.name | pascal }}/{{ inputs.name | pascal }}.tsx

```tsx
import React from "react";

const {{ inputs.name | pascal }} = () => {
  return (
    <div>{{ inputs.name | pascal }}</div>
  );
};

export default {{ inputs.name | pascal }};

```

# {{ inputs.name | pascal }}/{{ inputs.name | pascal }}.css

```css

```
