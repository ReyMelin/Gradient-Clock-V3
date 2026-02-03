const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

const themes = {
    metallic: {
        seconds: [210, 15, 85, 75, 55, 35, 25, 18, 25, 35, 55, 75, 85],
        minutes: [45, 70, 75, 65, 50, 35, 25, 18, 25, 35, 50, 65, 75],
        hours: [25, 65, 70, 60, 45, 32, 23, 16, 23, 32, 45, 60, 70]
    },
    winter: {
        seconds: [200, 80, 95, 85, 70, 50, 35, 25, 35, 50, 70, 85, 95],
        minutes: [180, 60, 90, 80, 65, 45, 30, 20, 30, 45, 65, 80, 90],
        hours: [220, 50, 85, 75, 60, 40, 25, 15, 25, 40, 60, 75, 85]
    },
    fall: {
        seconds: [25, 80, 70, 60, 45, 30, 20, 12, 20, 30, 45, 60, 70],
        minutes: [40, 75, 65, 55, 40, 28, 18, 10, 18, 28, 40, 55, 65],
        hours: [10, 70, 55, 45, 32, 22, 15, 8, 15, 22, 32, 45, 55]
    },
    space: {
        seconds: [270, 90, 75, 65, 50, 35, 25, 15, 25, 35, 50, 65, 75],
        minutes: [240, 80, 70, 60, 45, 30, 20, 12, 20, 30, 45, 60, 70],
        hours: [300, 85, 65, 55, 40, 28, 18, 10, 18, 28, 40, 55, 65]
    },
    dark: {
        seconds: [0, 0, 35, 30, 25, 20, 15, 10, 15, 20, 25, 30, 35],
        minutes: [0, 0, 30, 25, 20, 15, 12, 8, 12, 15, 20, 25, 30],
        hours: [0, 0, 25, 20, 15, 12, 10, 6, 10, 12, 15, 20, 25]
    },
    christmas: {
        seconds: [0, 85, 70, 60, 45, 30, 20, 12, 20, 30, 45, 60, 70],
        minutes: [120, 80, 75, 65, 50, 35, 25, 15, 25, 35, 50, 65, 75],
        hours: [40, 90, 95, 85, 70, 50, 35, 20, 35, 50, 70, 85, 95]
    },
    halloween: {
        seconds: [30, 100, 65, 55, 40, 28, 18, 10, 18, 28, 40, 55, 65],
        minutes: [270, 85, 55, 45, 32, 22, 15, 8, 15, 22, 32, 45, 55],
        hours: [130, 70, 35, 28, 20, 15, 12, 6, 12, 15, 20, 28, 35]
    },
    flowerpower: {
        seconds: [330, 95, 80, 70, 55, 40, 28, 18, 28, 40, 55, 70, 80],
        minutes: [60, 100, 75, 65, 50, 35, 25, 15, 25, 35, 50, 65, 75],
        hours: [280, 90, 70, 60, 45, 32, 22, 12, 22, 32, 45, 60, 70]
    },
    rgb: {
        seconds: [0, 100, 60, 50, 40, 30, 20, 12, 20, 30, 40, 50, 60],
        minutes: [120, 100, 60, 50, 40, 30, 20, 12, 20, 30, 40, 50, 60],
        hours: [240, 100, 60, 50, 40, 30, 20, 12, 20, 30, 40, 50, 60]
    }
};

function generateGradient(angle, colorData) {
    const [hue, sat, ...lightness] = colorData;
    return `conic-gradient(
        from ${angle}deg,
        hsl(${hue}, ${sat}%, ${lightness[0]}%) 0deg,
        hsl(${hue}, ${sat + 3}%, ${lightness[1]}%) 5deg,
        hsl(${hue}, ${sat + 5}%, ${lightness[2]}%) 15deg,
        hsl(${hue}, ${sat}%, ${lightness[3]}%) 30deg,
        hsl(${hue}, ${sat - 3}%, ${lightness[4]}%) 60deg,
        hsl(${hue}, ${sat - 5}%, ${lightness[5]}%) 120deg,
        hsl(${hue}, ${sat - 3}%, ${lightness[4]}%) 240deg,
        hsl(${hue}, ${sat}%, ${lightness[3]}%) 300deg,
        hsl(${hue}, ${sat + 5}%, ${lightness[2]}%) 345deg,
        hsl(${hue}, ${sat + 3}%, ${lightness[1]}%) 355deg,
        hsl(${hue}, ${sat}%, ${lightness[0]}%) 360deg
    )`;
}



