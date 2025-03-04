---
external: false
title: JavaScript의 메모리 관리법
description: JavaScript가 Garbage Collector 매커니즘을 통해 메모리를 관리하는 내용입니다.
date: 2024-11-14
---

컴퓨터를 사용할 때 가장 답답한 순간은 언제인가요? 아마도 성능 저하로 인해 시스템이 느려질 때일 것입니다. 하지만 컴퓨터가 느려지는 현상이 과연 우연일까요? 대부분의 경우, 이러한 문제는 **메모리 관리**와 깊은 관련이 있습니다. 컴퓨터는 제한된 메모리를 활용해 프로그램을 실행하기 때문에, 과도한 메모리 사용은 성능 저하를 초래할 수 있습니다. 따라서, 효율적인 메모리 관리는 우리와 컴퓨터의 관계를 건강하게 유지하기 위한 필수 요소입니다.

## 메모리 관리

컴퓨터 성능 저하를 방지하려면, 프로그램이 필요한 메모리를 할당하고 사용이 끝난 메모리는 해제해야 합니다. 이를 메모리 관리라고 합니다. 저수준 언어(C, C++)에서는 개발자가 직접 malloc, realloc, calloc, free와 같은 함수를 사용해 메모리를 관리해야 합니다. 하지만 이런 방식은 세심한 관리가 부족할 경우 메모리 누수로 이어질 수 있습니다. 이를 해결하기 위해, 1959년 존 맥카시가 설계한 **가비지 컬렉션(Garbage Collection)** 기법이 등장했습니다. 이 기법은 더 이상 사용되지 않는 메모리를 자동으로 해제해 개발자의 부담을 줄이고, 메모리 누수를 방지합니다. 그렇다면 우리에게 친숙한 JavaScript에서 메모리 관리는 어떻게 진행할까요?

## JavaScript에서 메모리 생명주기

JavaScript는 고수준 언어로, 개발자가 직접 메모리를 관리하지 않아도 됩니다. 이는 각 브라우저에 내장된 JavaScript 엔진이 가비지 컬렉션 기법을 활용해 **자동으로 메모리를 관리**하기 때문입니다. 이 글에서는 특히 Google Chrome의 V8 엔진이 메모리를 어떻게 관리하는지 살펴보겠습니다.
우선, JavaScript에서 메모리는 다음과 같은 생명주기를 거칩니다.

1. 변수를 선언할 때 메모리가 **할당**됩니다.
2. 할당된 값은 Stack 또는 Heap 영역에 **저장**됩니다.
   - Stack: 원시 타입 값(숫자, 문자열 등)을 저장하고, 호출이 끝나면 운영체제가 자동으로 해제합니다.
   - Heap: 참조 타입 값(객체, 배열 등)을 저장하고 가비지 컬렉션이 불필요한 변수를 파악합니다.
3. 더 이상 필요하지 않은 메모리는 **해제**됩니다.

이처럼 V8 엔진의 가비지 컬렉션이 Heap 영역의 불필요한 메모리를 해제하면서 메모리를 효율적으로 관리함과 동시에 프로그램의 성능을 유지합니다.

## 가비지 컬렉션의 메모리 관리 방식

이제는 가비지 컬렉션이 어떻게 불필요한 메모리를 해제하는지에 대해 설명해보려 합니다. 가비지 컬렉션은 **도달 가능성이 없는(unreachable) 메모리**를 불필요하다고 판단하여 해제합니다. 여기서 도달 가능성이 없다는 것은, 전역 객체에서 참조할 수 없는 값들을 의미합니다. 예를 들어, 다른 객체나 변수에서 참조되지 않는 값은 더 이상 필요 없는 것으로 간주됩니다. 하지만 V8 엔진은 모든 참조 체인을 매번 검사하는 방식이 비효율적이라는 점을 인식하고, *The Generational Hypothesis*에 기반한 메모리 관리 방식을 채택했습니다.

- _The Generational Hypothesis_

  1. 새로운 객체는 오래된 객체보다 빨리 쓸모없어질 가능성이 높다.
  2. 오래된 객체는 새롭게 생성된 객체보다 생존 확률이 높다.

V8 엔진은 이 가설에 따라 메모리를 관리하는 Heap을 두 영역으로 나누어 관리합니다. 두 영역은 새로운 객체를 관리하는 **New Space**, 오래된 객체를 관리하는 **Old Space**로 나뉩니다.

