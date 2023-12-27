```js
import { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCount((count) => count + 1);
    }, 4000);
  }, [count]);

  return (
    <div>
      <button>click {count}</button>
    </div>
  );
}

export default App;
```

4초마다 count를 하나씩 올리는 코드
