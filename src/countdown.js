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

export const formatLaunchLabel = launchAt => {
    const target = new Date(launchAt);
    if (!Number.isFinite(target.getTime())) throw new Error('Invalid launch date.');

    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).formatToParts(target);
    const value = type => parts.find(part => part.type === type)?.value || '';

    return `${value('day')} ${value('month').toUpperCase()} ${value('year')} · ${value('hour')}:${value('minute')} ${value('dayPeriod').toUpperCase()} IST`;
};