![memory light](/images/garbage-collector/memoryLight.png#light)
![memory dark](/images/garbage-collector/memoryDark.png#dark)

그렇다면 New Space와 Old Space는 각각 어떻게 메모리를 관리할까요?

---

- New Space

  **새로 생성된 객체**는 먼저 New Space에 저장됩니다. 이 공간은 두 개의 semi-space로 나뉘는데 두 semi-space와 New Space에서 수행되는 가비지 컬렉션인 **Minor GC**를 활용하여 메모리 해제 작업을 진행합니다.

  1. 현재 semi-space에 있는 객체 중 도달 가능성이 없는 객체는 즉시 해제됩니다.
  2. 도달 가능한 객체는 다른 semi-space로 복사됩니다.
  3. 두 번의 Minor GC 과정에서 생존한 객체는 **Old Space**로 이동합니다.

![new light](/images/garbage-collector/newLight.png#light)
![new dark](/images/garbage-collector/newDark.png#dark)

이 영역에서는 매번 검사할 필요 없이 불필요한 객체를 빠르게 정리하고, 생존 가능성이 높은 객체 (**두 번**의 Minor GC에서 생존한)를 오래된 객체로 분류하여 Old Space로 이동시킵니다.

---

- Old Space

  New Space에서 분류된 **오래된 객체**는 Old Space에 저장됩니다. Old Space에서 수행되는 가비지 컬렉션을 **Major GC**라고 하며, *Mark & Sweep*과 _Tri-color Marking_ 알고리즘을 함께 활용하여 메모리를 해제합니다.

  1. _Mark_

     전역 객체(Roots)에서 시작하여, 참조 가능한 객체를 깊이 우선 탐색(DFS) 기법으로 순회하며 마킹합니다. 이 때, 객체의 마킹은 아래와 같이 _Tri-color_ 방식으로 이루어집니다.

     - 흰색: 아직 탐색되지 않은 객체
     - 회색: 탐색 중인 객체
     - 검은색: 참조 관계가 확인된 객체

  2. _Sweep_

     마킹이 끝난 뒤, 흰색 객체는 더 이상 참조되지 않기 때문에 메모리를 **해제**합니다.

  ![old light](/images/garbage-collector/oldLight.png#light)
  ![old dark](/images/garbage-collector/oldDark.png#dark)

이 영역에서는 생존 가능성이 높은 객체들을 꼼꼼하게 점검하여 메모리 해제 작업을 New Space에 비해 신중하게 진행합니다.

## V8 엔진이 생각한 메모리 관리 최적화

메모리 관리 작업을 수행하는 가비지 컬렉션은 프로그램이 일시적으로 멈추는 STW(stop-the-world) 상태를 유발하기도 합니다. 이는 사용자의 경험을 저해할 수 있기 때문에, V8 엔진은 이를 최소화할 필요성을 느끼게 되었습니다. 그리하여 **Orinoco** 프로젝트를 통해 가비지 컬렉션 작업을 효율적으로 수행하는 방법을 발전시켰습니다.

- Parallel

  기존에는 Main Thread가 혼자 하던 일을 Helper Thread들과 **균등하게 나누어** 처리합니다. Thread 간의 동기화를 처리해야 해서 오버헤드는 생기지만 STW 시간이 크게 감소합니다.

- Incremental

  Main Thread가 적은 양의 작업을 **간헐적으로** 처리합니다. Main Thread에서 가비지 컬렉션에 소요하는 시간이 분산되어, 좋은 UX를 제공할 수 있습니다.

- Concurrent

  가비지 컬렉션 작업을 Main Thread가 아닌 **Helper Thread들만이** 처리합니다. 기술적으로 구현하기는 어렵지만, Main Thread의 STW 시간이 전혀 없다는 큰 장점이 있습니다.

  ![orinoco light](/images/garbage-collector/orinocoLight.png#light)
  ![orinoco dark](/images/garbage-collector/orinocoDark.png#dark)

  (우리가 알고 있는 JavaScript는 Single Thread라고 알고 있습니다. 이 때, Helper Thread는 JavaScript 코드를 실행하는 Thread가 아니라 다른 목적으로 사용하는 Work Thread로 언제든지 추가할 수 있습니다.)

V8 엔진은 Thread를 유연하게 활용하는 기술들을 통해 사용자 경험을 향상시키면서 메모리를 효율적으로 관리할 수 있도록 발전해왔습니다.

---

JavaScript는 브라우저 내 엔진의 **가비지 컬렉션**을 통해 오래된 객체와 새로운 객체를 구분하여 효율적으로 불필요한 메모리를 해제하고, Helper Thread를 활용해 STW를 최소화하며 **자동으로** 메모리를 관리합니다. 이러한 자동 메모리 관리 덕분에 생산성을 높이기 위한 웹 개발자의 부담을 덜어줄 수 있습니다. 하지만 가비지 컬렉션이 어떻게 작동하는지 이해하면, 코드의 성능을 더 효과적으로 최적화할 수 있다고 생각합니다.

자동으로 관리되더라도, 메모리를 아끼는 코딩 습관을 통해 컴퓨터의 답답함을 덜어주면 어떨까요?

### 출처

- [[V8 Engine] Orinoco Project](https://v8.dev/blog/trash-talk)
- [[MDN] JavaScript의 메모리 관리](https://developer.mozilla.org/ko/docs/Web/JavaScript/Memory_management)

---

_학습 중인 내용을 정리하는 초보 개발자입니다. 잘못된 내용이 있다면 피드백 부탁드립니다._
