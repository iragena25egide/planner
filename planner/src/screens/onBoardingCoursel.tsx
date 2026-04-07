import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { slides } from '../data/onboarding';

const { width, height } = Dimensions.get('window');

export default function OnboardingCarousel() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  // Auto-scroll effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoScrollEnabled) {
      timer = setTimeout(() => {
        if (currentIndex < slides.length - 1) {
          flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
        }
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [currentIndex, autoScrollEnabled]);

  // Update current index on scroll
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        if (index !== currentIndex) {
          setCurrentIndex(index);
          setAutoScrollEnabled(false);
        }
      },
    }
  );

  
  const getImageTranslateX = (index: number) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    return scrollX.interpolate({
      inputRange,
      outputRange: [width * 0.3, 0, -width * 0.3],
      extrapolate: 'clamp',
    });
  };

 
  const getTextOpacity = (index: number) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    return scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });
  };

  
  const buttonScale = new Animated.Value(1);
  const animateButton = () => {
    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 1.05, useNativeDriver: true, speed: 50 }),
      Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
  };

  const renderItem = ({ item, index }: { item: typeof slides[0]; index: number }) => {
    const imageTranslateX = getImageTranslateX(index);
    const textOpacity = getTextOpacity(index);

    return (
      <View style={styles.slide}>
        <Animated.View
          style={[
            styles.imageContainer,
            { transform: [{ translateX: imageTranslateX }] },
          ]}
        >
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        </Animated.View>
        <Animated.Text style={[styles.title, { opacity: textOpacity }]}>
          {item.title}
        </Animated.Text>
        <Animated.Text style={[styles.description, { opacity: textOpacity }]}>
          {item.description}
        </Animated.Text>
      </View>
    );
  };

  const goToNext = () => {
    animateButton();
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      navigation.replace('Home');
    }
  };

  const goToHome = () => {
    navigation.replace('Home');
  };

  
  const getIndicatorWidth = (index: number) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    const outputRange = [8, 24, 8];
    return scrollX.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    });
  };

  const getIndicatorColor = (index: number) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    return scrollX.interpolate({
      inputRange,
      outputRange: ['#cbd5e0', '#667eea', '#cbd5e0'],
      extrapolate: 'clamp',
    });
  };

  return (
    <LinearGradient colors={['#f9f9ff', '#eef2ff']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      
      <TouchableOpacity onPress={goToHome} style={styles.skipButton}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      
      <View style={styles.indicatorsContainer}>
        {slides.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.indicator,
              {
                width: getIndicatorWidth(index),
                backgroundColor: getIndicatorColor(index),
              },
            ]}
          />
        ))}
      </View>

      
      <Animated.View style={{ transform: [{ scale: buttonScale }], width: width - 64 }}>
        <TouchableOpacity onPress={goToNext} style={styles.button}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4a5568',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 32,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  button: {
    width: '100%',
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 40,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});