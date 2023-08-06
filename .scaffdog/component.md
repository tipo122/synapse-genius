---
name: "component"
description: "Generate standard React component."
root: "src/components"
output: "."
ignore: []
questions:
  component: "作りたいコンポーネント名を入力してください: (ex. Button)"
---

# {{ inputs.component | pascal }}/index.tsx

```tsx
import {{ inputs.component | pascal }} from "./{{ inputs.component | pascal }}";

export default {{ inputs.component | pascal }};
```

# {{ inputs.component | pascal }}/{{ inputs.component | pascal }}.tsx

```tsx
import React from "react";

const {{ inputs.component | pascal }} = () => {
  return (
    <div>{{ inputs.component | pascal }}</div>
  );
};

export default {{ inputs.component | pascal }};

```

# {{ inputs.component | pascal }}/{{ inputs.component | pascal }}.css

```css

```
