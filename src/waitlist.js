const normalizeBaseUrl = value => String(value || '').replace(/\/$/, '');

export class WaitlistError extends Error {
    constructor(message, code = 'WAITLIST_ERROR') {
        super(message);
        this.name = 'WaitlistError';
        this.code = code;
    }
}

export const createWaitlistClient = ({ supabaseUrl, anonKey, fetchImpl = fetch }) => {
    const baseUrl = normalizeBaseUrl(supabaseUrl);

    return {
        async join({ name, email }) {
            if (!baseUrl || !anonKey) {
                throw new WaitlistError('Waitlist configuration is missing.', 'CONFIG_MISSING');
            }

            const response = await fetchImpl(`${baseUrl}/rest/v1/waitlist_signups`, {
                method: 'POST',
                headers: {
                    apikey: anonKey,
                    Authorization: `Bearer ${anonKey}`,
                    'Content-Type': 'application/json',
                    Prefer: 'return=minimal',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                }),
            });

            if (response.ok) return { joined: true, duplicate: false };
            if (response.status === 409) return { joined: true, duplicate: true };

            throw new WaitlistError('Could not join right now. Please try again.', 'REQUEST_FAILED');
        },
    };
};
