import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { Switch, Button, ToggleButton } from 'react-native-paper';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import * as StoreReview from 'expo-store-review';
import { Linking } from 'expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, urls, calcFromHeight } from '../lib/constants';

import { connect } from 'react-redux';
import {
    setCurrentTheme,
    enableSystemTheme,
    enableHaptics,
} from '../redux/settings/settings.action';
import { createStructuredSelector } from 'reselect';
import {
    selectTheme,
    selectSystemTheme,
    selectHaptics,
} from '../redux/settings/settings.selectors';
import { ThemeMode } from '../types/Theme';
import { handleError } from '../lib/handleError';
import { openLink } from '../lib/openLink';
import { useDimensions } from '@react-native-community/hooks';

interface Props {
    theme: ThemeMode;
    systemThemeEnabled: boolean;
    setCurrentTheme: (param: ThemeMode) => void;
    enableSystemTheme: (param: boolean) => void;
    enableHaptics: (param: boolean) => void;
    hapticsEnabled: boolean;
}

const SettingsScreen: React.FC<Props> = ({
    theme,
    systemThemeEnabled,
    setCurrentTheme,
    enableSystemTheme,
    enableHaptics,
    hapticsEnabled,
}) => {
    const [selectedTheme, setSelectedTheme] = useState('system');

    const { width, height } = useDimensions().window;

    const styles = getStyleSheet(theme, height);

    useEffect(() => {
        if (systemThemeEnabled) setSelectedTheme('system');
        else setSelectedTheme(theme);
    }, []);

    const onValueChange = (value: 'system' | ThemeMode) => {
        if (value) {
            if (Platform.OS === 'ios' && hapticsEnabled)
                Haptics.selectionAsync();
            if (value === 'system') {
                enableSystemTheme(true);
                setSelectedTheme('system');
            }
            if (value === 'light' || value === 'dark') {
                setSelectedTheme(value);
                setCurrentTheme(value);
                enableSystemTheme(false);
            }
        }
    };

    const sendEmail = () => {
        try {
            if (Platform.OS === 'ios' && hapticsEnabled)
                Haptics.selectionAsync();
            Linking.openURL('mailto:andor.davoti@gmail.com');
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <View style={styles.container}>
            <Text
                style={[
                    styles.text,
                    {
                        margin: 0,
                        marginBottom: calcFromHeight(8, height),
                    },
                ]}
            >
                Theme:
            </Text>
            <ToggleButton.Row
                style={{ marginBottom: calcFromHeight(15, height) }}
                onValueChange={onValueChange}
                value={selectedTheme}
            >
                <ToggleButton
                    activeOpacity={0.6}
                    underlayColor={colors[theme].text}
                    color={
                        selectedTheme === 'system'
                            ? colors[theme].bg
                            : colors[theme].text
                    }
                    style={
                        selectedTheme === 'system'
                            ? styles.buttonGroupSelected
                            : styles.buttonGroup
                    }
                    icon="theme-light-dark"
                    value="system"
                />
                <ToggleButton
                    activeOpacity={0.6}
                    underlayColor={colors[theme].text}
                    color={
                        selectedTheme === 'light'
                            ? colors[theme].bg
                            : colors[theme].text
                    }
                    style={
                        selectedTheme === 'light'
                            ? styles.buttonGroupSelected
                            : styles.buttonGroup
                    }
                    icon="weather-sunny"
                    value="light"
                />
                <ToggleButton
                    activeOpacity={0.6}
                    underlayColor={colors[theme].text}
                    color={
                        selectedTheme === 'dark'
                            ? colors[theme].bg
                            : colors[theme].text
                    }
                    style={
                        selectedTheme === 'dark'
                            ? styles.buttonGroupSelected
                            : styles.buttonGroup
                    }
                    icon="weather-night"
                    value="dark"
                />
            </ToggleButton.Row>
            {Platform.OS === 'ios' ? (
                <View style={styles.row}>
                    <Text style={styles.text}>Haptics:</Text>
                    <Switch
                        color={colors[theme].main}
                        value={hapticsEnabled}
                        onValueChange={() => enableHaptics(!hapticsEnabled)}
                    />
                </View>
            ) : null}

            <View>
                <Text style={styles.header}>About the App:</Text>
                <Text
                    style={[
                        styles.text,
                        { marginBottom: calcFromHeight(15, height) },
                    ]}
                >
                    Developed by:
                </Text>
                <View style={styles.row}>
                    <TouchableOpacity
                        onPress={() => openLink(urls.andorGithub)}
                    >
                        <Text style={styles.textAuthor}>Andor Davoti</Text>
                    </TouchableOpacity>
                    <Text
                        style={[
                            styles.text,
                            {
                                marginBottom: calcFromHeight(15, height),
                                margin: calcFromHeight(4, height),
                            },
                        ]}
                    >
                        &#38;{' '}
                    </Text>

                    <TouchableOpacity
                        onPress={() => openLink(urls.sannaGithub)}
                    >
                        <Text style={styles.textAuthor}>Sanna Jammeh</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[
                        styles.row,
                        { marginBottom: calcFromHeight(15, height) },
                    ]}
                    onPress={() => openLink(urls.projectGithub)}
                >
                    <MaterialCommunityIcons
                        color={colors[theme].text}
                        name="github-circle"
                        size={25}
                    />
                    <Text style={styles.text}>Project on GitHub</Text>
                    <MaterialCommunityIcons
                        color={colors[theme].text}
                        name="github-circle"
                        size={25}
                    />
                </TouchableOpacity>
                <View
                    style={{ flexDirection: 'row', justifyContent: 'center' }}
                >
                    {Platform.OS !== 'web' ? (
                        <Button
                            mode="contained"
                            style={styles.button}
                            labelStyle={{ color: 'white' }}
                            onPress={() => {
                                if (Platform.OS === 'ios' && hapticsEnabled)
                                    Haptics.selectionAsync();
                                StoreReview.requestReview();
                            }}
                        >
                            Rate App
                        </Button>
                    ) : null}
                    <Button
                        mode="contained"
                        style={styles.button}
                        labelStyle={{ color: 'white' }}
                        onPress={sendEmail}
                    >
                        Contact us
                    </Button>
                </View>
                <Text style={styles.textVersion}>
                    Version: {Constants.manifest.version}
                </Text>
            </View>
        </View>
    );
};

