import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface WaveCurveProps {
  fillColor: string;
  height?: number;
}

export default function WaveCurve({
  fillColor,
  height = 60,
}: WaveCurveProps) {
  const { width } = useWindowDimensions();
  const safeWidth = Math.max(width, 320);

  // Single smooth curve: dips into a valley (~1/3 across), then rises to the right
  const path = `
    M 0 ${height}
    L 0 12
    Q ${safeWidth * 0.35} ${height} ${safeWidth} 12
    L ${safeWidth} ${height}
    Z
  `;

  return (
    <View style={styles.container} accessible={false}>
      <Svg width={safeWidth} height={height} viewBox={`0 0 ${safeWidth} ${height}`}>
        <Path d={path.trim()} fill={fillColor} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
  },
});
