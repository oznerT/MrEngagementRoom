import React, { useCallback, useEffect, useState } from 'react';
import eventBus from '../EventBus';

type LoadingProps = {};

const LoadingScreen: React.FC<LoadingProps> = () => {
    const [progress, setProgress] = useState(0);
    const [toLoad, setToLoad] = useState(0);
    const [loaded, setLoaded] = useState(0);
    const [overlayOpacity, setLoadingOverlayOpacity] = useState(1);
    const [loadingTextOpacity, setLoadingTextOpacity] = useState(1);
    const [startPopupOpacity, setStartPopupOpacity] = useState(0);
    const [firefoxPopupOpacity, setFirefoxPopupOpacity] = useState(0);
    const [webGLErrorOpacity, setWebGLErrorOpacity] = useState(0);

    const [timeProgress, setTimeProgress] = useState(0);

    const [showBiosInfo, setShowBiosInfo] = useState(false);
    const [showLoadingResources, setShowLoadingResources] = useState(false);
    const [doneLoading, setDoneLoading] = useState(false);
    const [webGLError, setWebGLError] = useState(false);
    const [counter, setCounter] = useState(0);
    const [resources] = useState<string[]>([]);
    const [loadingMessages, setLoadingMessages] = useState<string[]>([]);
    const messages = [
        "Escaneando nivel de aburrimiento del usuario...",
        "Detectando vulnerabilidad a colores brillantes... [DETECTADO]",
        "Cargando algoritmos de retención...",
        "Bloqueando señales de 'La Revuelta'...",
        "Ignorando advertencias de salud mental...",
        "Calibrando filtros de perfección artificial...",
        "Sincronizando con: Mr. Engagement...",
        "ESTABLECIENDO CONEXIÓN NEURONAL...",
        "LISTO. YA SOS NUESTRO."
    ];
    const [mobileWarning, setMobileWarning] = useState(window.innerWidth < 768);

    const onResize = () => {
        if (window.innerWidth < 768) {
            setMobileWarning(true);
        } else {
            setMobileWarning(false);
        }
    };

    window.addEventListener('resize', onResize);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('debug')) {
            start();
        } else if (!detectWebGLContext()) {
            setWebGLError(true);
        } else {
            setShowBiosInfo(true);
        }

        // Start the 10-second timer
        const startTime = Date.now();
        const duration = 10000; // 10 seconds

        const timerInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newTimeProgress = Math.min(elapsed / duration, 1);
            setTimeProgress(newTimeProgress);

            if (newTimeProgress >= 1) {
                clearInterval(timerInterval);
            }
        }, 100);

        return () => clearInterval(timerInterval);
    }, []);

    useEffect(() => {
        eventBus.on('loadedSource', (data) => {
            setProgress(data.progress);
            setToLoad(data.toLoad);
            setLoaded(data.loaded);
        });
    }, []);

    useEffect(() => {
        // Calculate which message to show based on timeProgress
        // We have messages.length messages.
        // Map timeProgress (0 to 1) to (0 to messages.length - 1)
        const totalMessages = messages.length;
        const msgIndex = Math.min(Math.floor(timeProgress * totalMessages), totalMessages - 1);

        // Update the list of shown messages up to the current index
        // This ensures we show the history of "boot steps"
        setLoadingMessages(messages.slice(0, msgIndex + 1));
    }, [timeProgress]);

    useEffect(() => {
        setShowLoadingResources(true);
        setCounter(counter + 1);
    }, [loaded]);

    useEffect(() => {
        if (progress >= 1 && timeProgress >= 1 && !webGLError) {
            setDoneLoading(true);

            setTimeout(() => {
                setLoadingTextOpacity(0);
                setTimeout(() => {
                    setStartPopupOpacity(1);
                }, 500);
            }, 1000);
        }
    }, [progress, timeProgress]);

    useEffect(() => {
        if (webGLError) {
            setTimeout(() => {
                setWebGLErrorOpacity(1);
            }, 500);
        }
    }, [webGLError]);

    const start = useCallback(() => {
        setLoadingOverlayOpacity(0);
        eventBus.dispatch('loadingScreenDone', {});
        const ui = document.getElementById('ui');
        if (ui) {
            ui.style.pointerEvents = 'none';
        }
    }, []);

    const getSpace = (sourceName: string) => {
        let spaces = '';
        for (let i = 0; i < 24 - sourceName.length; i++) spaces += '\xa0';
        return spaces;
    };

    const getCurrentDate = () => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        // add leading zero
        const monthFormatted = month < 10 ? `0${month}` : month;
        const dayFormatted = day < 10 ? `0${day}` : day;
        return `${monthFormatted}/${dayFormatted}/${year}`;
    };

    const detectWebGLContext = () => {
        var canvas = document.createElement('canvas');

        // Get WebGLRenderingContext from canvas element.
        var gl =
            canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl');
        // Report the result.
        if (gl && gl instanceof WebGLRenderingContext) {
            return true;
        }
        return false;
    };

    return (
        <div
            style={Object.assign({}, styles.overlay, {
                opacity: overlayOpacity,
                transform: `scale(${overlayOpacity === 0 ? 1.1 : 1})`,
            })}
        >
            {startPopupOpacity === 0 && loadingTextOpacity === 0 && (
                <div style={styles.blinkingContainer}>
                    <span className="blinking-cursor" />
                </div>
            )}

            {/* Background Spinnning Coin */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 0,
                opacity: 0.8,
                pointerEvents: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <img
                    src="/real_coin_logo.jpg"
                    alt="Coin Logo"
                    className="spinning-coin"
                    width={200}
                    height={200}
                    style={{ borderRadius: '50%' }}
                />
            </div>

            {!webGLError && (
                <div
                    style={Object.assign({}, styles.overlayText, {
                        opacity: loadingTextOpacity,
                    })}
                >
                    <div
                        style={styles.header}
                        className="loading-screen-header"
                    >
                        <div style={styles.logoContainer}>
                            <div>
                                <p style={styles.green}>
                                    <b>INICIANDO DOPA-OS v4.0...</b>{' '}
                                </p>
                            </div>
                        </div>
                        <div style={styles.headerInfo}>
                            <p>(C) 2025 ENGAGEMENT CORP.</p>
                            <p>Todos los derechos de tu atención reservados.</p>
                        </div>
                    </div>
                    <div style={styles.body} className="loading-screen-body">
                        <div style={styles.spacer} />
                        <div style={styles.resourcesLoadingList}>
                            {loadingMessages.map((msg, index) => (
                                <p key={index}>{msg}</p>
                            ))}
                        </div>
                        <div style={styles.spacer} />
                        <span className="blinking-cursor" />
                    </div>
                    <div
                        style={styles.footer}
                        className="loading-screen-footer"
                    >
                        <p>
                            ESTADO: {progress >= 1 && timeProgress >= 1 ? "CONECTADO" : "INICIALIZANDO..."}
                        </p>
                        <p>{getCurrentDate()}</p>
                    </div>
                </div>
            )}
            <div
                style={Object.assign({}, styles.popupContainer, {
                    opacity: startPopupOpacity,
                })}
            >
                <div style={styles.startPopup}>
                    <h1 style={styles.legalTitle}>ACUERDO DE CESIÓN DE VOLUNTAD</h1>
                    <h2 style={styles.legalSubtitle}>MR. ENGAGEMENT CORP - v4.0</h2>

                    <div style={styles.legalBody}>
                        <p>Por la presente, el USUARIO renuncia a su capacidad de enfoque sostenido.</p>
                        <br />
                        <p>Al continuar, usted acepta el consumo no regulado de dopamina barata, la pérdida de la noción del tiempo y la exposición a contenido altamente adictivo diseñado por nuestras IAs.</p>
                        <br />
                        <p>La resistencia es inútil. La satisfacción es efímera.</p>
                    </div>

                    <div style={styles.buttonContainer}>
                        <div
                            className="bios-start-button"
                            onClick={start}
                            style={styles.primaryButton}
                        >
                            [ ACEPTAR Y OBEDECER ]
                        </div>
                        <div style={styles.secondaryButton}>
                            Rechazar y ser libre
                        </div>
                    </div>
                </div>
            </div>
            {webGLError && (
                <div
                    style={Object.assign({}, styles.popupContainer, {
                        opacity: webGLErrorOpacity,
                    })}
                >
                    <div style={styles.startPopup}>
                        <p>
                            <b style={{ color: 'red' }}>CRITICAL ERROR:</b> No
                            WebGL Detected
                        </p>
                        <div style={styles.spacer} />
                        <div style={styles.spacer} />

                        <p>WebGL is required to run this site.</p>
                        <p>
                            Please enable it or switch to a browser which
                            supports WebGL
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles: StyleSheetCSS = {
    overlay: {
        backgroundColor: 'black',
        width: '100%',
        height: '100%',
        display: 'flex',
        transition: 'opacity 0.2s, transform 0.2s',
        MozTransition: 'opacity 0.2s, transform 0.2s',
        WebkitTransition: 'opacity 0.2s, transform 0.2s',
        OTransition: 'opacity 0.2s, transform 0.2s',
        msTransition: 'opacity 0.2s, transform 0.2s',

        transitionTimingFunction: 'ease-in-out',
        MozTransitionTimingFunction: 'ease-in-out',
        WebkitTransitionTimingFunction: 'ease-in-out',
        OTransitionTimingFunction: 'ease-in-out',
        msTransitionTimingFunction: 'ease-in-out',

        boxSizing: 'border-box',
        fontSize: 16,
        letterSpacing: 0.8,
        fontFamily: 'Courier New, Roboto Mono, monospace', // Monospace for technical look
    },

    spacer: {
        height: 16,
    },
    header: {
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
    },
    popupContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100, // Ensure it's on top
    },
    warning: {
        color: 'yellow',
    },
    blinkingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        boxSizing: 'border-box',
        padding: 48,
    },
    startPopup: {
        backgroundColor: '#1a1a1a', // Dark Grey
        padding: 32,
        border: '2px solid white', // 2px Solid White
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: 600, // Wider max-width
        width: '90%', // Responsive width
        boxShadow: '0 0 20px rgba(0,0,0,0.8)',
    },
    headerInfo: {
        marginLeft: 64,
    },
    red: {
        color: '#00ff00',
    },
    link: {
        // textDecoration: 'none',
        color: '#4598ff',
        cursor: 'pointer',
    },
    overlayText: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 20, // Add some padding
    },
    body: {
        flex: 1,
        display: 'flex',
        width: '100%',
        boxSizing: 'border-box',
        flexDirection: 'column',
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    resourcesLoadingList: {
        display: 'flex',
        paddingLeft: 32,
        paddingBottom: 32,
        flexDirection: 'column',
    },
    logoImage: {
        width: 64,
        height: 42,
        imageRendering: 'pixelated',
        marginRight: 16,
    },
    footer: {
        boxSizing: 'border-box',
        width: '100%',
    },
    // New styles for the Legal Contract
    legalTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        textAlign: 'center',
        letterSpacing: '1px',
    },
    legalSubtitle: {
        fontSize: '0.9rem',
        marginBottom: '1.5rem',
        textAlign: 'center',
        opacity: 0.8,
        borderBottom: '1px solid #555',
        paddingBottom: '0.5rem',
    },
    legalBody: {
        fontSize: '0.85rem',
        lineHeight: '1.4',
        marginBottom: '2rem',
        textAlign: 'justify',
        opacity: 0.9,
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'center',
        width: '100%',
    },
    primaryButton: {
        background: 'white',
        color: 'black',
        border: '2px solid white',
        padding: '12px 24px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        transition: 'all 0.2s',
        width: '100%',
        textAlign: 'center',
    },
    secondaryButton: {
        background: 'transparent',
        color: '#888',
        border: 'none',
        padding: '8px',
        fontSize: '0.8rem',
        cursor: 'not-allowed',
        opacity: 0.5,
        pointerEvents: 'none', // Make unclickable
    }
};

export default LoadingScreen;