const mapStateToProps = createStructuredSelector<any, any>({
    theme: selectTheme,
    systemThemeEnabled: selectSystemTheme,
    hapticsEnabled: selectHaptics,
});

const getStyleSheet = (theme: ThemeMode, height: number) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors[theme].bg,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            textAlign: 'center',
            fontSize: 20,
            color: colors[theme].text,
            margin: calcFromHeight(8, height),
            fontWeight: 'bold',
        },
        textAuthor: {
            textAlign: 'center',
            fontSize: 20,
            color: colors[theme].text,
            margin: calcFromHeight(4, height),
            marginBottom: 20,
            fontStyle: 'italic',
        },
        textVersion: {
            textAlign: 'center',
            fontSize: 20,
            color: colors[theme].text,
            marginTop: calcFromHeight(15, height),
            fontWeight: 'bold',
        },
        header: {
            textAlign: 'center',
            fontSize: 25,
            color: colors[theme].text,
            fontWeight: '600',
            margin: calcFromHeight(15, height),
            marginTop: calcFromHeight(30, height),
            textDecorationLine: 'underline',
        },
        button: {
            margin: calcFromHeight(8, height),
            backgroundColor: colors[theme].main,
        },
        buttonGroup: {
            backgroundColor: colors[theme].main,
        },
        buttonGroupSelected: {
            backgroundColor: colors[theme].text,
        },
    });
};

export default connect(mapStateToProps, {
    setCurrentTheme,
    enableSystemTheme,
    enableHaptics,
})(SettingsScreen);
