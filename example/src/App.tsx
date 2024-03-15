import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { useFocusSubscription } from 'react-native-observable-hooks-react-native-focus-plugin';
import { interval } from 'rxjs';

export default function App() {
  const [result] = React.useState<number | undefined>();
  const count$ = interval(1000);
  const observer = {
    next: (value: number) => {
      console.log(value);
    },
  };

  useFocusSubscription(count$, observer);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
