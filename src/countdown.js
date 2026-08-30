export const getCountdown = (launchAt, now = Date.now()) => {
    const target = new Date(launchAt).getTime();
    if (!Number.isFinite(target)) throw new Error('Invalid launch date.');

    const remainingMs = Math.max(0, target - now);
    const totalSeconds = Math.floor(remainingMs / 1000);

    return {
        complete: remainingMs === 0,
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
    };
};

export const formatUnit = value => String(value).padStart(2, '0');