function renderTexture(textureType, containerSelector = '.clock-container') {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    container.querySelectorAll('.clock-marker').forEach(marker => marker.remove());

    if (textureType === 'none') return;

    const isPreviewCard = containerSelector.includes('theme-card-preview');
    const clockSize = container.offsetWidth;
    // For preview cards: seconds ring is 90% of card (45% radius), position just inside at 42%
    // For main clock: seconds ring is 100% of clock (50% radius), position just inside at 47%
    const radius = isPreviewCard ? clockSize * 0.42 : clockSize * 0.47;
    const markerFontSize = isPreviewCard ? clockSize * 0.035 : clockSize * 0.04;
    const dotSize = clockSize * 0.013;

    let positions = [];
    if (textureType === 'cardinal') {
        positions = [0, 3, 6, 9];
    } else {
        positions = Array.from({length: 12}, (_, i) => i);
    }

    positions.forEach(i => {
        const angle = (i * 30) * Math.PI / 180;
        const x = radius * Math.sin(angle);
        const y = -radius * Math.cos(angle);

        const marker = document.createElement('div');
        marker.className = 'clock-marker';
        
        if (textureType === 'roman') {
            marker.textContent = romanNumerals[i];
            marker.style.fontSize = `${markerFontSize}px`;
        } else if (textureType === 'dots') {
            marker.classList.add('dot');
            marker.style.width = `${dotSize}px`;
            marker.style.height = `${dotSize}px`;
        } else if (textureType === 'numbers') {
            marker.textContent = i === 0 ? 12 : i;
            marker.style.fontSize = `${markerFontSize}px`;
        } else if (textureType === 'cardinal') {
            marker.textContent = i === 0 ? 12 : (i === 3 ? 3 : (i === 6 ? 6 : 9));
            marker.style.fontSize = `${markerFontSize}px`;
        } else if (textureType === 'mixed') {
            // Alternating roman numerals and dots
            if (i % 2 === 0) {
                marker.textContent = romanNumerals[i];
                marker.style.fontSize = `${markerFontSize}px`;
            } else {
                marker.classList.add('dot');
                marker.style.width = `${dotSize}px`;
                marker.style.height = `${dotSize}px`;
            }
        }

        marker.style.left = `50%`;
        marker.style.top = `50%`;
        marker.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        
        container.appendChild(marker);
    });
}

function loadConfig() {
    try {
        const saved = localStorage.getItem('gradientClockConfig');
        if (!saved) return false;

        const config = JSON.parse(saved);
        timeFormat = config.timeFormat ?? null;
        currentTheme = config.theme || 'metallic';
        currentTexture = config.texture || 'none';
        return true;
    } catch (e) {
        console.error('Failed to load config:', e);
        return false;
    }
}

