import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Easing } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ExpandableItemProps {
    title: string;
    content: React.ReactNode;
    image_url?: string;
}

const ExpandableItem: React.FC<ExpandableItemProps> = ({ title, content, image_url }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);
    const animationHeight = useRef(new Animated.Value(0)).current;

    const contentHeight = useRef(0);

    const toggleExpansion = () => {
        const next = !isExpanded;
        setIsExpanded(next);

        Animated.timing(animationHeight, {
            toValue: next ? contentHeight.current : 0,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    };
    useEffect(() => {
        setImageLoadError(false);
    }, [image_url]);

    return (
        <View style={styles.container}>

            {/* HEADER (Hiển thị)*/}
            <TouchableOpacity onPress={toggleExpansion} style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={22} />
            </TouchableOpacity>

            {/* ANIMATED CONTENT */}
            <Animated.View style={[styles.animated, { height: animationHeight }]}>
                <View style={styles.inner}>

                    {/* HÌNH Ở TRÊN NẾU CÓ */}
                      {/* HÌNH Ở TRÊN NẾU CÓ VÀ KHÔNG LỖI */}
                    {image_url && !imageLoadError && (
                        <Image
                            source={{ uri: image_url }}
                            style={styles.image}
                            onError={() => setImageLoadError(true)}
                        />
                    )}

                    {/* BÁO LỖI — chỉ hiện khi có URL nhưng load fail */}
                    {image_url && imageLoadError && (
                        <Text style={styles.errorText}>Không thể tải hình ảnh</Text>
                    )}

                    {/* TEXT Ở DƯỚI */}
                    {content}
                </View>
            </Animated.View>

            {/* MEASURE VIEW (Đo đạc)*/}
            <View
                style={styles.measure}
                onLayout={(e) => {
                    if (contentHeight.current === 0) {
                        contentHeight.current = e.nativeEvent.layout.height;
                    }
                }}
            >
                <View style={styles.inner}>
                    {image_url && !imageLoadError && (
                        <Image
                            source={{ uri: image_url }}
                            style={styles.image}
                            onError={() => setImageLoadError(true)}
                        />
                    )}

                    {image_url && imageLoadError && (
                        <Text style={styles.errorText}>Không thể tải hình ảnh</Text>
                    )}
                    {content}
                </View>
            </View>

        </View>
    );
};

export default ExpandableItem;

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: 8,
        backgroundColor: '#fff'
    },
    header: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    animated: {
        overflow: 'hidden',
    },
    inner: {
        padding: 15,
        gap: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    measure: {
        position: 'absolute',
        top: -9999,
        left: 0,
        right: 0,
        opacity: 0,
    },
    imagePlaceholder: {
        width: '100%',
        height: 200, 
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    contentImage: {
        width: '100%',
        height: 200, 
        marginBottom: 10,
        resizeMode: 'cover',
    },
    errorText: {
        color: '#999',
        fontStyle: 'italic',
        marginBottom: 10,
    },
});
