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

큰 흐름: useEffect 호출로 effect 등록(mount, 리렌더링) -> React가 변경 사항 Commit -> Commit 후 Effect 실행