function saveConfigToStorage() {
    try {
        const config = {
            timeFormat: timeFormat,
            theme: currentTheme,
            texture: currentTexture,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('gradientClockConfig', JSON.stringify(config));
    } catch (e) {
        console.error('Failed to save config:', e);
    }
}

function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;
    const milliseconds = now.getMilliseconds();

    const timeDisplay = document.querySelector('.time-display');
    const displayHours = String(now.getHours()).padStart(2, '0');
    const displayMinutes = String(minutes).padStart(2, '0');
    const displaySeconds = String(seconds).padStart(2, '0');
    
    if (timeFormat === 'military') {
        timeDisplay.textContent = `${displayHours}:${displayMinutes}:${displaySeconds}`;
        timeDisplay.classList.add('show');
    } else if (timeFormat === 'ampm') {
        const hour12 = now.getHours() % 12 || 12;
        const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
        timeDisplay.textContent = `${String(hour12).padStart(2, '0')}:${displayMinutes}:${displaySeconds} ${ampm}`;
        timeDisplay.classList.add('show');
    } else {
        timeDisplay.classList.remove('show');
    }

    // Only animate if enabled
    const secondsAngle = ((seconds + milliseconds / 1000) / 60) * 360;
    const minutesAngle = ((minutes + seconds / 60) / 60) * 360;
    const hoursAngle = ((hours + minutes / 60 + seconds / 3600) / 12) * 360;

    const theme = themes[currentTheme];
    const secondsRing = document.querySelector('.seconds-ring');
    const minutesRing = document.querySelector('.minutes-ring');
    const hoursRing = document.querySelector('.hours-ring');

    if (secondsRing && minutesRing && hoursRing) {
        secondsRing.style.background = generateGradient(secondsAngle, theme.seconds);
        minutesRing.style.background = generateGradient(minutesAngle, theme.minutes);
        hoursRing.style.background = generateGradient(hoursAngle, theme.hours);
    } else {
        console.warn('Clock rings not found in DOM!');
    }
}

// Global variables
let timeFormat = null; // null = hidden, 'military' = 24-hour, 'ampm' = 12-hour with AM/PM
let currentTheme = 'metallic';
let currentTexture = 'none';
let currentView = 'landing'; // 'landing', 'texture', or 'clock'
let rafId = null;
let launchedFromSavedConfig = false;

function clockLoop() {
    updateClock();
    rafId = requestAnimationFrame(clockLoop);
}

function startClock() {
    if (rafId) return;
    rafId = requestAnimationFrame(clockLoop);
}

function stopClock() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
}

// Initial update for any visible clock elements
updateClock();

// Main themes for landing page
const mainThemes = ['metallic', 'space', 'dark', 'flowerpower', 'winter', 'rgb'];

const themeNames = {
    metallic: 'Metallic',
    winter: 'Winter',
    space: 'Space',
    dark: 'Dark',
    flowerpower: 'Flower Power',
    rgb: 'RGB'
};

const textureNames = {
    none: 'None',
    roman: 'Roman Numerals',
    dots: 'Dots',
    numbers: 'Numbers (1-12)',
    cardinal: 'Cardinal (12,3,6,9)',
    mixed: 'Mixed Style'
};

// Main 6 textures for texture selection page
const mainTextures = ['none', 'roman', 'dots', 'numbers', 'cardinal', 'mixed'];

// Initialize landing page theme cards
function initLandingPage() {
    const container = document.getElementById('themeCards');
    container.innerHTML = '';
    
    mainThemes.forEach(themeId => {
        const wrapper = document.createElement('div');
        wrapper.className = 'theme-card-wrapper';
        
        const card = document.createElement('div');
        card.className = 'theme-card';
        
        const preview = document.createElement('div');
        preview.className = 'theme-card-preview';
        
        const theme = themes[themeId];
        
        // Create three concentric rings
        const secondsRing = document.createElement('div');
        secondsRing.className = 'theme-card-ring seconds';
        
        const minutesRing = document.createElement('div');
        minutesRing.className = 'theme-card-ring minutes';
        
        const hoursRing = document.createElement('div');
        hoursRing.className = 'theme-card-ring hours';
        
        // Apply gradients to each ring with static angle (0 degrees)
        secondsRing.style.background = generateGradient(0, theme.seconds);
        minutesRing.style.background = generateGradient(90, theme.minutes);
        hoursRing.style.background = generateGradient(180, theme.hours);
        
        preview.appendChild(secondsRing);
        preview.appendChild(minutesRing);
        preview.appendChild(hoursRing);
        
        card.appendChild(preview);
        
        // Highlight if this is the current theme
        if (themeId === currentTheme) {
            card.style.borderColor = 'rgba(255,255,255,0.6)';
            card.style.background = 'rgba(255,255,255,0.08)';
        }
        
        const name = document.createElement('div');
        name.className = 'theme-card-name';
        name.textContent = themeNames[themeId];
        
        wrapper.appendChild(card);
        wrapper.appendChild(name);
        
        card.addEventListener('click', () => {
            currentTheme = themeId;
            // Update highlighting on all theme cards
            document.querySelectorAll('#themeCards .theme-card').forEach(c => {
                c.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                c.style.background = 'rgba(255, 255, 255, 0.02)';
            });
            // Highlight the selected card
            card.style.borderColor = 'rgba(255,255,255,0.6)';
            card.style.background = 'rgba(255,255,255,0.08)';
            showTexturePage();
        });
        
        container.appendChild(wrapper);
    });
}

