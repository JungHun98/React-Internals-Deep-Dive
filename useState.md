React의 useState 훅은 함수형 컴포넌트에서 상태를 관리하는 핵심적인 도구 중 하나입니다. 이 글에서는 useState 훅의 동작 원리를 탐구하고 내부 동작 메커니즘에 대해 자세히 살펴보겠습니다. 디버거를 사용해서 어떤 순서로 동작하는지 파악하고, 리액트 Github에 저장된 코드를 바탕으로 분석해보겠습니다.

```js
import { useState } from "react";

function App() {
  debugger;
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <button
        onClick={() => {
          debugger;
          setCount(count + 1);
        }}
      >
        click {count}
      </button>
    </div>
  );
}

export default App;
```
버튼하나가 있고, 클릭할 때 마다 상태가 하나씩 증가하는 간단한 컴포넌트입니다. 이 컴포넌트를 렌더링 시켜서 설정한 브레이크 포인트를 기반으로 따라가 보겠습니다.

## useState 동작 순서

### 💡 컴포넌트 mount
![](https://velog.velcdn.com/images/j7papa/post/4d74306f-1e5d-49cf-82f2-9d8a687c98ea/image.png)


첫 렌더링 단계에서 useState는 mountState라는 함수를 호출합니다. 이 함수는 mount 단계에서만 호출되며, 상태를 변경할 때는 더 이상 호출되지 않습니다.

```js
function mountState(initialState) {
  const hook = mountStateImpl(initialState);
  const queue = hook.queue;
  const dispatch = dispatchSetState.bind(
    null,
    currentlyRenderingFiber,
    queue,
  );

  queue.dispatch = dispatch;

  return [hook.memoizedState, dispatch];
}
```

컴포넌트가 처음 마운트될 때, useState 훅에서 mountState를 통해 상태를 초기화하고 해당 상태를 업데이트하는 함수를 생성하는 과정은 다음과 같습니다.

1. `mountState` 함수가 호출되면서 초기 상태값(initialState)을 전달합니다.

2. `mountStateImpl(initialState)` 함수 내부에서 `hook 객체`를 생성합니다. 이 객체에는 상태값을 저장하는 **memoizedState 프로퍼티**와 업데이트 작업을 관리하는 **queue 프로퍼티** 등이 있습니다.

3. 상태 업데이트를 수행하는 함수인 `dispatchSetState`를 생성한뒤 queue에 등록하고, 이 함수에 현재 렌더링 중인 Fiber 노드와 queue를 인자로 전달하여 bind합니다.

4. 생성된 dispatchSetState 함수를 queue.dispatch에 저장합니다. 이 함수는 나중에 상태를 업데이트할 때 사용됩니다.

5. `mountState` 함수는 **`[hook.memoizedState, dispatch]`** 형태의 배열을 반환합니다. 이 배열은 컴포넌트에서 사용할 수 있는 현재 상태값과 해당 상태를 업데이트하는 함수를 제공합니다.

반환 형태가 useState에서 얻을 수 있는 익숙한 구문이죠? 그리고 이 구문의 핵심은 dispatch 함수가 queue에 등록되어 있어 **`mountState`함수의 호출이 끝나도 메모리 상에 hook 객체가 남아** 있게 됩니다.

> 평소 React가 Closure를 활용해 상태를 관리한다고 이야기만 들었는데 코드를 보니 더 명확해진 것 같아요.

이러한 과정을 통해 컴포넌트가 처음으로 마운트될 때, 초기 상태값과 상태를 업데이트하는 함수를 생성하여 반환합니다. 이렇게 반환된 상태값과 함수를 통해 컴포넌트는 상태를 관리하고 업데이트할 수 있게 됩니다.

⭐ useState에서 반환받은 상태 값은 컴포넌트의 상태가 아니라 **값**이다.

### 💡 상태 업데이트
![](https://velog.velcdn.com/images/j7papa/post/1f748a3e-3398-4e15-93d7-a6b6bd868316/image.png)

버튼 클릭과 같은 이벤트가 발생하면 설정한 이벤트 핸들러가 실행됩니다.
이벤트 핸들러에서는 setState 함수가 호출되는데, 이 함수는 컴포넌트의 상태를 업데이트하도록 만듭니다.

호출된 setState 함수 내부에서는 마운트 단계에서 반환된 `dispatchSetState` 함수가 호출 되겠죠?
이해를 돕기 위해 `dispatchSetState`의 실제 코드를 주석을 이용해 추상화 된 슈도 코드로 표현하겠습니다. ~~(저는 모두 이해 못했습니다. 어렵더군요)~~

```js
// 상태 업데이트
function dispatchSetState(fiber, queue, action) {
  // 오류 확인 및 설정

  // 현재 업데이트에 대한 업데이트 우선순위 결정

  // 업데이트에 대한 정보를 포함하는 업데이트 객체 생성

  // 상태 업데이트가 렌더 단계에서 이뤄지는지 여부 확인
  if (is_렌더링단계()) {
    // 업데이트를 렌더 단계 큐에 추가
  } else {
    // 렌더 단계가 아닌 경우, 렌더 단계 외부에서 업데이트 처리

    const alternate = fiber.alternate;
    if (
      !현재_컴포넌트_업데이트() 
        && 
      (첫_상태_업데이트() || !이전_컴포넌트_업데이트())
    ) {
      // 큐가 비어 있는 경우, 다음 상태를 선제적으로 계산해보기
      const lastRenderedReducer = queue.lastRenderedReducer;
      if (queue_empty()) {
        // 다음 상태를 계산 ...

        // 업데이트 객체를 계산된 상태로 업데이트 ...
     
        // 선제적으로 계산된 상태가 현재 상태와 동일하면,
        if (계산된_상태 === 현재_상태) {
          // 다시 렌더링을 예약하지 않고 중단
          return;
        }
      }
    }

    // 업데이트를 큐에 추가
    
    if (root !== null) {
      // 렌더링 트리거 발동
    }
  }

  // DevTools에서 업데이트 표시
}
```

상태 업데이트 함수에 대해 간략하게 설명하자면

1. 만약 렌더 단계에서 호출된 것이라면, 업데이트를 렌더 단계 큐에 추가하고 종료합니다.

2. 그렇지 않다면 업데이트 데이터를 큐에 추가하고 렌더링 트리거를 발동합니다.
	- 만약 큐가 비어 있으면서 선제적으로 계산된 상태가 현재 상태와 동일하다면, 다시 렌더링을 예약하지 않고 중단합니다.

여기서 눈여겨 봐야할 점은 setState 함수 내부에 컴포넌트 상태를 변경하는 로직이 없다는 점입니다. 업데이트의 내역을 queue에 등록해 예약해두기만 했을 뿐입니다. 그럼 도대체 상태는 언제 업데이트 될까요?

>**리렌더링 후 호출된 useState에서 이뤄집니다.**

### 리렌더링 useState

![](https://velog.velcdn.com/images/j7papa/post/9368187f-3be2-4522-a585-3e291dd64e4b/image.png)

mount 단계 useState와 달리 `updateState`라는 함수를 호출하고 있습니다. 이름부터 대놓고 "상태 업데이트 한다"라고 말하고 있습니다.

![](https://velog.velcdn.com/images/j7papa/post/d0cd0161-7a15-4d49-b043-033cd7b8d580/image.png)
```js
function basicStateReducer(state, action) {
  // $FlowFixMe: Flow doesn't like mixed types
  return typeof action === 'function' ? action(state) : action;
}
```

`basicStateReducer` 함수는 `setState`에서 전달된 `action`이 함수인지 여부를 확인하고, 함수라면 현재 상태를 기반으로 계산한 값을 반환하고 값이라면 그대로 반환합니다. 이러한 리듀서 함수를 `updateReducer`에서 사용하여 큐에 쌓인 업데이트 작업을 처리합니다. 

```js
setSate(value);
setSate(value => value + 1);
```
위와 같은 서로 다른 인자에 대한 상태 업데이트를 `basicStateReducer`에서 해주는 겁니다. 다음, `updateReducer`에서 상태를 어떻게 업데이트하는지 알아 보겠습니다.

```js
function updateReducer(
  reducer,
  initialArg,
  init
) {
  // 현재 렌더링 중인 훅
  const hook = updateWorkInProgressHook();
  return updateReducerImpl(hook, currentHook, reducer);
}

function updateReducerImpl(hook, current, reducer) {
  const queue = hook.queue;

  // .. 오류 처리

  if (baseQueue !== null) {
    // ... update 객체 설정
    do {
      // ... 업데이트 여부 확인
      
      if (shouldSkipUpdate) {
        // 업데이트 건너 뛰기
      } else {
        // 상태 업데이트
        const action = update.action;
        
        if (update.hasEagerState) {
          // reducer 호출전에 이미 상태가 연산됨
          newState = update.eagerState;
        } else {
          newState = reducer(newState, action);
        }
      }
      
      update = update.next;
    } while (update !== null && update !== first);

    // hook queue update

    hook.memoizedState = newState;
    
    // ... queue handling
  }

  // ... queue handling

  const dispatch = queue.dispatch;
  return [hook.memoizedState, dispatch];
}
```

1. `updateReducer` 함수는 현재 실행 중인 훅을 얻고, 이를 `updateReducerImpl` 함수에 전달합니다.

2. `updateReducerImpl` 함수는 현재 훅(hook)과 그에 연결된 큐(queue)를 이용해 상태 업데이트를 수행합니다.

3. 이 함수 내부에서는 `setState`를 통해 큐에 쌓인 업데이트를 확인하고, 업데이트 객체에서 액션과 상태 값을 추출하여 리듀서 함수를 호출하여 새로운 상태를 계산합니다.

4. 만약 업데이트 객체가 선제적으로 계산된 상태를 가지고 있다면(update.hasEagerState), 리듀서 함수를 호출하지 않고 이미 계산된 상태를 사용합니다.

5. 업데이트가 큐에 여러 개 쌓여 있다면, 순차적으로 처리하고 최종적으로 계산된 상태를 `hook.memoizedState`에 저장합니다.
> 만약 업데이트 `action`이 함수라면, 이전의 상태 값을 바탕으로 연산한 뒤 새로운 상태 값으로 반영하게 됩니다.

6. ⭐ 상태 업데이트가 완료된 후, 해당 훅의 큐를 관리하고 최신 상태와 dispatch 함수를 반환합니다.

### 요약


useState에서의 동작을 세 단계로 다시 요약하면 다음과 같습니다:

1. **Mount (초기 렌더링):**

- useState 훅은 컴포넌트가 처음으로 렌더링될 때 호출됩니다.
- 초기 상태 값이 전달되면 해당 값으로 상태가 초기화되고, 상태 값과 상태를 업데이트하는 함수가 반환됩니다.

2. **setState:**

- 상태를 업데이트하려면 반환된 상태를 업데이트하는 함수를 호출합니다.
- 이 호출은 현재 상태 값을 새로운 값으로 교체하는 작업을 예약하고 리렌더링을 유발합니다.

3. **리렌더링 후 useState:**

- 이후의 렌더링에서 useState가 호출되면, 등록된 상태 업데이트 작업을 수행합니다.
- 업데이트 된 상태 값과 dispatch 함수를 반환합니다.

이렇게 세 단계를 통해 useState는 컴포넌트의 초기 렌더링에서 상태를 초기화하고, 이후의 렌더링에서는 상태 값을 유지하면서 업데이트를 처리합니다.

## 마무리
제가 잘못 알고 있던 지식을 바로잡고 새로운 사실을 알아낼 수 있는 기회였습니다.

1. React 컴포넌트에서 사용하는 useState에서 반환된 state는 **컴포넌트의 상태의 값을 저장하는 변수**라는 점
2. 컴포넌트의 상태를 참조하는 것은 state 변수가 아니라 setState 함수라는 점
3. 실질적인 상태 업데이트 작업은 setState 함수가 아니라 useState 훅에서 이뤄진다는 점


참고자료
https://react.dev/reference/react/useState
https://jser.dev/2023-07-08-how-does-useeffect-work
https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js
