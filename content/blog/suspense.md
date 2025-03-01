---
external: false
title: React 18의 꽃, Suspense
description: React 18에서 중요해진 Suspense에 대해 설명합니다.
date: 2024-11-30
---

꽃은 "영화의 꽃은 감독"이라는 말처럼 중요한 대상을 비유할 때 쓰이기도 합니다. 그 중 **Suspense**는 React 18에서 중요한 대상으로 부각되고 있습니다. Suspense는 단어 "_Suspend_ : 지연시키다." 에서 유래한 이름으로, 하위 컴포넌트가 로드되기 전까지 지연되는 상황에서 대체 UI를 표시하는 기능을 제공하는 React 컴포넌트입니다. 그렇다면 Suspense는 단순히 대체 UI를 보여주는 기능만을 위한 것일까요? 저는 React 팀이 18 버전에서 Suspense를 중요한 대상으로 보여주는 또 다른 이유가 있을거라 생각합니다.

### React 18에서 더욱 중요해진 Suspense

React 18에서는 서버 사이드 렌더링(SSR)의 성능을 크게 개선한 새로운 아키텍처를 도입했습니다. 이러한 개선은 기존 SSR 방식의 효율성에 대한 의문에서 시작되었습니다.

기존의 React SSR 과정은 다음과 같았습니다.

- 서버에서 필요한 데이터를 가져옵니다.
- 서버에서 가져온 데이터를 기반으로 HTML을 생성하고 클라이언트에 전송합니다.
- 클라이언트에서 JavaScript 코드를 불러옵니다.
- 서버에서 생성된 HTML과 클라이언트의 JavaScript를 연결하여 동적으로 작동하도록 설정합니다. (Hydration)

이 과정은 각 단계가 순차적으로 진행되어야 했기 때문에, React 팀은 이를 폭포수(waterfall) 방식으로 간주하며 비효율적이라고 판단하였습니다. React 18에서는 이 문제를 해결하기 위해 **Suspense**를 활용한 새로운 접근 방식을 도입했습니다. 이를 통해 SSR 과정을 세분화하고 데이터를 병렬로 처리하였습니다.

### React 18에서 등장한 Concurrent

Suspense는 SSR 과정에서 화면의 일부를 분리해 병렬적으로 작업을 처리할 수 있도록 지원하며, React 18에서 도입된 동시성(Concurrency)의 중요한 요소입니다. 이 기능은 이름에서도 살펴볼 수 있듯이 **Concurrent Rendering**과 깊은 연관이 있습니다. Concurrent Rendering은 React 18 이전의 동기적 렌더링 방식에 한계를 느끼고, 이를 개선하기 위한 새로운 접근법으로 등장하였습니다.

기존 React에서의 렌더링 과정은 다음과 같았습니다

1. 사용자의 변경 사항을 기반으로 가상 DOM을 계산합니다. (Reconciler)
2. 계산된 변경 사항을 실제 DOM에 반영합니다. (Renderer)

하지만 이러한 방식에서는 가상 DOM을 계산하는 동안 사용자가 추가적인 변경을 요청하더라도, 현재 작업이 완료되어 실제 DOM에 반영되기 전까지 새 작업을 처리할 수 없었습니다. 이로 인해 사용자는 작업 지연을 체감하게 됩니다.

React 18에서는 이러한 문제를 해결하기 위해 Concurrent Rendering 개념을 도입했습니다. 이 기능은 렌더링 작업을 여러 작은 단위로 나누고, 각 작업에 우선순위를 부여하여 보다 유연하고 효율적으로 처리할 수 있도록 설계되었습니다. 이를 통해 React는 렌더링 작업 도중 사용자가 새로운 작업을 요청하면, 기존 작업을 **중단**하고 우선순위가 높은 작업을 먼저 처리할 수 있게 되었습니다. 중단된 작업은 이후 적절한 시점에 **재개**되어 렌더링이 완료되며, 이를 통해 렌더링 과정을 병렬적으로 처리할 수 있게 되었습니다.

아래는 React 18 이전과 이후의 렌더링 방식 차이를 도식화한 그림입니다.

![rendering light](/images/suspense/renderingLight.png#light)
![rendering dark](/images/suspense/renderingDark.png#dark)

이렇게 작업을 중단하고 재개하는 매커니즘을 통해, 중간에 사용자의 요청에 따라 추가 변경이 발생하더라도 업데이트 지연 문제가 발생할 위험을 줄일 수 있게 되었습니다.

### React 18에서 Suspense의 역할

그중에서도 **Suspense**는 SSR 과정에 있어 강력한 동시성 기능을 제공합니다. 그렇다면 Suspense의 동작 방식이 React 18에서 어떻게 사용자 경험을 증진시킬 수 있을까요?

예를 들어, SSR로 페이지를 렌더링하는 상황을 두 가지로 나누어 그려보겠습니다.

- Suspense를 적용하지 않은 페이지

![html light](/images/suspense/htmlLight.png#light)
![html dark](/images/suspense/htmlDark.png#dark)

이 페이지는 HTML을 생성하기 위해 서버에서 모든 데이터를 받아와야 합니다. 이러한 과정의 경우, 특정 컴포넌트에서 데이터를 받아오는 속도가 느리다면 모든 데이터를 불러와야 렌더링이 진행되는 SSR의 특성 상 전체 렌더링 속도가 저하될 수 있다는 단점이 있습니다. 만약, 데이터를 받아와야 렌더링할 수 있는 컴포넌트가 있다고 가정했을 때, 데이터를 받아오는 속도가 느린 환경이라면 해당 컴포넌트 때문에 전체 렌더링이 지연되는 경우가 발생합니다.

- Suspense를 적용한 페이지

![suspense light](/images/suspense/suspenseLight.png#light)
![suspense dark](/images/suspense/suspenseDark.png#dark)

이러한 문제를 해결하기 위해 Suspense 컴포넌트를 활용할 수 있습니다. **Suspense**는 동시성 매커니즘을 활용한 설계방식을 따르기 때문에 병렬적으로 렌더링할 수 있도록 보장합니다. 위 상황의 경우, 우선 Suspense는 데이터를 받아올 때까지 기다리지 않고 나머지 부분에 대한 렌더링 작업을 진행합니다. 데이터를 받아오는 시간동안 해당 컴포넌트의 렌더링 과정을 **중단**한 채 대체 UI (fallback)를 보여줍니다. 그리고 데이터 로딩이 완료되면 렌더링 과정을 **재개**하여 해당 컴포넌트를 완전히 렌더링합니다.

---

Suspense는 각 컴포넌트가 **독립적으로** 데이터를 로드하고 **동시에** 렌더링할 수 있는 유연성을 제공합니다. 즉, SSR 방식으로 페이지를 불러오더라도 전체 페이지에 대한 로딩 지연 문제를 해결하고 데이터를 불러오는 진행 상황을 사용자에게 알려줄 수 있습니다. 이처럼 React 18에서 Suspense는 SSR 과정의 효율성을 높이는 핵심 요소로 자리매김하게 되었습니다.

우리도 Suspense라는 꽃을 잘 활용하여 사용자 경험을 향상시킬 수 있는 코드를 작성하면 어떨까요?

### 출처

- [[Dan Abramov] New Suspense SSR Architecture in React 18](https://github.com/reactwg/react-18/discussions/37)
- [[카카오페이 블로그] Concurrent UI Pattern을 도입하는 방법](https://tech.kakaopay.com/post/react-query-2/)

---

_학습 중인 내용을 정리하는 초보 개발자입니다. 잘못된 내용이 있다면 피드백 부탁드립니다._