function initTexturePage() {
    const container = document.getElementById('textureCards');
    container.innerHTML = '';
    
    mainTextures.forEach((textureId, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'theme-card-wrapper';
        
        const card = document.createElement('div');
        card.className = 'theme-card';
        
        const preview = document.createElement('div');
        preview.className = 'theme-card-preview';
        preview.setAttribute('data-texture-index', index);
        
        const theme = themes[currentTheme];
        
        // Create three concentric rings
        const secondsRing = document.createElement('div');
        secondsRing.className = 'theme-card-ring seconds';
        
        const minutesRing = document.createElement('div');
        minutesRing.className = 'theme-card-ring minutes';
        
        const hoursRing = document.createElement('div');
        hoursRing.className = 'theme-card-ring hours';
        
        // Apply gradients to each ring with static angles
        secondsRing.style.background = generateGradient(0, theme.seconds);
        minutesRing.style.background = generateGradient(90, theme.minutes);
        hoursRing.style.background = generateGradient(180, theme.hours);
        
        preview.appendChild(secondsRing);
        preview.appendChild(minutesRing);
        preview.appendChild(hoursRing);
        
        card.appendChild(preview);
        
        // Highlight if this is the current texture
        if (textureId === currentTexture) {
            card.style.borderColor = 'rgba(255,255,255,0.6)';
            card.style.background = 'rgba(255,255,255,0.08)';
        }
        
        const name = document.createElement('div');
        name.className = 'theme-card-name';
        name.textContent = textureNames[textureId];
        
        wrapper.appendChild(card);
        wrapper.appendChild(name);
        
        card.addEventListener('click', () => {
            currentTexture = textureId;
            
            // Update highlighting on all texture cards
            document.querySelectorAll('#textureCards .theme-card').forEach(c => {
                c.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                c.style.background = 'rgba(255, 255, 255, 0.02)';
            });
            
            card.style.borderColor = 'rgba(255,255,255,0.6)';
            card.style.background = 'rgba(255,255,255,0.08)';
            
            showClockView();
        });
        
        container.appendChild(wrapper);
    });
    
    // Render textures on each card after a brief delay to ensure sizing
    setTimeout(() => {
        mainTextures.forEach((textureId, index) => {
            const preview = document.querySelector(`#textureCards .theme-card-preview[data-texture-index="${index}"]`);
            if (preview) {
                renderTexture(textureId, `#textureCards .theme-card-preview[data-texture-index="${index}"]`);
            }
        });
    }, 100);
}

function showTexturePage() {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('clockView').classList.remove('active');   // safety
    document.getElementById('texturePage').classList.add('active');
    currentView = 'texture';
    initTexturePage();
}

function showClockView() {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('texturePage').classList.remove('active');
    document.getElementById('clockView').classList.add('active');
    document.getElementById('snapshotView').classList.remove('active');
    currentView = 'clock';

    renderTexture(currentTexture);
    renderTexture(currentTexture, '#snapshotView .clock-container'); // Also render in snapshot view
    startClock();
}

function showSnapshotView() {
    document.getElementById('snapshotView').classList.add('active');
    currentView = 'snapshot';
    renderTexture(currentTexture, '#snapshotView .clock-container');
    updateSnapshotViewClock();
}

function hideSnapshotView() {
    document.getElementById('snapshotView').classList.remove('active');
    currentView = 'clock';
}

function updateSnapshotViewClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;
    const milliseconds = now.getMilliseconds();

    const secondsAngle = ((seconds + milliseconds / 1000) / 60) * 360;
    const minutesAngle = ((minutes + seconds / 60) / 60) * 360;
    const hoursAngle = ((hours + minutes / 60 + seconds / 3600) / 12) * 360;

    const theme = themes[currentTheme];
    const secondsRing = document.querySelector('#snapshotView .seconds-ring');
    const minutesRing = document.querySelector('#snapshotView .minutes-ring');
    const hoursRing = document.querySelector('#snapshotView .hours-ring');

    if (secondsRing && minutesRing && hoursRing) {
        secondsRing.style.background = generateGradient(secondsAngle, theme.seconds);
        minutesRing.style.background = generateGradient(minutesAngle, theme.minutes);
        hoursRing.style.background = generateGradient(hoursAngle, theme.hours);
    }
    
    // Update time display
    const timeDisplay = document.querySelector('#snapshotView .time-display');
    if (timeDisplay) {
        const displayHours = String(now.getHours()).padStart(2, '0');
        const displayMinutes = String(minutes).padStart(2, '0');
        const displaySeconds = String(seconds).padStart(2, '0');
        
        if (timeFormat === 'military') {
            timeDisplay.textContent = `${displayHours}:${displayMinutes}:${displaySeconds}`;
            timeDisplay.classList.add('show');
        } else if (timeFormat === 'ampm') {
            const hour12 = now.getHours() % 12 || 12;
            const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
            timeDisplay.textContent = `${String(hour12).padStart(2, '0')}:${displayMinutes}:${displaySeconds} ${ampm}`;
            timeDisplay.classList.add('show');
        } else {
            timeDisplay.classList.remove('show');
        }
    }
}

function backFromClockView() {
    document.getElementById('clockView').classList.remove('active');
    stopClock();

    if (launchedFromSavedConfig) {
        launchedFromSavedConfig = false; // reset flag
        backFromTexturePage();           // sends you to landing + refresh
        return;
    }

    document.getElementById('texturePage').classList.add('active');
    currentView = 'texture';
    initTexturePage();
}

function backFromTexturePage() {
    document.getElementById('clockView').classList.remove('active');   // safety
    document.getElementById('texturePage').classList.remove('active');
    document.getElementById('landingPage').classList.remove('hidden');
    currentView = 'landing';
    initLandingPage(); // refresh highlight
}

// Event Listeners
document.getElementById('backBtn').addEventListener('click', backFromClockView);
document.getElementById('backFromTextureBtn').addEventListener('click', backFromTexturePage);
document.getElementById('openWidgetBtn').addEventListener('click', () => {
    console.log('Open Widget button clicked');
    
    // Show the full-screen snapshot view
    showSnapshotView();
    console.log('Snapshot view should now be visible');
    
    // Capture snapshot after a longer delay so you can see the screen
    setTimeout(() => {
        console.log('Starting snapshot capture...');
        captureClockSnapshot();
        
        // Return to clock view after capture - longer delay so user can see it
        setTimeout(() => {
            console.log('Hiding snapshot view...');
            hideSnapshotView();
            
            // Open Android widget settings
            if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                Capacitor.Plugins.App.openWidgetSettings().then(result => {
                    console.log('Widget settings opened:', result);
                }).catch(err => {
                    console.error('Failed to open widget settings:', err);
                    window.open('widget://open', '_system');
                });
            } else {
                console.log('Not on native platform, skipping widget settings');
            }
        }, 2000); // Wait 2 seconds so user can see the snapshot view
    }, 1000); // Wait 1 second for snapshot view to fully render
});

let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        if (currentView === 'clock' && currentTexture !== 'none') {
            renderTexture(currentTexture);
        }
    }, 100);
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopClock();
    else if (currentView === 'clock') startClock();
});

// ============ CAPACITOR SNAPSHOT INTEGRATION ============
// Load Capacitor plugin from global object (no import needed)
let Snapshot = null;
let snapshotPluginReady = false;

