# React-Internals-Deep-Dive
## Intro
개발자가 해야 할 일은 문제를 해결하기 위한 방안을 고안하고 이것을 코드로 구현하는 것입니다. 이때 자신이 구현한 코드가 컴퓨터 내부에서 어떻게 동작할 것인지 그리고 무엇을 반환 할 것인지 예측 가능해야 하며 이것을 동료에게 명확하게 설명 할 수 있어야 합니다.

이를 위해서 사용하는 기술에 대한 기본 개념과 동작원리를 이해하는 것이 중요합니다. 그렇지 않고 그저 동작하는 코드를 만들고 그것에 만족한다면 우리가 구현한 코드는 언제 무너져도 이상할 것이 없는 위태로운 프로그램이 될 것입니다.

동작 원리의 이해는 코드의 동작을 예측할 수 있게 도움을 줍니다. 요구 사항을 코드로 구현하려면 당연히 자신이 작성하는 코드의 동작을 예측할 수 있어야 합니다. 또한 에러를 발생시키는 코드를 만나면 에러가 발생하는 원인을 이해해야 디버깅이 가능합니다.

즉, 기본 개념과 동작 원리 이해는 어렵고 생소한 용어들로 이루어진 기술적 의사소통을 가능케하고, 자신의 머리 속에서 코드를 실행시켜 볼 수 있는 능력을 갖게 합니다. 이를 통해 다른 사람이 작성한 코드를 이해하는 것은 물론 의도 또한 파악할 수 있게 되어 보다 효과적인 코드를 생산할 수 있는 기본기를 쌓을 수 있을 것입니다.

출처: https://poiemaweb.com/coding

## 진행 방식
- React 18 버전으로 진행
- 브라우저 디버거를 이용해 React의 흐름을 따라가며 이해
- 이해한 내용을 정리
  
### 참고 자료
- https://github.com/facebook/react
- https://react.dev/
- https://jser.dev/series/react-source-code-walkthrough
