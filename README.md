# react-native-observable-hooks-focus-subscription-plugin

Focus Effect observable hook for react native

## Installation

```sh
yarn add react-native-observable-hooks-focus-subscription-plugin @react-navigation/native observable-hooks rxjs
```

## Usage

```javascript

import { useFocusSubscription } from 'react-native-observable-hooks-focus-subscription-plugin';

const MyScreen = () => {

  const count$ = interval(1000)
  const observer = {
    next: (value: number) => {
      console.log(value)
    },
  }

  useFocusSubscription(count$, observer)

  return (
    <View>
      <Text>My Screen</Text>
    </View>
  )
}
```


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
