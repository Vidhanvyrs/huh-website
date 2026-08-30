import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('the launch page links to a first-party privacy page', async () => {
    const launchPage = await readFile(new URL('../index.html', import.meta.url), 'utf8');

    assert.match(launchPage, /href="\/privacy\.html"/);
    assert.doesNotMatch(launchPage, /github\.com\/Vidhanvyrs\/Huh\/blob\/master\/PRIVACY_POLICY\.md/);
});

test('the privacy page contains the required disclosures and contact', async () => {
    const privacyPage = await readFile(new URL('../privacy.html', import.meta.url), 'utf8');

    assert.match(privacyPage, /backend hosted on Render/i);
    assert.match(privacyPage, /surrounding transcript context/i);
    assert.match(privacyPage, /Google Gemini API/i);
    assert.match(privacyPage, /Data Retention/i);
    assert.match(privacyPage, /vidhanvyrs@gmail\.com/i);
});
