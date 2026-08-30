import './styles.css';
import { formatLaunchLabel, formatUnit, getCountdown } from './countdown';
import { WaitlistError, createWaitlistClient } from './waitlist';

const DEFAULT_LAUNCH_AT = '2026-09-01T20:06:00+05:30';
const launchAt = import.meta.env.VITE_LAUNCH_AT || DEFAULT_LAUNCH_AT;
const waitlist = createWaitlistClient({
    supabaseUrl: __SUPABASE_URL__,
    anonKey: __SUPABASE_ANON_KEY__,
});

const hours = document.querySelector('#hours');
const minutes = document.querySelector('#minutes');
const seconds = document.querySelector('#seconds');
const launchChip = document.querySelector('.launch-chip');
const countdownKicker = document.querySelector('.countdown-kicker');
const launchDateLabel = document.querySelector('#launch-date-label');

launchDateLabel.textContent = formatLaunchLabel(launchAt);

const renderCountdown = () => {
    const countdown = getCountdown(launchAt);
    hours.textContent = formatUnit(countdown.hours);
    minutes.textContent = formatUnit(countdown.minutes);
    seconds.textContent = formatUnit(countdown.seconds);

    if (countdown.complete) {
        countdownKicker.textContent = 'HUH? IS LIVE';
        launchChip.innerHTML = '<span class="pulse" aria-hidden="true"></span> NOW LIVE';
        document.title = 'Huh? Video Explainer — Now Live';
    }
};

renderCountdown();
window.setInterval(renderCountdown, 1000);

const dialog = document.querySelector('#waitlist-dialog');
const form = document.querySelector('#waitlist-form');
const formStatus = document.querySelector('#form-status');
const submitButton = document.querySelector('#submit-waitlist');

const openDialog = () => {
    formStatus.textContent = '';
    formStatus.className = 'form-status';
    dialog.showModal();
    window.setTimeout(() => document.querySelector('#name').focus(), 0);
};

document.querySelectorAll('.js-open-waitlist').forEach(button => {
    button.addEventListener('click', openDialog);
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
});

form.addEventListener('submit', async event => {
    event.preventDefault();

    if (!form.reportValidity()) return;
    submitButton.disabled = true;
    submitButton.textContent = 'ADDING YOU...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
        const result = await waitlist.join({
            name: form.elements.name.value,
            email: form.elements.email.value,
        });
        formStatus.textContent = result.duplicate
            ? 'YOU’RE ALREADY ON THE LIST. SEE YOU AT LAUNCH.'
            : 'YOU’RE IN. WATCH YOUR INBOX.';
        formStatus.classList.add('success');
        submitButton.textContent = 'WELCOME TO THE WAITLIST ✓';
        form.reset();
    } catch (error) {
        formStatus.textContent = error instanceof WaitlistError
            ? error.message.toUpperCase()
            : 'SOMETHING BROKE. PLEASE TRY AGAIN.';
        formStatus.classList.add('error');
        submitButton.disabled = false;
        submitButton.textContent = 'TRY AGAIN →';
    }
});