function initializeCapacitorPlugin() {
  if (window.Capacitor && window.Capacitor.Plugins) {
    Snapshot = window.Capacitor.Plugins.Snapshot;
    snapshotPluginReady = !!Snapshot;
    console.log(snapshotPluginReady
      ? "✓ Snapshot plugin loaded from Capacitor.Plugins"
      : "✗ Snapshot plugin not found in Capacitor.Plugins");
  } else if (window.Capacitor) {
    console.log("Capacitor found but Plugins object not available");
  } else {
    console.log("Running in browser mode (no Capacitor)");
  }
}

initializeCapacitorPlugin();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (!snapshotPluginReady) initializeCapacitorPlugin();
  });
} else {
  setTimeout(() => {
    if (!snapshotPluginReady) initializeCapacitorPlugin();
  }, 100);
}

/**
 * Capture and save a snapshot of the clock for the Android widget
 * Manual canvas renderer (reliable in Android WebView)
 */
async function captureClockSnapshot() {
  try {
    // Only snapshot when we're actually on the clock view
    if (currentView !== "clock") return;

    const size = 512; // square = no ellipse in widget
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, size, size);

    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;
    const milliseconds = now.getMilliseconds();

    const secondsAngle = ((seconds + milliseconds / 1000) / 60) * 360;
    const minutesAngle = ((minutes + seconds / 60) / 60) * 360;
    const hoursAngle   = ((hours + minutes / 60 + seconds / 3600) / 12) * 360;

    const theme = themes[currentTheme];

    // radii match your CSS proportions: 100%, 83.3%, 58.3%
    const rSeconds = (size * 0.5) * 1.0;
    const rMinutes = (size * 0.5) * 0.833;
    const rHours   = (size * 0.5) * 0.583;

    // Draw conic disks (outer → inner)
    drawConicDisk(ctx, size / 2, size / 2, rSeconds, secondsAngle, theme.seconds);
    drawConicDisk(ctx, size / 2, size / 2, rMinutes, minutesAngle, theme.minutes);
    drawConicDisk(ctx, size / 2, size / 2, rHours,   hoursAngle,   theme.hours);

    // Texture markers
    if (currentTexture && currentTexture !== "none") {
      drawTextureMarkersCanvas(ctx, size, currentTexture);
    }

    // Time text (ONLY 12-hour AM/PM because that's what your UI uses)
    if (timeFormat === "ampm") {
      const mm = String(minutes).padStart(2, "0");
      const ss = String(seconds).padStart(2, "0");
      const hour12 = now.getHours() % 12 || 12;
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      const text = `${String(hour12).padStart(2, "0")}:${mm}:${ss} ${ampm}`;

      ctx.save();
      ctx.font = `${Math.round(size * 0.08)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(255,255,255,0.3)";
      ctx.shadowBlur = Math.round(size * 0.03);
      ctx.fillText(text, size / 2, size / 2 - size * 0.12);
      ctx.restore();
    }

    const base64Data = canvas.toDataURL("image/png");

    if (snapshotPluginReady && Snapshot) {
      const result = await Snapshot.savePngBase64({ data: base64Data });
      console.log("✓ Widget snapshot saved successfully:", result);
    } else {
      console.log("Snapshot captured (browser mode - not saved)");
    }
  } catch (err) {
    console.error("Snapshot capture failed:", err);
  }
}

/* ================= Helpers for manual conic rendering ================= */

function drawConicDisk(ctx, cx, cy, radius, rotationDeg, colorData) {
  const [hue, sat, ...lightness] = colorData;

  const stops = [
    { d:   0, s: sat,     l: lightness[0] },
    { d:   5, s: sat + 3, l: lightness[1] },
    { d:  15, s: sat + 5, l: lightness[2] },
    { d:  30, s: sat,     l: lightness[3] },
    { d:  60, s: sat - 3, l: lightness[4] },
    { d: 120, s: sat - 5, l: lightness[5] },
    { d: 240, s: sat - 3, l: lightness[4] },
    { d: 300, s: sat,     l: lightness[3] },
    { d: 345, s: sat + 5, l: lightness[2] },
    { d: 355, s: sat + 3, l: lightness[1] },
    { d: 360, s: sat,     l: lightness[0] }
  ];

  const step = 2; // degrees per wedge

  for (let a = 0; a < 360; a += step) {
    // Match CSS conic-gradient(from rotationDeg): sample at (a - rotationDeg)
    const sampleDeg = (a - rotationDeg + 360) % 360;
    const sampled = sampleStops(stops, sampleDeg);

    ctx.fillStyle = hslToRgbCss(hue, sampled.s, sampled.l);

    // Canvas 0° is 3 o'clock; CSS 0° is 12 o'clock → shift -90°
    const start = degToRad(a - 90);
    const end   = degToRad(a + step - 90);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fill();
  }
}

function sampleStops(stops, deg) {
  let a = deg;
  if (a < 0) a += 360;
  if (a > 360) a -= 360;

  let i = 0;
  while (i < stops.length - 1 && a > stops[i + 1].d) i++;

  const s0 = stops[i];
  const s1 = stops[Math.min(i + 1, stops.length - 1)];
  const span = (s1.d - s0.d) || 1;
  const t = (a - s0.d) / span;

  return {
    s: lerp(s0.s, s1.s, t),
    l: lerp(s0.l, s1.l, t)
  };
}

function drawTextureMarkersCanvas(ctx, size, textureType) {
  const cx = size / 2;
  const cy = size / 2;

  const radius = (size * 0.5) * 0.94; // similar to DOM version
  const fontSize = size * 0.04;
  const dotR = (size * 0.013) / 2;

  let positions = [];
  if (textureType === "cardinal") positions = [0, 3, 6, 9];
  else positions = Array.from({ length: 12 }, (_, i) => i);

  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${Math.round(fontSize)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

  positions.forEach(i => {
    const angle = degToRad(i * 30);
    const x = cx + radius * Math.sin(angle);
    const y = cy - radius * Math.cos(angle);

    if (textureType === "roman") {
      ctx.fillText(romanNumerals[i], x, y);
    } else if (textureType === "numbers") {
      ctx.fillText(i === 0 ? "12" : String(i), x, y);
    } else if (textureType === "cardinal") {
      const t = (i === 0) ? "12" : (i === 3 ? "3" : (i === 6 ? "6" : "9"));
      ctx.fillText(t, x, y);
    } else if (textureType === "dots") {
      ctx.beginPath();
      ctx.arc(x, y, dotR, 0, Math.PI * 2);
      ctx.fill();
    } else if (textureType === "mixed") {
      if (i % 2 === 0) ctx.fillText(romanNumerals[i], x, y);
      else {
        ctx.beginPath();
        ctx.arc(x, y, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  ctx.restore();
}

function hslToRgbCss(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hh = (h % 360) / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r = 0, g = 0, b = 0;

  if (0 <= hh && hh < 1) { r = c; g = x; b = 0; }
  else if (1 <= hh && hh < 2) { r = x; g = c; b = 0; }
  else if (2 <= hh && hh < 3) { r = 0; g = c; b = x; }
  else if (3 <= hh && hh < 4) { r = 0; g = x; b = c; }
  else if (4 <= hh && hh < 5) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  const m = l - c / 2;
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `rgb(${r},${g},${b})`;
}

function degToRad(d) { return (d * Math.PI) / 180; }
function lerp(a, b, t) { return a + (b - a) * t; }

/**
 * Start automatic snapshot updates for widget
 */
function startAutoSnapshots() {
  if (!snapshotPluginReady) initializeCapacitorPlugin();

  // initial snapshot after the clock is rendered
  setTimeout(() => {
    if (currentView === "clock") captureClockSnapshot();
  }, 1500);

  // every 30 seconds
  setInterval(() => {
    if (currentView === "clock") captureClockSnapshot();
  }, 30000);
}

// Initialize app
const hadSavedConfig = loadConfig();
initLandingPage();
if (hadSavedConfig) {
  launchedFromSavedConfig = true;
  showClockView();
}

// Start automatic snapshots for widget
startAutoSnapshots();
