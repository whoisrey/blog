---
external: false
title: React 18에서 Suspense의 역할
description: React 18에서 달라진 Suspense의 비중에 대해 설명합니다.
date: 2024-11-23
---

{% kbd %}Suspend [səˈspend] 지연시키다.{% /kbd %}

Suspense는 단어 Suspend에서 기원한 이름으로, 하위 컴포넌트가 로드되기 전까지 지연시키는 상황에 대체 UI를 표시하는 기능을 제공하는 React 컴포넌트입니다. 대체 UI를 보여주는 방식은 Suspense 없이도 구현할 수 있지만, React 팀이 18 버전에서 이 기능을 강조한 데는 또다른 이유가 있을거라 생각합니다. 그렇다면, Suspense는 어떤 상황에서 사용하도록 설계된 것일까요?

### Suspense가 등장한 이유

React 18은 서버 사이드 렌더링(SSR) 성능에 대한 아키텍처를 대폭 개선하였습니다.
기존의 React의 SSR 과정은 다음과 같이 진행되었습니다.

- 서버에서 앱 데이터를 가져옵니다.
- 서버에서 가져온 데이터를 기반으로 HTML을 생성하여 클라이언트로 응답합니다.
- 클라이언트에서 JavaScript 코드를 불러옵니다.
- 클라이언트에서 서버에서 생성된 HTML과 JavaScript를 연결하여 동적으로 작동하도록 설정합니다. (Hydration)

이 과정에서는 반드시 각 단계가 순차적으로 진행되어야 합니다. React 팀은 이러한 SSR 과정이 waterfall 방식으로 진행되는 것이 문제라고 판단하였습니다. React 18에서는 이러한 문제를 해결하기 위해 {% mark %}<Suspense>{% /mark %}를 도입하여 SSR 과정을 세분화하고 병렬화할 수 있도록 개선하였습니다.

### Suspense가 가져온 이점

Suspense는 SSR 과정을 화면 일부에 대해 작업을 진행할 수 있도록 분리하고 동시성(Concurrent)을 보장하는 강력한 기능이 있습니다.

예를 들어, SSR로 페이지를 렌더링하는 상황을 두 가지로 나누어 그려보겠습니다.
먼저, Suspense를 적용하지 않은 페이지입니다.

![html](/images/html.png)

이 페이지는 HTML을 생성하기 위해 서버에서 모든 데이터를 받아와야 합니다. 또한, 클라이언트에서 생성된 HTML과 JavaScript를 연결하기 위해 코드를 모두 불러와야 합니다. 이처럼 전 단계를 진행해야 다음 단계를 진행할 수 있는 과정의 특성 상, 특정 단계가 느려지면 전체 렌더링 속도가 저하될 수 있다는 단점이 있었습니다.

다음은 데이터를 받아오는데 느린 컴포넌트(Comments)를 Suspense로 감싼 페이지입니다.

![suspense](/images/suspense.png)

Suspense는 해당 컴포넌트 때문에 나머지 컴포넌트들이 기다릴 필요가 없다고 알려줍니다. React는 이를 듣고 나머지 부분에 대한 작업을 진행하고 Comments 컴포넌트의 데이터를 불러오는 동안 fallback 속성으로 제공한 스피너로 대체하여 보여줍니다. 스피너가 종료되고 데이터를 모두 받아오면 React는 동일한 스트림에 HTML을 전송하고 `<script>` 태그를 활용하여 HTML을 올바른 위치에 배치합니다.

```html
<script>
  document
    .getElementById("spinner")
    .replaceChildren(document.getElementById("comments"));
</script>
```

이러한 방식으로 Suspense는 기존의 HTML 렌더링은 반드시 위에서 아래로(top-down) 진행되어야 하는 제한을 넘어, 각 컴포넌트가 독립적으로 데이터를 로드하고 동시에 렌더링할 수 있는 유연성을 제공합니다. 이를 통해 SSR 환경에서도 페이지 로딩 속도를 개선하고 사용자 경험을 향상시킬 수 있습니다.
