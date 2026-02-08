export function getDevice(breakpoints) {
    const w = window.innerWidth;
    if (w <= breakpoints.mobile.max) return 'mobile';
    if (w <= breakpoints.tablet.max) return 'tablet';
    if (w <= breakpoints.desktop.max) return 'desktop';
    return '_4k';
}

export function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}
